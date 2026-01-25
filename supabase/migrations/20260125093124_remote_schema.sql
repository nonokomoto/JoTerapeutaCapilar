drop extension if exists "pg_net";

drop policy "Admin can delete profiles" on "public"."profiles";

drop policy "Admin can update all profiles" on "public"."profiles";

drop policy "Admin can view all profiles" on "public"."profiles";

alter table "public"."client_updates" add column "category" text;

alter table "public"."client_updates" add column "client_liked" boolean default false;

alter table "public"."client_updates" add column "client_read_at" timestamp with time zone;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
    SELECT EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    );
  $function$
;


  create policy "Admin can delete profiles"
  on "public"."profiles"
  as permissive
  for delete
  to public
using (public.is_admin());



  create policy "Admin can update all profiles"
  on "public"."profiles"
  as permissive
  for update
  to public
using (public.is_admin());



  create policy "Admin can view all profiles"
  on "public"."profiles"
  as permissive
  for select
  to public
using (public.is_admin());



  create policy "Admin can upload 1mt4rzk_0"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((( SELECT profiles.role
   FROM public.profiles
  WHERE (profiles.id = auth.uid())) = 'admin'::text));



  create policy "Admin can upload"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'attachments'::text) AND (( SELECT profiles.role
   FROM public.profiles
  WHERE (profiles.id = auth.uid())) = 'admin'::text)));



  create policy "Public read 1mt4rzk_0"
  on "storage"."objects"
  as permissive
  for select
  to public
using (true);



  create policy "Public read access"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'attachments'::text));



