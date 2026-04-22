/**
 * Shim — maps br2-api calls used in shared components to the mock API.
 * When connecting real backend, replace these with actual API calls.
 */
import { mockApi } from "./mock-api";

export const br2GetVerificationSummary = (reviewId: string) =>
  mockApi.getVerificationSummary(reviewId);

export const monGetConfig = () => mockApi.monGetConfig();
export const monGetKPI = () => mockApi.monGetKPI();
export const monGetEvents = (params?: Parameters<typeof mockApi.monGetEvents>[0]) =>
  mockApi.monGetEvents(params);
export const monGetExposure = () => mockApi.monGetExposure();
export const monGetNotifications = (status?: string) => mockApi.monGetNotifications(status);
export const monGetConditions = () => mockApi.monGetConditions();
export const monSendNotification = (id: string) => mockApi.monSendNotification(id);
export const monEditNotification = (id: string, content: string) =>
  mockApi.monEditNotification(id, content);
