import { invitationImage } from "@/lib/og";
import { getGuest } from "@/data/guests";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return invitationImage(getGuest((await params).slug).name);
}
