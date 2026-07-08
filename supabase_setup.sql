-- SUPABASE SETUP FOR LUMETHIS (RBAC Implementation)

-- 1. Create the Users/Profiles table
-- This extends the default auth.users table in Supabase
create table profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  role text check (role in ('GROUP_ADMIN', 'SUBSIDIARY_MANAGER')),
  subsidiary text, -- Can be null for Group Admins
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create the Submissions table
create table training_submissions (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  submitted_by uuid references profiles(id),
  subsidiary text not null,
  version text,
  status text check (status in ('Pending Review', 'Changes Requested', 'Group Approved', 'Active')),
  compliance_score integer,
  overview text,
  request_notes text,
  content jsonb, -- Stores the modules array
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
alter table training_submissions enable row level security;
alter table profiles enable row level security;

-- 4. RLS POLICIES

-- Policy A: Group Admins can SEE ALL submissions
create policy "Group Admins see all submissions"
on training_submissions
for select
using (
  auth.uid() in (
    select id from profiles where role = 'GROUP_ADMIN'
  )
);

-- Policy B: Subsidiary Managers can ONLY SEE their OWN subsidiary's submissions
create policy "Subsidiary Managers see own submissions"
on training_submissions
for select
using (
  subsidiary = (
    select subsidiary from profiles where id = auth.uid()
  )
);

-- Policy C: Subsidiary Managers can INSERT submissions for their own subsidiary
create policy "Subsidiary Managers can insert"
on training_submissions
for insert
with check (
  subsidiary = (
    select subsidiary from profiles where id = auth.uid()
  )
);

-- Policy D: Group Admins can UPDATE status (Approve/Reject)
create policy "Group Admins can update status"
on training_submissions
for update
using (
  auth.uid() in (
    select id from profiles where role = 'GROUP_ADMIN'
  )
);

-- 5. Helper Function to handle new user creation
-- Automatically creates a profile entry when a user signs up via Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role, subsidiary)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'role', new.raw_user_meta_data->>'subsidiary');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();