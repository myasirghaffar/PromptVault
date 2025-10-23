-- Create prompts table
create table if not exists public.prompts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  prompt_text text not null,
  category text not null,
  tags text[] default '{}',
  image_url text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.prompts enable row level security;

-- Policies for prompts - anyone can view, only admins can create/update/delete
create policy "prompts_select_all"
  on public.prompts for select
  using (true);

create policy "prompts_insert_admin"
  on public.prompts for insert
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

create policy "prompts_update_admin"
  on public.prompts for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

create policy "prompts_delete_admin"
  on public.prompts for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

-- Create index for faster category queries
create index if not exists prompts_category_idx on public.prompts(category);

-- Create index for faster search
create index if not exists prompts_title_idx on public.prompts using gin(to_tsvector('english', title));
create index if not exists prompts_description_idx on public.prompts using gin(to_tsvector('english', description));
