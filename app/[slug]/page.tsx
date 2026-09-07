import Invitation from "@/components/Invitation";
import { guests, getGuest } from "@/data/guests";
export const dynamicParams = true;
export function generateStaticParams() {
  return guests.map((g) => ({ slug: g.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const guest = getGuest((await params).slug);
  return {
    title: `Thân mời ${guest.name} — Thắng & Thương`,
    description: `Mời ${guest.name} chung vui cùng Thắng & Thương ngày 20.12.2026.`,
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <Invitation guest={getGuest((await params).slug)} />;
}
