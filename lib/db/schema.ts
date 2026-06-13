import { pgTable, pgSchema, unique, pgPolicy, uuid, text, integer, numeric, date, timestamp, index, inet, foreignKey, boolean, check, smallint, jsonb, bigint, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const manager = pgSchema("manager");


export const firmsInManager = manager.table("firms", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	slug: text().notNull(),
	name: text().notNull(),
	hq: text(),
	founded: integer(),
	aumValue: numeric("aum_value", { precision: 20, scale:  2 }),
	aumCurrency: text("aum_currency").default('USD').notNull(),
	aumAsOf: date("aum_as_of"),
	aumQualifier: text("aum_qualifier"),
	strategy: text(),
	domicile: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("firms_slug_key").on(table.slug),
	pgPolicy("firm_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(id = manager.current_firm_id())` }),
]);

export const magicLinksInManager = manager.table("magic_links", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	tokenHash: text("token_hash").notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
	consumedAt: timestamp("consumed_at", { withTimezone: true, mode: 'string' }),
	ipAddress: inet("ip_address"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_magic_links_email").using("btree", table.email.asc().nullsLast().op("text_ops"), table.createdAt.desc().nullsFirst().op("text_ops")),
	unique("magic_links_token_hash_key").on(table.tokenHash),
]);

export const invitesInManager = manager.table("invites", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	tokenHash: text("token_hash").notNull(),
	email: text().notNull(),
	firmNameHint: text("firm_name_hint"),
	invitedBy: text("invited_by").notNull(),
	invitedByRole: text("invited_by_role").default('allocator').notNull(),
	allocatorRef: text("allocator_ref"),
	status: text().default('pending').notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
	acceptedAt: timestamp("accepted_at", { withTimezone: true, mode: 'string' }),
	acceptedFirmId: uuid("accepted_firm_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.acceptedFirmId],
			foreignColumns: [firmsInManager.id],
			name: "invites_accepted_firm_id_fkey"
		}),
	unique("invites_token_hash_key").on(table.tokenHash),
]);

export const usersInManager = manager.table("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	firmId: uuid("firm_id").notNull(),
	email: text().notNull(),
	fullName: text("full_name"),
	role: text().default('member').notNull(),
	invitedBy: text("invited_by"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	lastLoginAt: timestamp("last_login_at", { withTimezone: true, mode: 'string' }),
	passwordHash: text("password_hash"),
	passwordSetAt: timestamp("password_set_at", { withTimezone: true, mode: 'string' }),
	passwordResetToken: text("password_reset_token"),
	passwordResetSentAt: timestamp("password_reset_sent_at", { withTimezone: true, mode: 'string' }),
	isVerified: boolean("is_verified").default(false).notNull(),
	verifiedAt: timestamp("verified_at", { withTimezone: true, mode: 'string' }),
	verifiedBy: text("verified_by"),
	jobTitle: text("job_title"),
}, (table) => [
	index("idx_manager_users_password_reset_token").using("btree", table.passwordResetToken.asc().nullsLast().op("text_ops")).where(sql`(password_reset_token IS NOT NULL)`),
	index("idx_manager_users_pending_verification").using("btree", table.createdAt.desc().nullsFirst().op("timestamptz_ops")).where(sql`(is_verified = false)`),
	foreignKey({
			columns: [table.firmId],
			foreignColumns: [firmsInManager.id],
			name: "users_firm_id_fkey"
		}).onDelete("cascade"),
	unique("users_email_key").on(table.email),
	pgPolicy("firm_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(firm_id = manager.current_firm_id())` }),
]);

export const shareLinksInManager = manager.table("share_links", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	firmId: uuid("firm_id").notNull(),
	tokenHash: text("token_hash").notNull(),
	createdBy: uuid("created_by").notNull(),
	recipientEmail: text("recipient_email"),
	label: text(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).default(sql`(now() + '90 days'::interval)`).notNull(),
	revokedAt: timestamp("revoked_at", { withTimezone: true, mode: 'string' }),
	pinnedSnapshotId: uuid("pinned_snapshot_id"),
	viewCount: integer("view_count").default(0).notNull(),
	lastViewedAt: timestamp("last_viewed_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_share_links_firm").using("btree", table.firmId.asc().nullsLast().op("timestamptz_ops"), table.createdAt.desc().nullsFirst().op("timestamptz_ops")),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [usersInManager.id],
			name: "share_links_created_by_fkey"
		}),
	foreignKey({
			columns: [table.firmId],
			foreignColumns: [firmsInManager.id],
			name: "share_links_firm_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.pinnedSnapshotId],
			foreignColumns: [ddqSnapshotsInManager.id],
			name: "share_links_pinned_snapshot_id_fkey"
		}),
	unique("share_links_token_hash_key").on(table.tokenHash),
	pgPolicy("firm_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(firm_id = manager.current_firm_id())` }),
]);

