-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE SCHEMA "manager";
--> statement-breakpoint
CREATE TABLE "manager"."firms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"hq" text,
	"founded" integer,
	"aum_value" numeric(20, 2),
	"aum_currency" text DEFAULT 'USD' NOT NULL,
	"aum_as_of" date,
	"aum_qualifier" text,
	"strategy" text,
	"domicile" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "firms_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "manager"."firms" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "manager"."magic_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"consumed_at" timestamp with time zone,
	"ip_address" "inet",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "magic_links_token_hash_key" UNIQUE("token_hash")
);
--> statement-breakpoint
ALTER TABLE "manager"."magic_links" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "manager"."invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_hash" text NOT NULL,
	"email" text NOT NULL,
	"firm_name_hint" text,
	"invited_by" text NOT NULL,
	"invited_by_role" text DEFAULT 'allocator' NOT NULL,
	"allocator_ref" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"accepted_at" timestamp with time zone,
	"accepted_firm_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "invites_token_hash_key" UNIQUE("token_hash")
);
--> statement-breakpoint
ALTER TABLE "manager"."invites" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "manager"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firm_id" uuid NOT NULL,
	"email" text NOT NULL,
	"full_name" text,
	"role" text DEFAULT 'member' NOT NULL,
	"invited_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_login_at" timestamp with time zone,
	"password_hash" text,
	"password_set_at" timestamp with time zone,
	"password_reset_token" text,
	"password_reset_sent_at" timestamp with time zone,
	"is_verified" boolean DEFAULT false NOT NULL,
	"verified_at" timestamp with time zone,
	"verified_by" text,
	"job_title" text,
	CONSTRAINT "users_email_key" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "manager"."users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "manager"."share_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firm_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"created_by" uuid NOT NULL,
	"recipient_email" text,
	"label" text,
	"expires_at" timestamp with time zone DEFAULT (now() + '90 days'::interval) NOT NULL,
	"revoked_at" timestamp with time zone,
	"pinned_snapshot_id" uuid,
	"view_count" integer DEFAULT 0 NOT NULL,
	"last_viewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "share_links_token_hash_key" UNIQUE("token_hash")
);
--> statement-breakpoint
ALTER TABLE "manager"."share_links" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "manager"."ddq_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firm_id" uuid NOT NULL,
	"framework_version" text DEFAULT 'v1.2026.05' NOT NULL,
	"chapter_num" smallint NOT NULL,
	"question_id" text NOT NULL,
	"answer_kind" text DEFAULT 'text' NOT NULL,
	"answer_text" text,
	"answer_choice" text,
	"answer_json" jsonb,
	"not_applicable" boolean DEFAULT false NOT NULL,
	"na_explanation" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" uuid,
	CONSTRAINT "ddq_responses_firm_id_framework_version_question_id_key" UNIQUE("firm_id","framework_version","question_id"),
	CONSTRAINT "ddq_responses_chapter_num_check" CHECK ((chapter_num >= 1) AND (chapter_num <= 8))
);
--> statement-breakpoint
ALTER TABLE "manager"."ddq_responses" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "manager"."ddq_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firm_id" uuid NOT NULL,
	"taken_at" timestamp with time zone DEFAULT now() NOT NULL,
	"framework_version" text NOT NULL,
	"responses_jsonb" jsonb NOT NULL,
	"documents_manifest" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "manager"."ddq_snapshots" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "manager"."documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firm_id" uuid NOT NULL,
	"chapter_num" smallint,
	"filename" text NOT NULL,
	"file_size" bigint,
	"storage_path" text NOT NULL,
	"uploaded_by" uuid,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "documents_chapter_num_check" CHECK ((chapter_num >= 1) AND (chapter_num <= 8))
);
--> statement-breakpoint
ALTER TABLE "manager"."documents" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "assessment_draft_edits" (
	"review_slug" text PRIMARY KEY NOT NULL,
	"intro1" text DEFAULT '' NOT NULL,
	"intro2" text DEFAULT '' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assessment_draft_edits" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"source" text DEFAULT 'Founder Activity' NOT NULL,
	"og_image" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_url_key" UNIQUE("url")
);
--> statement-breakpoint
ALTER TABLE "blog_posts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"organization" text,
	"portal_token" text,
	"fund_name" text,
	"plan" text DEFAULT 'starter' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"notes" text,
	"onboarded_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "customers_portal_token_key" UNIQUE("portal_token")
);
--> statement-breakpoint
ALTER TABLE "customers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "app_admins" (
	"email" text PRIMARY KEY NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	"added_by" text,
	"note" text
);
--> statement-breakpoint
ALTER TABLE "app_admins" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "followup_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_email" text NOT NULL,
	"review_slug" text NOT NULL,
	"question_key" text NOT NULL,
	"checked" boolean DEFAULT false NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "followup_notes_user_email_review_slug_question_key_key" UNIQUE("user_email","review_slug","question_key")
);
--> statement-breakpoint
ALTER TABLE "followup_notes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "manager_response_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firm_id" uuid NOT NULL,
	"question_id" text NOT NULL,
	"chapter_num" integer NOT NULL,
	"answer_text" text,
	"answer_choice" text,
	"answer_multi" text[],
	"uploaded_filename" text,
	"changed_by_email" text NOT NULL,
	"changed_by_name" text,
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "manager_response_history" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "reference_data_draft" (
	"review_slug" text PRIMARY KEY NOT NULL,
	"values" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reference_data_draft" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "investors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"full_name" text,
	"organization" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_login" timestamp with time zone,
	CONSTRAINT "investors_email_key" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "investors" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "early_access_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"organization" text,
	"phone" text,
	"message" text,
	"source" text,
	"status" text DEFAULT 'new' NOT NULL,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"contacted_at" timestamp with time zone,
	"notes" text
);
--> statement-breakpoint
ALTER TABLE "early_access_requests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "flag_draft_edits" (
	"review_slug" text PRIMARY KEY NOT NULL,
	"flags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "flag_draft_edits" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "manager_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firm_id" uuid NOT NULL,
	"question_id" text NOT NULL,
	"chapter_num" integer NOT NULL,
	"answer_text" text,
	"answer_choice" text,
	"answer_multi" jsonb,
	"uploaded_filename" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"review_status" text,
	"source_document_id" uuid,
	"source_quote" text,
	CONSTRAINT "manager_responses_firm_id_question_id_key" UNIQUE("firm_id","question_id"),
	CONSTRAINT "manager_responses_review_status_check" CHECK (review_status = ANY (ARRAY['flagged'::text, 'reviewed'::text]))
);
--> statement-breakpoint
ALTER TABLE "manager_responses" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "manager_team_invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firm_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"created_by" text NOT NULL,
	"label" text,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "manager_team_invites_token_hash_key" UNIQUE("token_hash")
);
--> statement-breakpoint
ALTER TABLE "manager_team_invites" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"email" text PRIMARY KEY NOT NULL,
	"source" text DEFAULT 'landing' NOT NULL,
	"resend_contact_id" text,
	"resend_synced_at" timestamp with time zone,
	"unsubscribed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"confirmed_at" timestamp with time zone,
	"confirm_token" text,
	"confirm_token_sent_at" timestamp with time zone,
	"unsubscribe_token" text,
	"consent_ip_hash" text,
	"consent_user_agent" text,
	"full_name" text,
	CONSTRAINT "newsletter_subscribers_confirm_token_key" UNIQUE("confirm_token"),
	CONSTRAINT "newsletter_subscribers_unsubscribe_token_key" UNIQUE("unsubscribe_token"),
	CONSTRAINT "source_check" CHECK (source = ANY (ARRAY['landing'::text, 'navbar'::text, 'contact'::text, 'footer'::text, 'signup'::text, 'early-access'::text, 'demo'::text]))
);
--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "manager_uploads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_email" text NOT NULL,
	"filename" text NOT NULL,
	"storage_path" text NOT NULL,
	"file_size" bigint,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"text_content" text,
	"text_extracted_at" timestamp with time zone,
	CONSTRAINT "manager_uploads_storage_path_key" UNIQUE("storage_path")
);
--> statement-breakpoint
CREATE TABLE "overview_draft_edits" (
	"review_slug" text PRIMARY KEY NOT NULL,
	"fields" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "overview_draft_edits" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "portal_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" text NOT NULL,
	"filename" text NOT NULL,
	"file_size" bigint,
	"storage_path" text,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "portal_documents" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "reference_data_sources" (
	"review_slug" text PRIMARY KEY NOT NULL,
	"sources" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reference_data_sources" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "report_draft_edits" (
	"review_slug" text PRIMARY KEY NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "report_draft_edits" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "report_publications" (
	"report_slug" text PRIMARY KEY NOT NULL,
	"fund_name" text,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_by" text
);
--> statement-breakpoint
ALTER TABLE "report_publications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "watermark_distributions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipient_name" text NOT NULL,
	"recipient_email" text,
	"filename" text NOT NULL,
	"distributed_by" text DEFAULT 'admin' NOT NULL,
	"email_sent" boolean DEFAULT false NOT NULL,
	"watermarked_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "watermark_distributions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "remediation_draft_edits" (
	"review_slug" text PRIMARY KEY NOT NULL,
	"before_close" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"post_close" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "remediation_draft_edits" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "manager"."share_link_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"link_id" uuid NOT NULL,
	"ip_hash" text,
	"user_agent" text,
	"viewed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "manager"."share_link_views" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "investor_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"investor_id" uuid NOT NULL,
	"report_slug" text NOT NULL,
	"filename" text NOT NULL,
	"file_size" bigint,
	"storage_path" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"processed_at" timestamp with time zone,
	"processed_by" text,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "investor_documents_status_check" CHECK (status = ANY (ARRAY['pending'::text, 'processed'::text]))
);
--> statement-breakpoint
ALTER TABLE "investor_documents" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"full_name" text,
	"role" text DEFAULT 'analyst' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_login" timestamp with time zone,
	"organization" text,
	"user_type" text,
	"job_title" text,
	"aum" text,
	"portal_token" text,
	CONSTRAINT "users_email_key" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "call_prep_notes" (
	"review_slug" text NOT NULL,
	"note_key" text NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "call_prep_notes_pkey" PRIMARY KEY("review_slug","note_key")
);
--> statement-breakpoint
ALTER TABLE "call_prep_notes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "investor_reports" (
	"investor_id" uuid NOT NULL,
	"report_slug" text NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"assigned_by" text,
	CONSTRAINT "investor_reports_pkey" PRIMARY KEY("investor_id","report_slug")
);
--> statement-breakpoint
ALTER TABLE "investor_reports" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "topic_rating_edits" (
	"review_slug" text NOT NULL,
	"topic_number" integer NOT NULL,
	"rating" text NOT NULL,
	"rationale" text DEFAULT '' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "topic_rating_edits_pkey" PRIMARY KEY("review_slug","topic_number")
);
--> statement-breakpoint
ALTER TABLE "topic_rating_edits" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "risk_observation_edits" (
	"id" text NOT NULL,
	"review_slug" text NOT NULL,
	"severity" text NOT NULL,
	"title" text NOT NULL,
	"detail" text DEFAULT '' NOT NULL,
	"remediation" text DEFAULT '' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "risk_observation_edits_pkey" PRIMARY KEY("id","review_slug")
);
--> statement-breakpoint
ALTER TABLE "risk_observation_edits" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "manager"."invites" ADD CONSTRAINT "invites_accepted_firm_id_fkey" FOREIGN KEY ("accepted_firm_id") REFERENCES "manager"."firms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manager"."users" ADD CONSTRAINT "users_firm_id_fkey" FOREIGN KEY ("firm_id") REFERENCES "manager"."firms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manager"."share_links" ADD CONSTRAINT "share_links_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "manager"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manager"."share_links" ADD CONSTRAINT "share_links_firm_id_fkey" FOREIGN KEY ("firm_id") REFERENCES "manager"."firms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manager"."share_links" ADD CONSTRAINT "share_links_pinned_snapshot_id_fkey" FOREIGN KEY ("pinned_snapshot_id") REFERENCES "manager"."ddq_snapshots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manager"."ddq_responses" ADD CONSTRAINT "ddq_responses_firm_id_fkey" FOREIGN KEY ("firm_id") REFERENCES "manager"."firms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manager"."ddq_responses" ADD CONSTRAINT "ddq_responses_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "manager"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manager"."ddq_snapshots" ADD CONSTRAINT "ddq_snapshots_firm_id_fkey" FOREIGN KEY ("firm_id") REFERENCES "manager"."firms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manager"."documents" ADD CONSTRAINT "documents_firm_id_fkey" FOREIGN KEY ("firm_id") REFERENCES "manager"."firms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manager"."documents" ADD CONSTRAINT "documents_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "manager"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "followup_notes" ADD CONSTRAINT "followup_notes_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "public"."users"("email") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manager"."share_link_views" ADD CONSTRAINT "share_link_views_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "manager"."share_links"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investor_documents" ADD CONSTRAINT "investor_documents_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investor_reports" ADD CONSTRAINT "investor_reports_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_magic_links_email" ON "manager"."magic_links" USING btree ("email" text_ops,"created_at" text_ops);--> statement-breakpoint
CREATE INDEX "idx_manager_users_password_reset_token" ON "manager"."users" USING btree ("password_reset_token" text_ops) WHERE (password_reset_token IS NOT NULL);--> statement-breakpoint
CREATE INDEX "idx_manager_users_pending_verification" ON "manager"."users" USING btree ("created_at" timestamptz_ops) WHERE (is_verified = false);--> statement-breakpoint
CREATE INDEX "idx_share_links_firm" ON "manager"."share_links" USING btree ("firm_id" timestamptz_ops,"created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_ddq_responses_firm_chapter" ON "manager"."ddq_responses" USING btree ("firm_id" int2_ops,"chapter_num" int2_ops);--> statement-breakpoint
CREATE INDEX "idx_documents_firm_chapter" ON "manager"."documents" USING btree ("firm_id" uuid_ops,"chapter_num" uuid_ops) WHERE (deleted_at IS NULL);--> statement-breakpoint
CREATE INDEX "manager_documents_firm_date" ON "manager"."documents" USING btree ("firm_id" timestamptz_ops,"uploaded_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_blog_posts_visible_published" ON "blog_posts" USING btree ("is_visible" timestamptz_ops,"published_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "customers_created_at_idx" ON "customers" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "customers_email_idx" ON "customers" USING btree ("email" text_ops);--> statement-breakpoint
CREATE INDEX "customers_portal_token_idx" ON "customers" USING btree ("portal_token" text_ops);--> statement-breakpoint
CREATE INDEX "customers_status_idx" ON "customers" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "app_admins_added_at_idx" ON "app_admins" USING btree ("added_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_followup_notes_user_slug" ON "followup_notes" USING btree ("user_email" text_ops,"review_slug" text_ops);--> statement-breakpoint
CREATE INDEX "idx_mrh_question" ON "manager_response_history" USING btree ("firm_id" uuid_ops,"question_id" text_ops,"changed_at" uuid_ops);--> statement-breakpoint
CREATE INDEX "early_access_requests_created_at_idx" ON "early_access_requests" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "early_access_requests_email_idx" ON "early_access_requests" USING btree ("email" text_ops);--> statement-breakpoint
CREATE INDEX "early_access_requests_status_idx" ON "early_access_requests" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "manager_responses_firm" ON "manager_responses" USING btree ("firm_id" int4_ops,"chapter_num" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_manager_team_invites_firm" ON "manager_team_invites" USING btree ("firm_id" timestamptz_ops,"created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_newsletter_subscribers_confirm_token" ON "newsletter_subscribers" USING btree ("confirm_token" text_ops) WHERE (confirm_token IS NOT NULL);--> statement-breakpoint
CREATE INDEX "idx_newsletter_subscribers_created_at" ON "newsletter_subscribers" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_newsletter_subscribers_unsubscribe_token" ON "newsletter_subscribers" USING btree ("unsubscribe_token" text_ops) WHERE (unsubscribe_token IS NOT NULL);--> statement-breakpoint
CREATE INDEX "manager_uploads_email_date" ON "manager_uploads" USING btree ("user_email" text_ops,"uploaded_at" text_ops);--> statement-breakpoint
CREATE INDEX "idx_portal_documents_token" ON "portal_documents" USING btree ("token" text_ops,"uploaded_at" text_ops);--> statement-breakpoint
CREATE INDEX "idx_share_link_views_link" ON "manager"."share_link_views" USING btree ("link_id" timestamptz_ops,"viewed_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_investor_documents_investor_slug" ON "investor_documents" USING btree ("investor_id" text_ops,"report_slug" text_ops);--> statement-breakpoint
CREATE INDEX "idx_call_prep_notes_slug" ON "call_prep_notes" USING btree ("review_slug" text_ops);--> statement-breakpoint
CREATE INDEX "idx_topic_rating_slug" ON "topic_rating_edits" USING btree ("review_slug" text_ops);--> statement-breakpoint
CREATE INDEX "idx_risk_obs_edits_slug" ON "risk_observation_edits" USING btree ("review_slug" text_ops);--> statement-breakpoint
CREATE POLICY "firm_isolation" ON "manager"."firms" AS PERMISSIVE FOR ALL TO public USING ((id = manager.current_firm_id()));--> statement-breakpoint
CREATE POLICY "firm_isolation" ON "manager"."users" AS PERMISSIVE FOR ALL TO public USING ((firm_id = manager.current_firm_id()));--> statement-breakpoint
CREATE POLICY "firm_isolation" ON "manager"."share_links" AS PERMISSIVE FOR ALL TO public USING ((firm_id = manager.current_firm_id()));--> statement-breakpoint
CREATE POLICY "firm_isolation" ON "manager"."ddq_responses" AS PERMISSIVE FOR ALL TO public USING ((firm_id = manager.current_firm_id()));--> statement-breakpoint
CREATE POLICY "firm_isolation" ON "manager"."ddq_snapshots" AS PERMISSIVE FOR ALL TO public USING ((firm_id = manager.current_firm_id()));--> statement-breakpoint
CREATE POLICY "firm_isolation" ON "manager"."documents" AS PERMISSIVE FOR ALL TO public USING ((firm_id = manager.current_firm_id()));--> statement-breakpoint
CREATE POLICY "firm_isolation" ON "manager"."share_link_views" AS PERMISSIVE FOR ALL TO public USING ((link_id IN ( SELECT share_links.id
   FROM manager.share_links
  WHERE (share_links.firm_id = manager.current_firm_id()))));
*/