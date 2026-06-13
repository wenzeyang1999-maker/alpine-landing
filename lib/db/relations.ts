import { relations } from "drizzle-orm/relations";
import { firmsInManager, invitesInManager, usersInManager, shareLinksInManager, ddqSnapshotsInManager, ddqResponsesInManager, documentsInManager, users, followupNotes, shareLinkViewsInManager, investors, investorDocuments, investorReports } from "./schema";

export const invitesInManagerRelations = relations(invitesInManager, ({one}) => ({
	firmsInManager: one(firmsInManager, {
		fields: [invitesInManager.acceptedFirmId],
		references: [firmsInManager.id]
	}),
}));

export const firmsInManagerRelations = relations(firmsInManager, ({many}) => ({
	invitesInManagers: many(invitesInManager),
	usersInManagers: many(usersInManager),
	shareLinksInManagers: many(shareLinksInManager),
	ddqResponsesInManagers: many(ddqResponsesInManager),
	ddqSnapshotsInManagers: many(ddqSnapshotsInManager),
	documentsInManagers: many(documentsInManager),
}));

export const usersInManagerRelations = relations(usersInManager, ({one, many}) => ({
	firmsInManager: one(firmsInManager, {
		fields: [usersInManager.firmId],
		references: [firmsInManager.id]
	}),
	shareLinksInManagers: many(shareLinksInManager),
	ddqResponsesInManagers: many(ddqResponsesInManager),
	documentsInManagers: many(documentsInManager),
}));

export const shareLinksInManagerRelations = relations(shareLinksInManager, ({one, many}) => ({
	usersInManager: one(usersInManager, {
		fields: [shareLinksInManager.createdBy],
		references: [usersInManager.id]
	}),
	firmsInManager: one(firmsInManager, {
		fields: [shareLinksInManager.firmId],
		references: [firmsInManager.id]
	}),
	ddqSnapshotsInManager: one(ddqSnapshotsInManager, {
		fields: [shareLinksInManager.pinnedSnapshotId],
		references: [ddqSnapshotsInManager.id]
	}),
	shareLinkViewsInManagers: many(shareLinkViewsInManager),
}));

export const ddqSnapshotsInManagerRelations = relations(ddqSnapshotsInManager, ({one, many}) => ({
	shareLinksInManagers: many(shareLinksInManager),
	firmsInManager: one(firmsInManager, {
		fields: [ddqSnapshotsInManager.firmId],
		references: [firmsInManager.id]
	}),
}));

export const ddqResponsesInManagerRelations = relations(ddqResponsesInManager, ({one}) => ({
	firmsInManager: one(firmsInManager, {
		fields: [ddqResponsesInManager.firmId],
		references: [firmsInManager.id]
	}),
	usersInManager: one(usersInManager, {
		fields: [ddqResponsesInManager.updatedBy],
		references: [usersInManager.id]
	}),
}));

export const documentsInManagerRelations = relations(documentsInManager, ({one}) => ({
	firmsInManager: one(firmsInManager, {
		fields: [documentsInManager.firmId],
		references: [firmsInManager.id]
	}),
	usersInManager: one(usersInManager, {
		fields: [documentsInManager.uploadedBy],
		references: [usersInManager.id]
	}),
}));

export const followupNotesRelations = relations(followupNotes, ({one}) => ({
	user: one(users, {
		fields: [followupNotes.userEmail],
		references: [users.email]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	followupNotes: many(followupNotes),
}));

export const shareLinkViewsInManagerRelations = relations(shareLinkViewsInManager, ({one}) => ({
	shareLinksInManager: one(shareLinksInManager, {
		fields: [shareLinkViewsInManager.linkId],
		references: [shareLinksInManager.id]
	}),
}));

export const investorDocumentsRelations = relations(investorDocuments, ({one}) => ({
	investor: one(investors, {
		fields: [investorDocuments.investorId],
		references: [investors.id]
	}),
}));

export const investorsRelations = relations(investors, ({many}) => ({
	investorDocuments: many(investorDocuments),
	investorReports: many(investorReports),
}));

export const investorReportsRelations = relations(investorReports, ({one}) => ({
	investor: one(investors, {
		fields: [investorReports.investorId],
		references: [investors.id]
	}),
}));