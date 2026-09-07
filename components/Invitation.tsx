import Image from "next/image";
import { ArrowDown, ArrowUpRight, Heart, MapPin } from "lucide-react";
import type { Guest } from "@/data/guests";
import { wedding, mapUrl, type EventSide } from "@/data/wedding";
import { Countdown, Gallery, Gift, Music, Rsvp } from "./interactions";
import Story from "./Story";
export default function Invitation({ guest }: { guest: Guest }) {
  const order: EventSide[] =
    guest.side === "bride" ? ["bride", "groom"] : ["groom", "bride"];
  return (
    <>
      <a href="#noi-dung" className="skip-link">
        Đến nội dung thiệp
      </a>
      <header className="site-header">
        <a className="monogram" href="#" aria-label="Minh và Ngọc">
          M<span>&</span>N
        </a>
        <nav aria-label="Điều hướng">
          <a href="#cau-chuyen">Câu chuyện</a>
          <a href="#album">Album cưới</a>
          <a href="#buoi-tiec">Ngày chung đôi</a>
        </nav>
        <a className="header-rsvp" href="#rsvp">
          Xác nhận tham dự <ArrowUpRight size={15} />
        </a>
      </header>
      <main id="noi-dung">
        <section className="hero" aria-labelledby="couple-names">
          <Image
            src="/images/hero.webp"
            alt="Cô dâu chú rể bên nhau dưới ánh nắng ngày cưới"
            fill
            priority
            sizes="100vw"
            className="hero-photo"
          />
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="invited">
              Thân mời <span>{guest.name}</span>
            </p>
            <p className="hero-note">Đến với ngày chúng mình thành đôi</p>
            <h1 id="couple-names">
              Minh <span>&</span> Ngọc
            </h1>
            <div className="hero-date">
              <span>20</span>
              <i>/</i>
              <span>12</span>
              <i>/</i>
              <span>2026</span>
            </div>
            <p className="hero-location">TP. Hồ Chí Minh</p>
            <a className="hero-button" href="#rsvp">
              Mình sẽ đến chung vui <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="hero-bottom">
            <span>Một đời thương, một người thương.</span>
            <a href="#loi-ngo">
              Mở câu chuyện của chúng mình <ArrowDown size={16} />
            </a>
            <span>Chủ nhật, 20 tháng 12</span>
          </div>
        </section>
        <section id="loi-ngo" className="intro section">
          <Heart className="small-heart" size={23} strokeWidth={1} />
          <p className="section-label">Chúng mình sắp kết hôn</p>
          <h2>
            Mọi con đường,
            <br />
            đều dẫn về bên nhau.
          </h2>
          <p className="prose">
            Sau những ngày cùng đi, cùng cười, cùng lớn lên, chúng mình đã tìm
            thấy một nơi để gọi là nhà — ở bên cạnh nhau.
          </p>
          <p className="prose">
            Sẽ thật trọn vẹn nếu trong ngày đặc biệt ấy,
            <br className="desktop-break" /> có {guest.name} cùng nâng ly và sẻ
            chia niềm hạnh phúc.
          </p>
          <div className="couple-families">
            {(["groom", "bride"] as const).map((side) => (
              <div key={side}>
                <span>{side === "groom" ? "Chú rể" : "Cô dâu"}</span>
                <h3>{wedding[side].fullName}</h3>
                {wedding[side].parents.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            ))}
          </div>
          <Countdown />
        </section>
        <Story />
        <section id="album" className="section album">
          <div className="section-heading">
            <div>
              <p className="section-label">Những ngày có nhau</p>
              <h2>Thương, qua từng khung hình.</h2>
            </div>
            <p>
              Cất một chút nắng, một chút yêu.
              <br />
              Để mai này cùng xem lại.
            </p>
          </div>
          <Gallery />
        </section>
        <section id="buoi-tiec" className="section events">
          <p className="section-label">Hẹn gặp trong ngày vui</p>
          <h2>Ngày chúng mình chung đôi</h2>
          <p className="prose">Sự hiện diện của bạn là món quà quý giá nhất.</p>
          <div className="event-grid">
            {order.map((side) => {
              const event = wedding.events[side];
              return (
                <article className="event" key={side} data-side={side}>
                  <Heart size={25} strokeWidth={1} />
                  <h3>{event.title}</h3>
                  <p>{event.day}</p>
                  <div className="event-date">{event.date}</div>
                  <p>Đón khách lúc {event.hour}</p>
                  <div className="venue">
                    <h4>{event.venue}</h4>
                    <p>{event.address}</p>
                  </div>
                  <a className="text-link" href={`/api/calendar?side=${side}`}>
                    <span>Thêm vào lịch</span>
                    <ArrowUpRight size={16} />
                  </a>
                </article>
              );
            })}
          </div>
        </section>
        <section className="map-section section" aria-label="Chỉ đường">
          <MapPin size={30} strokeWidth={1} />
          <div>
            <h3>Đường đến ngày hạnh phúc</h3>
            <p>Chọn địa điểm để mở chỉ đường trên Google Maps.</p>
          </div>
          <div className="map-links">
            {order.map((side) => (
              <a
                key={side}
                className="outline-button"
                href={mapUrl(side)}
                target="_blank"
                rel="noreferrer"
              >
                {wedding.events[side].title}
                <ArrowUpRight size={16} />
              </a>
            ))}
          </div>
        </section>
        <Gift preferredSide={order[0]} />
        <Rsvp guest={guest} />
        <section className="section wishes">
          <Heart size={26} strokeWidth={1} />
          <h2>
            Cảm ơn vì đã là một phần
            <br />
            trong ngày hạnh phúc của chúng mình.
          </h2>
          <p>
            Hẹn một cái ôm thật chặt, một ly thật đầy
            <br />
            và những kỷ niệm thật đẹp.
          </p>
          <div className="signature">Thắng & Thương</div>
          <span>20.12.2026</span>
        </section>
      </main>
      <footer>
        <a className="monogram" href="#">
          M<span>&</span>N
        </a>
        <p>Được viết bằng tất cả yêu thương.</p>
        <p className="demo-note">Thiệp mẫu · Nội dung và hình ảnh minh họa</p>
      </footer>
      <Music />
    </>
  );
}

