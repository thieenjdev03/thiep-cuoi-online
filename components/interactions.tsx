"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Gift as GiftIcon,
  Heart,
  Music2,
  VolumeX,
  X,
} from "lucide-react";
import { wedding, type EventSide } from "@/data/wedding";
import type { Guest } from "@/data/guests";
const blur =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjM2IyYzI0Ii8+PC9zdmc+";
export function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const seconds =
    now === null
      ? null
      : Math.max(
          0,
          Math.floor((new Date(wedding.date).getTime() - now) / 1000),
        );
  const values =
    seconds === null
      ? ["—", "—", "—", "—"]
      : [
          Math.floor(seconds / 86400),
          Math.floor(seconds / 3600) % 24,
          Math.floor(seconds / 60) % 60,
          seconds % 60,
        ];
  return (
    <div className="countdown-wrap">
      <p>
        {seconds === 0
          ? "Ngày hạnh phúc đã đến"
          : "Đếm từng khoảnh khắc, chờ ngày có nhau"}
      </p>
      <div className="countdown" aria-label="Đếm ngược đến ngày cưới">
        {values.map((v, i) => (
          <div key={i}>
            <span>{String(v).padStart(2, "0")}</span>
            <small>{["Ngày", "Giờ", "Phút", "Giây"][i]}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
export function Gallery() {
  const [selected, setSelected] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  function close() {
    dialog.current?.close();
    document.body.style.overflow = "";
  }
  useEffect(
    () => () => {
      document.body.style.overflow = "";
    },
    [],
  );
  return (
    <>
      <div className="gallery-grid">
        {wedding.gallery.map((photo, i) => (
          <button
            key={photo.src}
            className={`gallery-photo photo-${i}`}
            onClick={() => {
              setSelected(i);
              dialog.current?.showModal();
              document.body.style.overflow = "hidden";
            }}
            aria-label={`Xem ảnh ${i + 1}: ${photo.alt}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 600px) 48vw, 33vw"
              placeholder="blur"
              blurDataURL={blur}
            />
            <span>
              Xem khoảnh khắc <ArrowRight size={17} />
            </span>
          </button>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="lightbox"
        onCancel={close}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight")
            setSelected((s) => (s + 1) % wedding.gallery.length);
          if (e.key === "ArrowLeft")
            setSelected(
              (s) => (s - 1 + wedding.gallery.length) % wedding.gallery.length,
            );
        }}
        aria-label="Album ảnh cưới"
      >
        <button
          className="lightbox-close icon-button"
          onClick={close}
          aria-label="Đóng album"
        >
          <X />
        </button>
        <div className="lightbox-image">
          <Image
            src={wedding.gallery[selected].src}
            alt={wedding.gallery[selected].alt}
            fill
            sizes="90vw"
          />
        </div>
        <div className="lightbox-controls">
          <button
            className="icon-button"
            onClick={() =>
              setSelected(
                (s) =>
                  (s - 1 + wedding.gallery.length) % wedding.gallery.length,
              )
            }
            aria-label="Ảnh trước"
          >
            <ArrowLeft />
          </button>
          <span>
            {selected + 1} / {wedding.gallery.length}
          </span>
          <button
            className="icon-button"
            onClick={() => setSelected((s) => (s + 1) % wedding.gallery.length)}
            aria-label="Ảnh tiếp theo"
          >
            <ArrowRight />
          </button>
        </div>
      </dialog>
    </>
  );
}
export function Gift({ preferredSide }: { preferredSide: EventSide }) {
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<EventSide>(preferredSide);
  const [notice, setNotice] = useState("");
  const gift = wedding.gift[side];
  async function copy() {
    try {
      await navigator.clipboard.writeText(gift.account);
      setNotice("Đã sao chép");
    } catch {
      setNotice("Nhấn giữ số tài khoản để sao chép.");
    }
  }
  return (
    <section className="section gift">
      <GiftIcon size={32} strokeWidth={1} />
      <h2>Một chút tâm tình</h2>
      <p>
        Đến chung vui là đủ đầy. Nếu muốn gửi thêm lời chúc bằng một món quà
        nhỏ,
        <br className="desktop-break" /> chúng mình xin nhận với tất cả sự trân
        quý.
      </p>
      <button
        className="outline-button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="gift-details"
      >
        {open ? "Khép hộp mừng cưới" : "Mở hộp mừng cưới"}
        <Heart size={16} />
      </button>
      {open && (
        <div id="gift-details" className="gift-details">
          <div className="segmented">
            {(["groom", "bride"] as const).map((s) => (
              <button
                key={s}
                aria-pressed={side === s}
                onClick={() => {
                  setSide(s);
                  setNotice("");
                }}
              >
                {s === "groom" ? "Chú rể" : "Cô dâu"}
              </button>
            ))}
          </div>
          <h3>{gift.holder}</h3>
          <p>{gift.bank}</p>
          {gift.account ? (
            <>
              <p className="account">{gift.account}</p>
              {gift.qr && (
                <Image
                  src={gift.qr}
                  alt="Mã QR mừng cưới"
                  width={220}
                  height={220}
                />
              )}
              <button className="outline-button" onClick={copy}>
                <Copy size={16} />
                Sao chép số tài khoản
              </button>
            </>
          ) : (
            <p>Thông tin mừng cưới sẽ được gia đình cập nhật.</p>
          )}
          <p role="status">{notice}</p>
        </div>
      )}
    </section>
  );
}
type SavedReply = {
  attending: boolean;
  guestCount: number;
  message: string;
  name: string;
};
export function Rsvp({ guest }: { guest: Guest }) {
  const [attending, setAttending] = useState(true);
  const [count, setCount] = useState(1);
  const [name, setName] = useState(guest.slug ? guest.name : "");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const key = `wedding-rsvp:${guest.slug || "general"}`;
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const saved = JSON.parse(raw) as SavedReply;
        if (
          typeof saved.attending === "boolean" &&
          typeof saved.name === "string" &&
          typeof saved.message === "string" &&
          Number.isInteger(saved.guestCount)
        ) {
          setAttending(saved.attending);
          setCount(Math.min(10, Math.max(1, saved.guestCount)));
          setMessage(saved.message);
          setName(saved.name);
          setState("done");
        }
      }
    } catch {}
  }, [key]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setError("");
    const data = new FormData(event.currentTarget);
    const reply = {
      attending,
      guestCount: attending ? count : 0,
      message,
      name,
    };
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...reply,
          slug: guest.slug,
          website: data.get("website"),
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Chưa gửi được. Bạn hãy thử lại.");
      try {
        localStorage.setItem(key, JSON.stringify(reply));
      } catch {}
      setState("done");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Kiểm tra kết nối rồi thử gửi lại nhé.",
      );
      setState("error");
    }
  }
  return (
    <section id="rsvp" className="section rsvp">
      <div className="rsvp-copy">
        <p className="section-label">Một lời hẹn, một niềm vui</p>
        <h2>
          Hôm ấy,
          <br />
          mình gặp nhau nhé?
        </h2>
        <p>
          Cho chúng mình biết bạn có thể đến,
          <br />
          để chuẩn bị một chỗ ngồi thật ấm áp.
        </p>
        <span>Thương mời {guest.name}</span>
      </div>
      {state === "done" ? (
        <div className="rsvp-success" role="status">
          <Check size={34} />
          <h3>
            {attending
              ? "Hẹn gặp bạn trong ngày vui!"
              : "Đã nhận lời nhắn của bạn."}
          </h3>
          <p>
            {attending
              ? `Chúng mình đã ghi nhận ${count} người tham dự.`
              : "Cảm ơn bạn đã dành tình cảm cho chúng mình."}
          </p>
          <button className="outline-button" onClick={() => setState("idle")}>
            Thay đổi phản hồi
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="rsvp-form">
          <fieldset disabled={state === "sending"}>
            <legend>Bạn sẽ đến chung vui chứ?</legend>
            <div className="attendance-options">
              <label className={attending ? "selected" : ""}>
                <input
                  type="radio"
                  name="attending"
                  checked={attending}
                  onChange={() => setAttending(true)}
                />
                <span>Có, mình sẽ đến</span>
                <Heart size={16} />
              </label>
              <label className={!attending ? "selected" : ""}>
                <input
                  type="radio"
                  name="attending"
                  checked={!attending}
                  onChange={() => setAttending(false)}
                />
                <span>Tiếc quá, mình bận rồi</span>
              </label>
            </div>
            {!guest.slug && (
              <label className="field">
                Tên của bạn
                <input
                  required
                  maxLength={120}
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tên và xưng hô của bạn"
                />
              </label>
            )}
            {attending && (
              <label className="field">
                Số người tham dự (gồm cả bạn)
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} người
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label className="field">
              Gửi đôi lời cho chúng mình <span>(không bắt buộc)</span>
              <textarea
                value={message}
                maxLength={1000}
                rows={3}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Một lời chúc, một điều muốn nhắn…"
              />
            </label>
            <div className="honeypot" aria-hidden="true">
              <label>
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <button className="rsvp-submit" type="submit">
              {state === "sending" ? "Đang gửi lời hẹn…" : "Gửi lời hẹn"}
              <ArrowRight size={18} />
            </button>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <p className="form-note">
              Phản hồi của bạn và lời chúc được gửi riêng đến cô dâu chú rể.
            </p>
          </fieldset>
        </form>
      )}
    </section>
  );
}
export function Music() {
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const [error, setError] = useState("");
  useEffect(
    () => () => {
      audio.current?.pause();
    },
    [],
  );
  async function toggle() {
    if (!audio.current) {
      audio.current = new Audio("/music.wav");
      audio.current.loop = true;
      audio.current.volume = 0.25;
    }
    if (playing) {
      audio.current.pause();
      setPlaying(false);
    } else {
      try {
        await audio.current.play();
        setPlaying(true);
        setError("");
      } catch {
        setError("Chưa phát được nhạc. Nhấn để thử lại.");
      }
    }
  }
  return (
    <div className="music-control">
      <span role="status">{error}</span>
      <button
        className="music-button"
        onClick={toggle}
        aria-label={playing ? "Tắt nhạc nền" : "Bật nhạc nền"}
        aria-pressed={playing}
      >
        {playing ? <Music2 size={18} /> : <VolumeX size={18} />}
        <span>{playing ? "Tắt nhạc" : "Bật nhạc"}</span>
      </button>
    </div>
  );
}