export const ddqResponsesInManager = manager.table("ddq_responses", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	firmId: uuid("firm_id").notNull(),
	frameworkVersion: text("framework_version").default('v1.2026.05').notNull(),
	chapterNum: smallint("chapter_num").notNull(),
	questionId: text("question_id").notNull(),
	answerKind: text("answer_kind").default('text').notNull(),
	answerText: text("answer_text"),
	answerChoice: text("answer_choice"),
	answerJson: jsonb("answer_json"),
	notApplicable: boolean("not_applicable").default(false).notNull(),
	naExplanation: text("na_explanation"),
	status: text().default('draft').notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedBy: uuid("updated_by"),
}, (table) => [
	index("idx_ddq_responses_firm_chapter").using("btree", table.firmId.asc().nullsLast().op("int2_ops"), table.chapterNum.asc().nullsLast().op("int2_ops")),
	foreignKey({
			columns: [table.firmId],
			foreignColumns: [firmsInManager.id],
			name: "ddq_responses_firm_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.updatedBy],
			foreignColumns: [usersInManager.id],
			name: "ddq_responses_updated_by_fkey"
		}),
	unique("ddq_responses_firm_id_framework_version_question_id_key").on(table.firmId, table.frameworkVersion, table.questionId),
	pgPolicy("firm_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(firm_id = manager.current_firm_id())` }),
	check("ddq_responses_chapter_num_check", sql`(chapter_num >= 1) AND (chapter_num <= 8)`),
]);

export const ddqSnapshotsInManager = manager.table("ddq_snapshots", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	firmId: uuid("firm_id").notNull(),
	takenAt: timestamp("taken_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	frameworkVersion: text("framework_version").notNull(),
	responsesJsonb: jsonb("responses_jsonb").notNull(),
	documentsManifest: jsonb("documents_manifest").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.firmId],
			foreignColumns: [firmsInManager.id],
			name: "ddq_snapshots_firm_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("firm_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(firm_id = manager.current_firm_id())` }),
]);

export const documentsInManager = manager.table("documents", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	firmId: uuid("firm_id").notNull(),
	chapterNum: smallint("chapter_num"),
	filename: text().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	fileSize: bigint("file_size", { mode: "number" }),
	storagePath: text("storage_path").notNull(),
	uploadedBy: uuid("uploaded_by"),
	uploadedAt: timestamp("uploaded_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_documents_firm_chapter").using("btree", table.firmId.asc().nullsLast().op("uuid_ops"), table.chapterNum.asc().nullsLast().op("uuid_ops")).where(sql`(deleted_at IS NULL)`),
	index("manager_documents_firm_date").using("btree", table.firmId.asc().nullsLast().op("timestamptz_ops"), table.uploadedAt.desc().nullsFirst().op("timestamptz_ops")),
	foreignKey({
			columns: [table.firmId],
			foreignColumns: [firmsInManager.id],
			name: "documents_firm_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.uploadedBy],
			foreignColumns: [usersInManager.id],
			name: "documents_uploaded_by_fkey"
		}),
	pgPolicy("firm_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(firm_id = manager.current_firm_id())` }),
	check("documents_chapter_num_check", sql`(chapter_num >= 1) AND (chapter_num <= 8)`),
]);

