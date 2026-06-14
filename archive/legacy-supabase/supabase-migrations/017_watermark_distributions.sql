create table watermark_distributions (
  id              uuid        default uuid_generate_v4() primary key,
  recipient_name  text        not null,
  recipient_email text,
  filename        text        not null,
  distributed_by  text        not null default 'admin',
  email_sent      boolean     not null default false,
  watermarked_at  timestamptz default now()
);
