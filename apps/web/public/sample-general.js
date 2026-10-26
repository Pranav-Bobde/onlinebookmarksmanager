export const SAMPLE_LABEL =
  "Sample data: 8 authored links. This demo doesn't read your bookmarks.";
export const FORM_LABEL = "Local preview. This form sends and stores nothing.";

export const BOOKMARKS = [
  {
    id: "recipe",
    url: "https://www.seriouseats.com/one-pan-lemon-chicken-thighs",
    host: "seriouseats.com",
    siteTitle: "One-Pan Lemon Chicken Thighs",
    userTitle: "dinner idea",
    note: "",
    tags: ["cooking"],
    pageText:
      "Rub the thighs with sumac, garlic and lemon zest, then roast on one pan with potatoes. Ready in about 40 minutes.",
    saved: "12 days ago",
    status: "complete",
  },
  {
    id: "lisbon",
    url: "https://www.timeout.com/lisbon/things-to-do/best-things-to-do-in-lisbon",
    host: "timeout.com",
    siteTitle: "The best things to do in Lisbon",
    userTitle: "",
    note: "for the October trip",
    tags: ["travel"],
    pageText:
      "Ride the yellow tram 28 through Alfama, then queue for a warm pastel de nata in Belém. Go early to skip the crowds.",
    saved: "3 weeks ago",
    status: "complete",
  },
  {
    id: "procrastinate",
    url: "https://www.nytimes.com/2019/03/25/smarter-living/why-you-procrastinate-it-has-nothing-to-do-with-self-control.html",
    host: "nytimes.com",
    siteTitle: "Why You Procrastinate (It Has Nothing to Do With Self-Control)",
    userTitle: "",
    note: "",
    tags: ["reading"],
    pageText:
      "We put off tasks to escape the bad feelings they bring up. Procrastinating is an emotion regulation problem, not a time management problem.",
    saved: "2 months ago",
    status: "complete",
  },
  {
    id: "shoes",
    url: "https://www.runrepeat.com/guides/best-wide-toe-box-running-shoes",
    host: "runrepeat.com",
    siteTitle: "Best Running Shoes With a Wide Toe Box",
    userTitle: "",
    note: "",
    tags: ["shopping", "health"],
    pageText:
      "Lab-tested picks for wide feet. A roomy toe box lets your toes spread on landing and can ease bunion and blister pain.",
    saved: "5 days ago",
    status: "complete",
  },
  {
    id: "sleep",
    url: "https://www.sleepfoundation.org/sleep-hygiene",
    host: "sleepfoundation.org",
    siteTitle: "Sleep Hygiene: Simple Practices for Better Rest",
    userTitle: "",
    note: "",
    tags: ["health", "reading"],
    pageText:
      "Keep a steady wake-up time, dim screens an hour before bed, and keep the bedroom cool. Caffeine late in the day can delay sleep.",
    saved: "yesterday",
    status: "complete",
  },
  {
    id: "video",
    url: "https://www.youtube.com/watch?v=Q8kL2mN4pZs",
    host: "youtube.com",
    siteTitle: "Stand-up special: full set",
    userTitle: "",
    note: "the bit about mismatched socks",
    tags: ["watch"],
    pageText: "Full stand-up special recorded live. Subscribe for more comedy.",
    saved: "4 weeks ago",
    status: "complete",
  },
  {
    id: "gift",
    url: "https://www.etsy.com/listing/1234567890/handmade-ceramic-planter",
    host: "etsy.com",
    siteTitle: "",
    userTitle: "",
    note: "mum's birthday, the green one",
    tags: [],
    pageText: "",
    saved: "6 days ago",
    status: "failed",
  },
  {
    id: "tap",
    url: "https://www.bobvila.com/articles/how-to-fix-a-leaky-faucet/",
    host: "bobvila.com",
    siteTitle: "How to Fix a Leaky Faucet",
    userTitle: "",
    note: "",
    tags: ["home"],
    pageText:
      "Most drips come from a worn washer or cartridge. Turn off the water under the sink first, then take the handle apart.",
    saved: "3 months ago",
    status: "complete",
  },
];

export const ALL_TAGS = [
  ...new Set(BOOKMARKS.flatMap((b) => b.tags)),
].toSorted();

const FIELDS = [
  ["pageText", "Page text"],
  ["siteTitle", "Page title"],
  ["userTitle", "Your title"],
  ["note", "Your note"],
  ["url", "Link"],
];

const tokenize = (q) =>
  q
    .toLowerCase()
    .split(/[^a-z0-9#*]+/i)
    .filter((t) => t.length > 1);

export function search(query = "", tags = []) {
  const terms = tokenize(query);
  const results = [];
  for (const b of BOOKMARKS) {
    if (!tags.every((t) => b.tags.includes(t))) continue;
    const matches = [];
    let ok = true;
    for (const term of terms) {
      const hits = [];
      for (const [key, label] of FIELDS) {
        if (b[key] && b[key].toLowerCase().includes(term))
          hits.push({ field: key, label });
      }
      if (b.tags.some((t) => t.includes(term)))
        hits.push({ field: "tags", label: "Tag" });
      if (!hits.length) {
        ok = false;
        break;
      }
      matches.push({ term, hits });
    }
    if (ok && (terms.length || tags.length))
      results.push({ bookmark: b, matches });
  }
  return { results, terms };
}

export function snippet(text, terms, radius = 48) {
  if (!text) return "";
  const lower = text.toLowerCase();
  const idx =
    terms
      .map((t) => lower.indexOf(t))
      .filter((i) => i >= 0)
      .toSorted((a, b) => a - b)[0] ?? 0;
  const start = Math.max(0, idx - radius);
  const end = Math.min(text.length, idx + radius * 2);
  let out = escapeHtml(text.slice(start, end));
  for (const t of terms) {
    out = out.replace(
      new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"),
      "<mark>$1</mark>",
    );
  }
  return (start > 0 ? "…" : "") + out + (end < text.length ? "…" : "");
}

export function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}

export const SUGGESTED = [
  {
    q: "sumac",
    expect: "hit",
    why: "Not in your title “dinner idea”. Found in the saved page text.",
  },
  { q: "tram pastel", expect: "hit", why: "Two words, both must match." },
  {
    q: "birthday",
    expect: "hit",
    why: "Page couldn't be read. Your note still matches.",
  },
  {
    q: "socks",
    expect: "hit",
    why: "Video speech isn't searched. Your note is.",
  },
  {
    q: "laziness",
    expect: "miss",
    why: "Honest miss. The page says “procrastinate”. Search matches saved words, not meaning.",
  },
];

export function simulateSave(url, onStage) {
  let host = "";
  try {
    host = new URL(url).host.replace(/^www\./, "");
  } catch {
    return {
      error:
        "That doesn't look like a link. Paste a full URL, starting with https://",
    };
  }
  const steps = [
    [0, "saved", "Saved."],
    [600, "fetching", "Reading the page in the background…"],
    [1500, "context", "Page text added to search."],
    [2100, "tags", "Suggested tags. Change them anytime."],
  ];
  const timers = steps.map(([ms, stage, label]) =>
    setTimeout(() => onStage({ stage, label, host }), ms),
  );
  return { host, cancel: () => timers.forEach(clearTimeout) };
}
