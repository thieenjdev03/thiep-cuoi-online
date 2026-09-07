import { NextResponse } from "next/server";
import { guests } from "@/data/guests";
import { getSupabase } from "@/lib/supabase";
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return NextResponse.json(
      { error: "Hãy gửi phản hồi từ trang thiệp cưới." },
      { status: 403 },
    );
  if (Number(request.headers.get("content-length") || 0) > 8192)
    return NextResponse.json({ error: "Lời nhắn quá dài." }, { status: 413 });
  let body;
  try {
    const raw = await request.text();
    if (raw.length > 8192) throw new Error();
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: "Nội dung không hợp lệ." },
      { status: 400 },
    );
  }
  if (!body || typeof body !== "object")
    return NextResponse.json(
      { error: "Nội dung không hợp lệ." },
      { status: 400 },
    );
  if (body.website)
    return NextResponse.json(
      { error: "Không thể gửi phản hồi này." },
      { status: 400 },
    );
  const guest = guests.find((g) => g.slug === body.slug);
  const name =
    guest?.name || (typeof body.name === "string" ? body.name.trim() : "");
  if (
    typeof body.slug !== "string" ||
    (body.slug && !guest) ||
    !name ||
    name.length > 120 ||
    typeof body.attending !== "boolean" ||
    !Number.isInteger(body.guestCount) ||
    (body.attending
      ? body.guestCount < 1 || body.guestCount > 10
      : body.guestCount !== 0) ||
    typeof body.message !== "string" ||
    body.message.length > 1000
  ) {
    return NextResponse.json(
      {
        error: "Kiểm tra tên, số người (1–10) và lời nhắn tối đa 1.000 ký tự.",
      },
      { status: 400 },
    );
  }
  const db = getSupabase();
  if (!db)
    return NextResponse.json(
      {
        error:
          "Gia đình chưa mở nhận phản hồi trực tuyến. Bạn hãy liên hệ trực tiếp hoặc quay lại sau nhé.",
      },
      { status: 503 },
    );
  const row = {
    slug: guest?.slug || null,
    name,
    attending: body.attending,
    guest_count: body.guestCount,
    message: body.message.trim(),
    updated_at: new Date().toISOString(),
  };
  const { error } = guest
    ? await db.from("rsvps").upsert(row, { onConflict: "slug" })
    : await db.from("rsvps").insert(row);
  if (error)
    return NextResponse.json(
      { error: "Chưa lưu được lời hẹn. Bạn hãy thử gửi lại." },
      { status: 500 },
    );
  return NextResponse.json({ ok: true });
}
