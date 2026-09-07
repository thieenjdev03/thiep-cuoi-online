import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
export async function invitationImage(name: string) {
  const font = await readFile(
    path.join(process.cwd(), "public/fonts/BeVietnamPro-SemiBold.ttf"),
  );
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#FBF8F1",
        color: "#2E2A22",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: 65,
        border: "16px solid #5C7A5E",
        fontFamily: "Vietnam",
      }}
    >
      <div style={{ display: "flex", fontSize: 30 }}>Thân mời {name}</div>
      <div
        style={{
          display: "flex",
          color: "#5C7A5E",
          fontSize: 104,
          marginTop: 40,
        }}
      >
        Minh & Ngọc
      </div>
      <div style={{ display: "flex", fontSize: 30, marginTop: 38 }}>
        20.12.2026 · Mình cưới nhé
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Vietnam", data: font, weight: 600, style: "normal" }],
    },
  );
}
