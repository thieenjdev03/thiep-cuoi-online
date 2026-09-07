import { wedding } from "@/data/wedding";
export function GET(request: Request) {
  const side =
    new URL(request.url).searchParams.get("side") === "bride"
      ? "bride"
      : "groom";
  const event = wedding.events[side];
  const escape = (s: string) =>
    s
      .replace(/\\/g, "\\\\")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;")
      .replace(/\n/g, "\\n");
  const content = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Minh Ngoc//Wedding//VI",
    "BEGIN:VEVENT",
    `UID:wedding-${side}-2026@minh-ngoc`,
    `DTSTAMP:20260907T000000Z`,
    `DTSTART:${event.calendarStart}`,
    `DTEND:${event.calendarEnd}`,
    `SUMMARY:${escape(`Đám cưới Minh & Ngọc — ${event.title}`)}`,
    `LOCATION:${escape(`${event.venue}, ${event.address}`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
  return new Response(content, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="minh-ngoc-${side}.ics"`,
    },
  });
}
