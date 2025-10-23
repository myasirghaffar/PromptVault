-- 1) Add username column (nullable initially to allow backfill), with a simple format check
alter table public.profiles
  add column if not exists username text;

-- 2) Backfill existing rows (stable unique fallback)
update public.profiles
set username = 'user_' || substr(id::text, 1, 8)
where username is null;

-- 3) Enforce not null
alter table public.profiles
  alter column username set not null;

-- 4) Enforce uniqueness (case-insensitive) via unique index on lower(username)
do $$
begin
  if not exists (
    select 1 from pg_indexes
    where schemaname = 'public' and indexname = 'profiles_username_lower_unique'
  ) then
    create unique index profiles_username_lower_unique on public.profiles (lower(username));
  end if;
end $$;

-- 5) Optional: constrain allowed characters/length
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_username_format_chk'
  ) then
    alter table public.profiles
      add constraint profiles_username_format_chk
      check (username ~ '^[a-z0-9_]{3,20}$');
  end if;
end $$;

-- 6) Replace the signup trigger to copy username from auth metadata when available
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $fn$
declare
  raw_uname text;
  final_uname text;
begin
  -- read username from auth.users raw_user_meta_data
  raw_uname := coalesce((new.raw_user_meta_data->>'username'), null);

  if raw_uname is null or raw_uname = '' then
    -- fallback if not provided
    final_uname := 'user_' || substr(new.id::text, 1, 8);
  else
    -- normalize to lowercase
    final_uname := lower(raw_uname);
  end if;

  -- if conflict on username, append short suffix from user id (should be rare)
  begin
    insert into public.profiles (id, email, is_admin, username)
    values (new.id, new.email, false, final_uname);
  exception when unique_violation then
    insert into public.profiles (id, email, is_admin, username)
    values (new.id, new.email, false, final_uname || '_' || substr(new.id::text, 1, 4));
  end;

  return new;
end;
$fn$;

-- ensure trigger exists (re-create safely)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