export const assessmentDraftEdits = pgTable("assessment_draft_edits", {
	reviewSlug: text("review_slug").primaryKey().notNull(),
	intro1: text().default("").notNull(),
	intro2: text().default("").notNull(),
	notes: text().default("").notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const blogPosts = pgTable("blog_posts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	url: text().notNull(),
	title: text().notNull(),
	excerpt: text().notNull(),
	source: text().default('Founder Activity').notNull(),
	ogImage: text("og_image"),
	isFeatured: boolean("is_featured").default(false).notNull(),
	isVisible: boolean("is_visible").default(true).notNull(),
	publishedAt: timestamp("published_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_blog_posts_visible_published").using("btree", table.isVisible.asc().nullsLast().op("timestamptz_ops"), table.publishedAt.desc().nullsFirst().op("timestamptz_ops")),
	unique("blog_posts_url_key").on(table.url),
]);

export const customers = pgTable("customers", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	email: text(),
	organization: text(),
	portalToken: text("portal_token"),
	fundName: text("fund_name"),
	plan: text().default('starter').notNull(),
	status: text().default('active').notNull(),
	notes: text(),
	onboardedBy: text("onboarded_by"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("customers_created_at_idx").using("btree", table.createdAt.desc().nullsFirst().op("timestamptz_ops")),
	index("customers_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("customers_portal_token_idx").using("btree", table.portalToken.asc().nullsLast().op("text_ops")),
	index("customers_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	unique("customers_portal_token_key").on(table.portalToken),
]);

export const appAdmins = pgTable("app_admins", {
	email: text().primaryKey().notNull(),
	addedAt: timestamp("added_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	addedBy: text("added_by"),
	note: text(),
}, (table) => [
	index("app_admins_added_at_idx").using("btree", table.addedAt.desc().nullsFirst().op("timestamptz_ops")),
]);

export const followupNotes = pgTable("followup_notes", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userEmail: text("user_email").notNull(),
	reviewSlug: text("review_slug").notNull(),
	questionKey: text("question_key").notNull(),
	checked: boolean().default(false).notNull(),
	note: text().default("").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_followup_notes_user_slug").using("btree", table.userEmail.asc().nullsLast().op("text_ops"), table.reviewSlug.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userEmail],
			foreignColumns: [users.email],
			name: "followup_notes_user_email_fkey"
		}).onDelete("cascade"),
	unique("followup_notes_user_email_review_slug_question_key_key").on(table.userEmail, table.reviewSlug, table.questionKey),
]);

export const managerResponseHistory = pgTable("manager_response_history", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	firmId: uuid("firm_id").notNull(),
	questionId: text("question_id").notNull(),
	chapterNum: integer("chapter_num").notNull(),
	answerText: text("answer_text"),
	answerChoice: text("answer_choice"),
	answerMulti: text("answer_multi").array(),
	uploadedFilename: text("uploaded_filename"),
	changedByEmail: text("changed_by_email").notNull(),
	changedByName: text("changed_by_name"),
	changedAt: timestamp("changed_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_mrh_question").using("btree", table.firmId.asc().nullsLast().op("uuid_ops"), table.questionId.asc().nullsLast().op("text_ops"), table.changedAt.desc().nullsFirst().op("uuid_ops")),
]);

