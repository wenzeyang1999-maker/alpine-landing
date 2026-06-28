/**
 * Ticker resolution (codex #5): ticker → CIK → latest 10-K primary document URL on EDGAR.
 * fetch is mocked so the test is offline and deterministic.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { resolveTicker } from "../../../../lib/engine/demo/ingest";

const TICKERS = {
  "0": { cik_str: 1287750, ticker: "ARCC", title: "ARES CAPITAL CORP" },
  "1": { cik_str: 320193, ticker: "AAPL", title: "Apple Inc." },
};

const SUBMISSIONS = {
  name: "ARES CAPITAL CORP",
  filings: {
    recent: {
      form: ["8-K", "10-K", "10-Q"],
      accessionNumber: ["0001287750-26-000001", "0001287750-26-000006", "0001287750-25-000040"],
      primaryDocument: ["arcc-8k.htm", "arcc-20251231.htm", "arcc-10q.htm"],
      filingDate: ["2026-03-01", "2026-02-04", "2025-11-01"],
    },
  },
};

function mockFetch(map: Record<string, unknown>, opts?: { failSubmissions?: boolean }) {
  return vi.fn(async (url: string) => {
    if (url.includes("company_tickers.json")) return { ok: true, json: async () => map.tickers } as unknown as Response;
    if (url.includes("/submissions/")) {
      if (opts?.failSubmissions) return { ok: false, status: 404 } as unknown as Response;
      return { ok: true, json: async () => map.submissions } as unknown as Response;
    }
    return { ok: false, status: 404 } as unknown as Response;
  });
}

afterEach(() => vi.restoreAllMocks());

describe("resolveTicker", () => {
  it("resolves a ticker to its latest 10-K primary document URL", async () => {
    vi.stubGlobal("fetch", mockFetch({ tickers: TICKERS, submissions: SUBMISSIONS }));
    const r = await resolveTicker("arcc");
    expect(r.url).toBe("https://www.sec.gov/Archives/edgar/data/1287750/000128775026000006/arcc-20251231.htm");
    expect(r.form).toBe("10-K");
    expect(r.filingDate).toBe("2026-02-04");
    expect(r.cik).toBe("0001287750");
    expect(r.name).toContain("ARES CAPITAL");
  });

  it("rejects an unknown ticker", async () => {
    vi.stubGlobal("fetch", mockFetch({ tickers: TICKERS, submissions: SUBMISSIONS }));
    await expect(resolveTicker("ZZZZ")).rejects.toThrow(/not found/i);
  });

  it("rejects a ticker with no 10-K", async () => {
    const noTenK = { ...SUBMISSIONS, filings: { recent: { ...SUBMISSIONS.filings.recent, form: ["8-K", "10-Q"] } } };
    vi.stubGlobal("fetch", mockFetch({ tickers: TICKERS, submissions: noTenK }));
    await expect(resolveTicker("ARCC")).rejects.toThrow(/no 10-K/i);
  });

  it("rejects malformed ticker input without hitting the network", async () => {
    const f = mockFetch({ tickers: TICKERS, submissions: SUBMISSIONS });
    vi.stubGlobal("fetch", f);
    await expect(resolveTicker("not a ticker!!")).rejects.toThrow();
    expect(f).not.toHaveBeenCalled();
  });
});
