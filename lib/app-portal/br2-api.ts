/**
 * Shim — maps br2-api calls used in shared components to the mock API.
 * When connecting real backend, replace these with actual API calls.
 */
import { mockApi } from "./mock-api";

export const br2GetVerificationSummary = (reviewId: string) =>
  mockApi.getVerificationSummary(reviewId);
