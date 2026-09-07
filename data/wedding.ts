export const wedding = {
  groom: {
    name: "Minh",
    fullName: "Nguyễn Hữu Thắng",
    parents: ["Ông Nguyễn Văn An", "Bà Trần Thị Mai"],
  },
  bride: {
    name: "Ngọc",
    fullName: "Trần Thị Ngọc",
    parents: ["Ông Trần Văn Hùng", "Bà Lê Thị Hương"],
  },
  date: "2026-12-20T11:00:00+07:00",
  events: {
    groom: {
      title: "Tiệc nhà trai",
      date: "20.12.2026",
      day: "Chủ nhật",
      hour: "11:00",
      venue: "The Adora Center",
      address: "431 Hoàng Văn Thụ, TP. Hồ Chí Minh",
      destination: "The Adora Center 431 Hoang Van Thu Ho Chi Minh",
      calendarStart: "20261220T040000Z",
      calendarEnd: "20261220T070000Z",
    },
    bride: {
      title: "Tiệc nhà gái",
      date: "19.12.2026",
      day: "Thứ bảy",
      hour: "17:00",
      venue: "GEM Center",
      address: "8 Nguyễn Bỉnh Khiêm, TP. Hồ Chí Minh",
      destination: "GEM Center 8 Nguyen Binh Khiem Ho Chi Minh",
      calendarStart: "20261219T100000Z",
      calendarEnd: "20261219T130000Z",
    },
  },
  gift: {
    groom: {
      bank: "Vietcombank",
      account: "",
      holder: "NGUYEN VAN MINH",
      qr: "",
    },
    bride: {
      bank: "Techcombank",
      account: "",
      holder: "TRAN THI NGOC",
      qr: "",
    },
  },
  story: [
    {
      year: "2019",
      title: "Một lần tình cờ",
      text: "Giữa Sài Gòn vội vã, chúng mình gặp nhau trong một buổi cà phê cùng bạn bè. Chẳng ai ngờ, đó là khởi đầu của những ngày rất khác.",
    },
    {
      year: "2020",
      title: "Từ bạn thành thương",
      text: "Những cuộc trò chuyện dài hơn, những lần hẹn chẳng cần lý do. Có một người bỗng trở thành điều mình mong chờ mỗi ngày.",
    },
    {
      year: "2022",
      title: "Cùng nhau đi thật xa",
      text: "Chuyến đi đầu tiên, những con đường lạ và thật nhiều tiếng cười. Đi đâu cũng được, miễn là có nhau.",
    },
    {
      year: "2024",
      title: "Bình yên là có nhau",
      text: "Qua những ngày vui và cả những ngày khó, chúng mình học cách lắng nghe, sẻ chia và luôn chọn ở lại.",
    },
    {
      year: "2026",
      title: "Về chung một nhà",
      text: "Một lời ngỏ, một cái gật đầu. Và hôm nay, chúng mình muốn viết tiếp câu chuyện này, với sự chứng kiến của những người thương.",
    },
  ],
  gallery: [
    {
      src: "/images/gallery-1.webp",
      alt: "Không gian lễ cưới trang trí hoa trong khu vườn",
    },
    { src: "/images/gallery-2.webp", alt: "Khoảnh khắc trao lời hẹn ước" },
    {
      src: "/images/gallery-3.webp",
      alt: "Bó hoa và những chi tiết ngày cưới",
    },
    { src: "/images/gallery-4.webp", alt: "Kỷ niệm ngọt ngào của hai người" },
    { src: "/images/gallery-5.webp", alt: "Không gian tiệc cưới đầy hoa" },
    { src: "/images/gallery-6.webp", alt: "Một ngày để nhớ mãi" },
  ],
} as const;
export type EventSide = keyof typeof wedding.events;
export const mapUrl = (side: EventSide) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(wedding.events[side].destination)}`;

