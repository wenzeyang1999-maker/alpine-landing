// Vitest global setup — runs before the unit suite.
// The investor session module requires a signing secret; supply a fixed
// test secret so signing/verification is deterministic.
process.env.INVESTOR_SESSION_SECRET =
  process.env.INVESTOR_SESSION_SECRET || "vitest-investor-session-secret-0123456789";