export const referenceDataDraft = pgTable("reference_data_draft", {
	reviewSlug: text("review_slug").primaryKey().notNull(),
	values: jsonb().default({}).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const investors = pgTable("investors", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	passwordHash: text("password_hash").notNull(),
	fullName: text("full_name"),
	organization: text(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	lastLogin: timestamp("last_login", { withTimezone: true, mode: 'string' }),
}, (table) => [
	unique("investors_email_key").on(table.email),
]);

export const earlyAccessRequests = pgTable("early_access_requests", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	fullName: text("full_name").notNull(),
	email: text().notNull(),
	organization: text(),
	phone: text(),
	message: text(),
	source: text(),
	status: text().default('new').notNull(),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	contactedAt: timestamp("contacted_at", { withTimezone: true, mode: 'string' }),
	notes: text(),
}, (table) => [
	index("early_access_requests_created_at_idx").using("btree", table.createdAt.desc().nullsFirst().op("timestamptz_ops")),
	index("early_access_requests_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("early_access_requests_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
]);

export const flagDraftEdits = pgTable("flag_draft_edits", {
	reviewSlug: text("review_slug").primaryKey().notNull(),
	flags: jsonb().default([]).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const managerResponses = pgTable("manager_responses", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	firmId: uuid("firm_id").notNull(),
	questionId: text("question_id").notNull(),
	chapterNum: integer("chapter_num").notNull(),
	answerText: text("answer_text"),
	answerChoice: text("answer_choice"),
	answerMulti: jsonb("answer_multi"),
	uploadedFilename: text("uploaded_filename"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	reviewStatus: text("review_status"),
	sourceDocumentId: uuid("source_document_id"),
	sourceQuote: text("source_quote"),
}, (table) => [
	index("manager_responses_firm").using("btree", table.firmId.asc().nullsLast().op("int4_ops"), table.chapterNum.asc().nullsLast().op("int4_ops")),
	unique("manager_responses_firm_id_question_id_key").on(table.firmId, table.questionId),
	check("manager_responses_review_status_check", sql`review_status = ANY (ARRAY['flagged'::text, 'reviewed'::text])`),
]);

export const managerTeamInvites = pgTable("manager_team_invites", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	firmId: uuid("firm_id").notNull(),
	tokenHash: text("token_hash").notNull(),
	createdBy: text("created_by").notNull(),
	label: text(),
	revokedAt: timestamp("revoked_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_manager_team_invites_firm").using("btree", table.firmId.asc().nullsLast().op("timestamptz_ops"), table.createdAt.desc().nullsFirst().op("timestamptz_ops")),
	unique("manager_team_invites_token_hash_key").on(table.tokenHash),
]);

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
	email: text().primaryKey().notNull(),
	source: text().default('landing').notNull(),
	resendContactId: text("resend_contact_id"),
	resendSyncedAt: timestamp("resend_synced_at", { withTimezone: true, mode: 'string' }),
	unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	confirmedAt: timestamp("confirmed_at", { withTimezone: true, mode: 'string' }),
	confirmToken: text("confirm_token"),
	confirmTokenSentAt: timestamp("confirm_token_sent_at", { withTimezone: true, mode: 'string' }),
	unsubscribeToken: text("unsubscribe_token"),
	consentIpHash: text("consent_ip_hash"),
	consentUserAgent: text("consent_user_agent"),
	fullName: text("full_name"),
}, (table) => [
	index("idx_newsletter_subscribers_confirm_token").using("btree", table.confirmToken.asc().nullsLast().op("text_ops")).where(sql`(confirm_token IS NOT NULL)`),
	index("idx_newsletter_subscribers_created_at").using("btree", table.createdAt.desc().nullsFirst().op("timestamptz_ops")),
	index("idx_newsletter_subscribers_unsubscribe_token").using("btree", table.unsubscribeToken.asc().nullsLast().op("text_ops")).where(sql`(unsubscribe_token IS NOT NULL)`),
	unique("newsletter_subscribers_confirm_token_key").on(table.confirmToken),
	unique("newsletter_subscribers_unsubscribe_token_key").on(table.unsubscribeToken),
	check("source_check", sql`source = ANY (ARRAY['landing'::text, 'navbar'::text, 'contact'::text, 'footer'::text, 'signup'::text, 'early-access'::text, 'demo'::text])`),
]);

export const managerUploads = pgTable("manager_uploads", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userEmail: text("user_email").notNull(),
	filename: text().notNull(),
	storagePath: text("storage_path").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	fileSize: bigint("file_size", { mode: "number" }),
	uploadedAt: timestamp("uploaded_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	textContent: text("text_content"),
	textExtractedAt: timestamp("text_extracted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("manager_uploads_email_date").using("btree", table.userEmail.asc().nullsLast().op("text_ops"), table.uploadedAt.desc().nullsFirst().op("text_ops")),
	unique("manager_uploads_storage_path_key").on(table.storagePath),
]);

export const overviewDraftEdits = pgTable("overview_draft_edits", {
	reviewSlug: text("review_slug").primaryKey().notNull(),
	fields: jsonb().default({}).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const portalDocuments = pgTable("portal_documents", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	token: text().notNull(),
	filename: text().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	fileSize: bigint("file_size", { mode: "number" }),
	storagePath: text("storage_path"),
	uploadedAt: timestamp("uploaded_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_portal_documents_token").using("btree", table.token.asc().nullsLast().op("text_ops"), table.uploadedAt.desc().nullsFirst().op("text_ops")),
]);

export const referenceDataSources = pgTable("reference_data_sources", {
	reviewSlug: text("review_slug").primaryKey().notNull(),
	sources: jsonb().default({}).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const reportDraftEdits = pgTable("report_draft_edits", {
	reviewSlug: text("review_slug").primaryKey().notNull(),
	content: text().default("").notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const reportPublications = pgTable("report_publications", {
	reportSlug: text("report_slug").primaryKey().notNull(),
	fundName: text("fund_name"),
	publishedAt: timestamp("published_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	publishedBy: text("published_by"),
});

export const watermarkDistributions = pgTable("watermark_distributions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	recipientName: text("recipient_name").notNull(),
	recipientEmail: text("recipient_email"),
	filename: text().notNull(),
	distributedBy: text("distributed_by").default('admin').notNull(),
	emailSent: boolean("email_sent").default(false).notNull(),
	watermarkedAt: timestamp("watermarked_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const remediationDraftEdits = pgTable("remediation_draft_edits", {
	reviewSlug: text("review_slug").primaryKey().notNull(),
	beforeClose: jsonb("before_close").default([]).notNull(),
	postClose: jsonb("post_close").default([]).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const shareLinkViewsInManager = manager.table("share_link_views", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	linkId: uuid("link_id").notNull(),
	ipHash: text("ip_hash"),
	userAgent: text("user_agent"),
	viewedAt: timestamp("viewed_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_share_link_views_link").using("btree", table.linkId.asc().nullsLast().op("timestamptz_ops"), table.viewedAt.desc().nullsFirst().op("timestamptz_ops")),
	foreignKey({
			columns: [table.linkId],
			foreignColumns: [shareLinksInManager.id],
			name: "share_link_views_link_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("firm_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(link_id IN ( SELECT share_links.id
   FROM manager.share_links
  WHERE (share_links.firm_id = manager.current_firm_id())))` }),
]);

export const investorDocuments = pgTable("investor_documents", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	investorId: uuid("investor_id").notNull(),
	reportSlug: text("report_slug").notNull(),
	filename: text().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	fileSize: bigint("file_size", { mode: "number" }),
	storagePath: text("storage_path"),
	status: text().default('pending').notNull(),
	processedAt: timestamp("processed_at", { withTimezone: true, mode: 'string' }),
	processedBy: text("processed_by"),
	uploadedAt: timestamp("uploaded_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_investor_documents_investor_slug").using("btree", table.investorId.asc().nullsLast().op("text_ops"), table.reportSlug.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.investorId],
			foreignColumns: [investors.id],
			name: "investor_documents_investor_id_fkey"
		}).onDelete("cascade"),
	check("investor_documents_status_check", sql`status = ANY (ARRAY['pending'::text, 'processed'::text])`),
]);

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	fullName: text("full_name"),
	role: text().default('analyst').notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	lastLogin: timestamp("last_login", { withTimezone: true, mode: 'string' }),
	organization: text(),
	userType: text("user_type"),
	jobTitle: text("job_title"),
	aum: text(),
	portalToken: text("portal_token"),
}, (table) => [
	unique("users_email_key").on(table.email),
]);

export const callPrepNotes = pgTable("call_prep_notes", {
	reviewSlug: text("review_slug").notNull(),
	noteKey: text("note_key").notNull(),
	content: text().default("").notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_call_prep_notes_slug").using("btree", table.reviewSlug.asc().nullsLast().op("text_ops")),
	primaryKey({ columns: [table.reviewSlug, table.noteKey], name: "call_prep_notes_pkey"}),
]);

export const investorReports = pgTable("investor_reports", {
	investorId: uuid("investor_id").notNull(),
	reportSlug: text("report_slug").notNull(),
	assignedAt: timestamp("assigned_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	assignedBy: text("assigned_by"),
}, (table) => [
	foreignKey({
			columns: [table.investorId],
			foreignColumns: [investors.id],
			name: "investor_reports_investor_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.investorId, table.reportSlug], name: "investor_reports_pkey"}),
]);

export const topicRatingEdits = pgTable("topic_rating_edits", {
	reviewSlug: text("review_slug").notNull(),
	topicNumber: integer("topic_number").notNull(),
	rating: text().notNull(),
	rationale: text().default("").notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_topic_rating_slug").using("btree", table.reviewSlug.asc().nullsLast().op("text_ops")),
	primaryKey({ columns: [table.reviewSlug, table.topicNumber], name: "topic_rating_edits_pkey"}),
]);

export const riskObservationEdits = pgTable("risk_observation_edits", {
	id: text().notNull(),
	reviewSlug: text("review_slug").notNull(),
	severity: text().notNull(),
	title: text().notNull(),
	detail: text().default("").notNull(),
	remediation: text().default("").notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_risk_obs_edits_slug").using("btree", table.reviewSlug.asc().nullsLast().op("text_ops")),
	primaryKey({ columns: [table.id, table.reviewSlug], name: "risk_observation_edits_pkey"}),
]);
