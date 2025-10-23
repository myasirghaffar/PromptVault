-- Add status field to prompts table for approval workflow
alter table public.prompts 
add column if not exists status text not null default 'approved' 
check (status in ('pending', 'approved', 'rejected'));

-- Update existing prompts to be approved
update public.prompts set status = 'approved' where status is null;

-- Create index for faster status queries
create index if not exists prompts_status_idx on public.prompts(status);

-- Update RLS policies to allow users to insert their own prompts with pending status
drop policy if exists "prompts_insert_admin" on public.prompts;

create policy "prompts_insert_authenticated"
  on public.prompts for insert
  with check (
    auth.uid() is not null
    and created_by = auth.uid()
    and status = 'pending'
  );

-- Allow admins to insert with any status
create policy "prompts_insert_admin_any_status"
  on public.prompts for insert
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

-- Update select policy to only show approved prompts to non-admins
drop policy if exists "prompts_select_all" on public.prompts;

create policy "prompts_select_approved"
  on public.prompts for select
  using (
    status = 'approved'
    or created_by = auth.uid()
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );
