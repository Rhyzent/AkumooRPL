-- Allow inserting first admin if no admin exists yet
drop policy if exists "Admins manage roles" on public.user_roles;

create policy "Allow first admin insert" on public.user_roles 
  for insert with check (
    (role = 'admin' AND NOT public.admin_exists()) OR 
    public.has_role(auth.uid(), 'admin')
  );

create policy "Admins manage roles update" on public.user_roles 
  for update to authenticated 
  using (public.has_role(auth.uid(), 'admin')) 
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins delete roles" on public.user_roles 
  for delete to authenticated 
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins select roles" on public.user_roles 
  for select to authenticated 
  using (public.has_role(auth.uid(), 'admin'));
