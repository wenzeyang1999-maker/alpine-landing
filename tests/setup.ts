// Vitest global setup — runs before the unit suite.
// The allocator session module requires a signing secret; supply a fixed
// test secret so signing/verification is deterministic.
process.env.ALLOCATOR_SESSION_SECRET =
  process.env.ALLOCATOR_SESSION_SECRET || "vitest-allocator-session-secret-0123456789";
