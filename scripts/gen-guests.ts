import { readFileSync, writeFileSync } from "node:fs";
import { randomInt } from "node:crypto";
import { parse } from "csv-parse/sync";
import { guests as existing } from "../data/guests";
const input = process.argv[2] || "guests.csv";
const base = process.argv[3] || process.env.NEXT_PUBLIC_SITE_URL;
if (!base || !/^https?:\/\//.test(base))
  throw new Error(
    "Usage: npm run guests -- guests.csv https://your-domain.com",
  );
const rows = parse(readFileSync(input, "utf8"), {
  columns: true,
  bom: true,
  skip_empty_lines: true,
  trim: true,
}) as { name: string; side: string; slug?: string }[];
const used = new Set<string>();
const records = rows.map((row, i) => {
  if (!row.name || !["groom", "bride", "both"].includes(row.side))
    throw new Error(`Invalid name/side at row ${i + 2}`);
  const stem = row.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  let slug =
    row.slug ||
    existing.find(
      (g) => g.name === row.name && g.side === row.side && !used.has(g.slug),
    )?.slug;
  if (slug && (!/^[a-z0-9-]+$/.test(slug) || used.has(slug)))
    throw new Error(`Invalid or duplicate slug at row ${i + 2}`);
  if (!slug) {
    do {
      slug = `${stem || "khach"}-${randomInt(46656).toString(36).padStart(3, "0")}`;
    } while (used.has(slug));
  }
  used.add(slug);
  return { slug, name: row.name, side: row.side };
});
writeFileSync(
  "data/guests.ts",
  `export type Side = 'groom' | 'bride' | 'both';\nexport type Guest = { slug: string; name: string; side: Side };\nexport const guests: Guest[] = ${JSON.stringify(records, null, 2)};\nexport const FALLBACK_GUEST: Guest = { slug: '', name: 'quý khách', side: 'both' };\nexport const getGuest = (slug: string) => guests.find(g => g.slug === slug) ?? FALLBACK_GUEST;\n`,
);
const quote = (s: string) =>
  '"' + (/^[=+@-]/.test(s) ? "'" : "") + s.replace(/"/g, '""') + '"';
writeFileSync(
  "links.csv",
  "\uFEFFname,side,slug,link\r\n" +
    records
      .map((g) =>
        [
          g.name,
          g.side,
          g.slug,
          new URL(g.slug, base.replace(/\/$/, "") + "/").href,
        ]
          .map(quote)
          .join(","),
      )
      .join("\r\n"),
);
console.log(
  `Generated ${records.length} guests and links.csv. Keep slug column for future imports.`,
);
