-- Users are handled by Supabase Auth automatically

-- Questions table
create table questions (
  id uuid default gen_random_uuid() primary key,
  question text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_answer char(1) not null check (correct_answer in ('A','B','C','D')),
  category text default 'General',
  created_at timestamp with time zone default now()
);

-- Exam attempts
create table attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  score integer not null,
  total integer not null,
  taken_at timestamp with time zone default now()
);

-- Per-question results per attempt
create table attempt_answers (
  id uuid default gen_random_uuid() primary key,
  attempt_id uuid references attempts(id) on delete cascade,
  question_id uuid references questions(id) on delete cascade,
  selected_answer char(1),
  is_correct boolean not null
);

-- Admin role table
create table user_roles (
  user_id uuid references auth.users(id) on delete cascade primary key,
  role text not null default 'student'
);

-- Enable Row Level Security
alter table questions enable row level security;
alter table attempts enable row level security;
alter table attempt_answers enable row level security;
alter table user_roles enable row level security;

-- RLS Policies

-- Questions: Authenticated users can read, only admins can write
create policy "Users can read questions" on questions for select using (auth.role() = 'authenticated');
create policy "Admins can insert questions" on questions for insert using (exists (
  select 1 from user_roles where user_id = auth.uid() and role = 'admin'
));
create policy "Admins can update questions" on questions for update using (exists (
  select 1 from user_roles where user_id = auth.uid() and role = 'admin'
));
create policy "Admins can delete questions" on questions for delete using (exists (
  select 1 from user_roles where user_id = auth.uid() and role = 'admin'
));

-- Attempts: Users can read their own attempts, insert their own attempts
create policy "Users can read own attempts" on attempts for select using (auth.uid() = user_id);
create policy "Users can insert own attempts" on attempts for insert with check (auth.uid() = user_id);

-- Attempt Answers: Users can read their own attempt answers, insert their own attempt answers
create policy "Users can read own attempt answers" on attempt_answers for select using (
  exists (
    select 1 from attempts where attempts.id = attempt_answers.attempt_id and attempts.user_id = auth.uid()
  )
);
create policy "Users can insert own attempt answers" on attempt_answers for insert with check (
  exists (
    select 1 from attempts where attempts.id = attempt_answers.attempt_id and attempts.user_id = auth.uid()
  )
);

-- User Roles: Users can read their own role, admins can manage roles
create policy "Users can read own role" on user_roles for select using (auth.uid() = user_id);
create policy "Admins can manage roles" on user_roles for all using (exists (
  select 1 from user_roles where user_id = auth.uid() and role = 'admin'
));

-- Insert sample data (optional - you can delete this later)
insert into questions (question, option_a, option_b, option_c, option_d, correct_answer, category) values
('What is 2 + 2?', '3', '4', '5', '6', 'B', 'Math'),
('What color is the sky?', 'Red', 'Green', 'Blue', 'Yellow', 'C', 'General'),
('What is the capital of France?', 'London', 'Berlin', 'Paris', 'Madrid', 'C', 'Geography'),
('How many legs does a cat have?', '2', '4', '6', '8', 'B', 'General'),
('What is 10 - 3?', '5', '6', '7', '8', 'C', 'Math');
