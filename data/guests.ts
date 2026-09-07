export type Side = "groom" | "bride" | "both";
export type Guest = { slug: string; name: string; side: Side };
export const guests: Guest[] = [
  { slug: "nam-a3f", name: "Nam", side: "groom" },
  {
    slug: "bac-nguyen-van-thanh-k2p",
    name: "Bác Nguyễn Văn Thành và gia đình",
    side: "bride",
  },
  { slug: "chi-lan-8xq", name: "Chị Lan", side: "bride" },
  { slug: "co-chu-hai-m4t", name: "Cô chú Hải", side: "groom" },
];
export const FALLBACK_GUEST: Guest = {
  slug: "",
  name: "quý khách",
  side: "both",
};
export const getGuest = (slug: string) =>
  guests.find((g) => g.slug === slug) ?? FALLBACK_GUEST;
