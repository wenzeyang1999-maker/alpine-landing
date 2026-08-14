// Shared print stylesheet for the paginated case-study readers.
//
// On screen each case study is a stack of page-shaped cards. For the PDF the
// cover keeps a sheet to itself and everything after it flows as one
// continuous document, so Chrome fills each sheet instead of leaving about a
// third of every page empty (which is what one-section-per-sheet produced).
//
// The readers come in two vintages. Carvana and Woodford predate the
// data-cs-* hooks and mark their footers with data-wp-page-footer, which they
// already hide in print. Chatham, Greensill, Abraaj and Allianz use
// data-cs-body for the page body and data-cs-coverfoot for the footer. The
// selectors below cover both so one stylesheet serves every reader.
//
// Footers below the cover are dropped deliberately: they are positioned
// against the page boxes, and once those boxes stop mapping one-to-one onto
// sheets there is nothing to pin them to. Chrome's print engine offers no
// usable running-header mechanism for arbitrary content.
//
// A Letter sheet is 816x1056 CSS px at 96dpi. These readers are 900px wide and
// are printed at scale 0.9, so one sheet holds 816/0.9 = 906 wide by
// 1056/0.9 = 1173 tall. The cover is pinned to 1170 to leave a few pixels of
// slack so rounding can never spill it onto a second sheet.
export const CASE_STUDY_PRINT_CSS = `
  @media print {
    header, .floating-subscribe-root { display: none !important; }
    [data-pdf-gap] { display: none !important; }
    [data-cs-outer] { background: #fff !important; }
    [data-cs-scroll] { padding: 0 !important; }
    @page { size: Letter; margin: 0; }

    [data-pdf-page] {
      box-shadow: none !important;
      border-radius: 0 !important;
      height: auto !important;
      min-height: 0 !important;
      page-break-after: auto !important;
      break-after: auto !important;
    }
    [data-pdf-page]:first-of-type {
      height: 1170px !important;
      page-break-after: always !important;
      break-after: page !important;
    }

    /* Reclaim the 48px/80px shell padding at each former page boundary, which
       would otherwise leave ~128px of dead space every time sections join. */
    [data-pdf-page]:not(:first-of-type) [data-cs-body],
    [data-pdf-page]:not(:first-of-type) > div:not([data-wp-page-footer]):not([data-cs-coverfoot]) {
      padding-top: 26px !important;
      padding-bottom: 0 !important;
    }

    /* Footers cannot follow the reflow; the cover keeps its own. */
    [data-pdf-page]:not(:first-of-type) [data-cs-coverfoot],
    [data-wp-page-footer] { display: none !important; }

    /* Figures, stat bands and comparison rows must never split across sheets,
       and a heading must never strand at the foot of one. */
    [data-cs-statband], [data-cs-altered], [data-cs-chain],
    [data-cs-figure], table { page-break-inside: avoid !important; break-inside: avoid !important; }
    h2, h3 { page-break-after: avoid !important; break-after: avoid !important; }
  }
`;
