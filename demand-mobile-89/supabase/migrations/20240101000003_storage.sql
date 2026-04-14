-- ============================================================
-- GoHandyMate – Storage Buckets & Policies
-- Migration: 20240101000003_storage.sql
-- ============================================================

-- ─── Bucket: avatars (public) ────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,  -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public            = excluded.public,
  file_size_limit   = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Anyone can view avatars
create policy "avatars: public read"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Authenticated users can upload to their own folder: avatars/{user_id}/*
create policy "avatars: owner upload"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars: owner update"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars: owner delete"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ─── Bucket: documents (private – pro verification) ──────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  false,
  20971520,  -- 20 MB
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update set
  public            = excluded.public,
  file_size_limit   = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Only the owner can read their documents: documents/{user_id}/*
create policy "documents: owner read"
  on storage.objects for select
  using (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "documents: owner upload"
  on storage.objects for insert
  with check (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "documents: owner delete"
  on storage.objects for delete
  using (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ─── Bucket: attachments (private – chat file sharing) ───────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'attachments',
  'attachments',
  false,
  10485760,  -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
)
on conflict (id) do update set
  public            = excluded.public,
  file_size_limit   = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Only conversation parties can access attachments
-- Attachments are stored as: attachments/{conversation_id}/{filename}
create policy "attachments: parties read"
  on storage.objects for select
  using (
    bucket_id = 'attachments'
    and exists (
      select 1 from public.conversations c
      where c.id = (storage.foldername(name))[1]::uuid
        and (c.customer_id = auth.uid() or c.handyman_user_id = auth.uid())
    )
  );

create policy "attachments: sender upload"
  on storage.objects for insert
  with check (
    bucket_id = 'attachments'
    and exists (
      select 1 from public.conversations c
      where c.id = (storage.foldername(name))[1]::uuid
        and (c.customer_id = auth.uid() or c.handyman_user_id = auth.uid())
    )
  );

create policy "attachments: sender delete"
  on storage.objects for delete
  using (
    bucket_id = 'attachments'
    and exists (
      select 1 from public.conversations c
      where c.id = (storage.foldername(name))[1]::uuid
        and (c.customer_id = auth.uid() or c.handyman_user_id = auth.uid())
    )
  );
