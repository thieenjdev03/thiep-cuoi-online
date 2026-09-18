export function monthDays(year: number, month: number) {
  if (!Number.isInteger(year) || year < 1900 || year > 2100 || !Number.isInteger(month) || month < 0 || month > 11) throw new Error('Năm hoặc tháng không hợp lệ');
  const offset = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const count = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return Array.from({ length: 42 }, (_, i) => i >= offset && i < offset + count ? i - offset + 1 : null);
}

// Khổ in 300 × 424 mm ở 300 DPI = 3543 × 5008 px.
export const PRINT_MM = { width: 300, height: 424 };
export const EXPORT_DPI = 300;
export const HEIGHT = 2700;
export const WIDTH = HEIGHT * PRINT_MM.width / PRINT_MM.height; // 1910.38 — giữ số lẻ để tỉ lệ khớp khổ in tuyệt đối
export const exportScale = PRINT_MM.width / 25.4 * EXPORT_DPI / WIDTH;

// Canvas xuất PNG không kèm pHYs nên nhà in đọc thành 72 DPI; chèn chunk để file khai đúng khổ in.
const crcTable = Uint32Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let bit = 0; bit < 8; bit++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(bytes: Uint8Array) {
  let c = 0xffffffff;
  for (const byte of bytes) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
export function withPrintDpi(png: ArrayBuffer, dpi = EXPORT_DPI) {
  const source = new Uint8Array(png);
  const header = 33; // 8 byte chữ ký + chunk IHDR (25 byte)
  if (String.fromCharCode(...source.subarray(12, 16)) !== 'IHDR') return source;
  const chunk = new Uint8Array(21);
  const view = new DataView(chunk.buffer);
  view.setUint32(0, 9);
  chunk.set([0x70, 0x48, 0x59, 0x73], 4); // 'pHYs'
  const perMetre = Math.round(dpi / 0.0254);
  view.setUint32(8, perMetre); view.setUint32(12, perMetre);
  chunk[16] = 1; // đơn vị: mét
  view.setUint32(17, crc32(chunk.subarray(4, 17)));
  const out = new Uint8Array(source.length + chunk.length);
  out.set(source.subarray(0, header));
  out.set(chunk, header);
  out.set(source.subarray(header), header + chunk.length);
  return out;
}
export type Concept = 'tet' | 'wedding' | 'vintage';
export type PhotoCount = 1 | 4 | 6;
export type Crop = { zoom: number; x: number; y: number };
export type Photo = Crop & { image: HTMLImageElement | null; name: string };
export type Options = { concept: Concept; showCalendar: boolean; count: PhotoCount; year: number; caption: string; names: string; date: string };

export function photoRects(count: PhotoCount, concept: Concept, showCalendar = concept === 'tet') {
  if (![1, 4, 6].includes(count)) throw new Error('Bố cục không hợp lệ');
  const wedding = concept !== 'tet';
  const columns = count === 1 ? 1 : count === 6 ? 3 : 2;
  const rows = count / columns;
  const margin = wedding ? 100 : count === 1 ? 0 : 40;
  const top = wedding ? (showCalendar ? 440 : 540) : margin;
  const height = wedding ? (showCalendar ? 1120 : 1750) : 1640 - margin;
  const gap = count === 1 ? 0 : 24;
  const width = (WIDTH - margin * 2 - gap * (columns - 1)) / columns;
  const cellHeight = (height - gap * (rows - 1)) / rows;
  return Array.from({ length: count }, (_, index) => ({
    x: margin + (index % columns) * (width + gap),
    y: top + Math.floor(index / columns) * (cellHeight + gap), width, height: cellHeight,
  }));
}

export function cropRect(imageWidth: number, imageHeight: number, width: number, height: number, crop: Crop) {
  const ratio = Math.max(width / imageWidth, height / imageHeight) * crop.zoom;
  const w = imageWidth * ratio, h = imageHeight * ratio;
  return { x: (width - w) * crop.x / 100, y: (height - h) * crop.y / 100, width: w, height: h };
}

export function drawCalendar(canvas: HTMLCanvasElement, photos: Photo[], options: Options, scale = 1) {
  canvas.width = Math.round(WIDTH * scale);
  canvas.height = Math.round(HEIGHT * scale);
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Trình duyệt không hỗ trợ Canvas');
  const ctx = context;
  ctx.scale(scale, scale);
  const { year, caption, concept, names, date } = options;
  const vintage = concept === 'vintage';
  const withCalendar = concept === 'tet' || options.showCalendar;
  const serif = 'CalendarSerif, Georgia, serif';
  const sans = 'CalendarSans, sans-serif';
  const paper = ctx.createRadialGradient(WIDTH / 2, 1200, 180, WIDTH / 2, 1200, 1800);
  paper.addColorStop(0, '#fff9df'); paper.addColorStop(1, '#f3bbcb');
  ctx.fillStyle = vintage ? paper : '#fff5ef';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  photoRects(options.count, concept, withCalendar).forEach((rect, index) => {
    const photo = photos[index];
    if (!photo?.image) return;
    const crop = cropRect(photo.image.naturalWidth, photo.image.naturalHeight, rect.width, rect.height, photo);
    ctx.save();
    ctx.beginPath(); ctx.rect(rect.x, rect.y, rect.width, rect.height); ctx.clip();
    ctx.drawImage(photo.image, rect.x + crop.x, rect.y + crop.y, crop.width, crop.height);
    ctx.restore();
  });
  // Decorative blossoms are vector artwork so the export stays crisp.
  function flower(px: number, py: number, size: number, angle: number) {
    ctx.save(); ctx.translate(px, py); ctx.rotate(angle);
    for (let petal = 0; petal < 5; petal++) {
      ctx.rotate(Math.PI * 2 / 5);
      const pink = ctx.createRadialGradient(0, 0, 1, 0, -size * .65, size);
      pink.addColorStop(0, '#c62e64'); pink.addColorStop(.6, '#ee90b1'); pink.addColorStop(1, '#ffd9e3');
      ctx.fillStyle = pink; ctx.beginPath(); ctx.ellipse(0, -size * .6, size * .48, size * .7, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = '#f5ca65'; ctx.beginPath(); ctx.arc(0, 0, size * .19, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  function branch(px: number, py: number, mirror: number, size: number) {
    ctx.save(); ctx.translate(px, py); ctx.scale(mirror * size, size);
    ctx.strokeStyle = '#62453e'; ctx.lineCap = 'round'; ctx.lineWidth = 12;
    ctx.beginPath(); ctx.moveTo(-40, 90); ctx.bezierCurveTo(140, 20, 320, 130, 640, -55); ctx.stroke();
    for (let i = 0; i < 9; i++) {
      const bx = i * 70, by = 65 - i * i * 1.4;
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + 38, by - 85); ctx.stroke();
      flower(bx + 38, by - 85, 18 + (i % 3) * 7, i);
      flower(bx, by, 22 + (i % 2) * 9, i * .7);
    }
    ctx.restore();
  }
  function roseCluster(px: number, py: number, size: number, mirror: number) {
    ctx.save(); ctx.translate(px, py); ctx.scale(size * mirror, size);
    for (let i = 0; i < 7; i++) {
      ctx.save(); ctx.rotate(i * .85);
      ctx.fillStyle = i % 2 ? '#658554' : '#496b42';
      ctx.beginPath(); ctx.ellipse(0, -80, 18, 60, .35, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    [[0, 0, 1], [70, 35, .7], [-45, -65, .65]].forEach(([rx, ry, rs]) => {
      ctx.save(); ctx.translate(rx, ry); ctx.scale(rs, rs);
      for (let layer = 0; layer < 5; layer++) {
        const radius = 44 - layer * 8;
        for (let petal = 0; petal < 6; petal++) {
          ctx.rotate(Math.PI / 3 + layer * .09);
          ctx.fillStyle = ['#dc6083', '#ca3c65', '#ee8aa1', '#b82b52', '#f3a1b2'][layer];
          ctx.strokeStyle = '#f6bec4'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.ellipse(0, -radius * .55, radius * .7, radius, .3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        }
      }
      ctx.restore();
    });
    ctx.restore();
  }
  ctx.textAlign = 'center';
  if (concept !== 'tet') {
    ctx.strokeStyle = vintage ? '#af7941' : '#b7986c'; ctx.lineWidth = vintage ? 7 : 2;
    ctx.strokeRect(35, 35, WIDTH - 70, HEIGHT - 70);
    if (vintage) {
      ctx.lineWidth = 2; ctx.strokeRect(55, 55, WIDTH - 110, HEIGHT - 110);
      roseCluster(125, 160, 1.1, 1); roseCluster(WIDTH - 125, 160, 1.1, -1);
      roseCluster(100, 2650, .5, 1); roseCluster(WIDTH - 100, 2650, .5, -1);
    }
    ctx.fillStyle = vintage ? '#a32a43' : '#8b6454';
    ctx.font = `26px ${sans}`;
    ctx.fillText(vintage ? 'LỄ THÀNH HÔN' : 'TOGETHER IS A BEAUTIFUL PLACE TO BE', WIDTH / 2, withCalendar ? 135 : 165);
    ctx.font = `${vintage ? 'bold italic 112px' : 'italic 134px'} ${serif}`;
    const heading = vintage ? 'Trăm Năm Hạnh Phúc' : 'Happy Wedding';
    if (vintage) {
      ctx.strokeStyle = '#fff1b4'; ctx.lineWidth = 9;
      ctx.strokeText(heading, WIDTH / 2, withCalendar ? 280 : 335, 1430);
    }
    ctx.fillStyle = vintage ? '#a92342' : '#754538';
    ctx.fillText(heading, WIDTH / 2, withCalendar ? 280 : 335, 1430);
    ctx.font = `54px ${serif}`; ctx.fillText(names, WIDTH / 2, withCalendar ? 375 : 450, 1450);
    ctx.strokeStyle = vintage ? '#b98429' : '#b7986c'; ctx.lineWidth = vintage ? 9 : 5;
    [WIDTH / 2 - 25, WIDTH / 2 + 25].forEach(cx => {
      ctx.beginPath(); ctx.arc(cx, withCalendar ? 1620 : 2390, withCalendar ? 25 : 36, 0, Math.PI * 2); ctx.stroke();
    });
    ctx.font = `32px ${sans}`;
    ctx.fillText(date ? date.split('-').reverse().join(' . ') : '', WIDTH / 2, withCalendar ? 1690 : 2490);
    ctx.font = `italic 36px ${serif}`; ctx.fillText(caption, WIDTH / 2, withCalendar ? 1750 : 2570, 1480);
    if (!withCalendar) return;
    ctx.font = `32px ${serif}`; ctx.fillText(`— ${year} —`, WIDTH / 2, 1810);
  } else {
    const fade = ctx.createLinearGradient(0, 1380, 0, 1640);
    fade.addColorStop(0, '#fff5ef00'); fade.addColorStop(1, '#fff5ef');
    ctx.fillStyle = fade; ctx.fillRect(0, 1380, WIDTH, 320);
    branch(0, 1500, 1, 1); branch(WIDTH, 1480, -1, 1);
    branch(-20, 2680, 1, .4); branch(WIDTH + 20, 2680, -1, .4);
    ctx.font = `30px ${sans}`; ctx.fillStyle = '#963a36';
    ctx.fillText('CHÚC MỪNG NĂM MỚI', WIDTH / 2, 1555);
    ctx.font = `bold 190px ${serif}`;
    ctx.lineWidth = 8; ctx.strokeStyle = '#f4d49a'; ctx.strokeText(String(year), WIDTH / 2, 1740);
    const gold = ctx.createLinearGradient(0, 1570, 0, 1750);
    gold.addColorStop(0, '#df7149'); gold.addColorStop(.5, '#a62222'); gold.addColorStop(1, '#702720');
    ctx.fillStyle = gold; ctx.fillText(String(year), WIDTH / 2, 1740);
    ctx.font = `italic 32px ${serif}`; ctx.fillStyle = '#8c4c45';
    ctx.fillText(caption, WIDTH / 2, 1800, 1400);
  }

  const cell = 52, block = cell * 7, gutter = (WIDTH - block * 4) / 5;
  for (let month = 0; month < 12; month++) {
    const left = gutter + (month % 4) * (block + gutter), top = 1850 + Math.floor(month / 4) * 250;
    ctx.fillStyle = concept === 'wedding' ? '#88604e' : vintage ? '#a32a43' : '#ac342e'; ctx.beginPath(); ctx.roundRect(left + (block - 244) / 2, top, 244, 43, 10); ctx.fill();
    ctx.font = `25px ${serif}`; ctx.fillStyle = '#fff5df'; ctx.fillText(`THÁNG ${month + 1}`, left + block / 2, top + 30);
    ctx.font = `16px ${sans}`;
    ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].forEach((day, col) => {
      ctx.fillStyle = col === 0 ? '#b33339' : '#624941'; ctx.fillText(day, left + col * cell + cell / 2, top + 72);
    });
    ctx.font = `21px ${sans}`;
    monthDays(year, month).forEach((day, index) => {
      if (!day) return;
      ctx.fillStyle = index % 7 === 0 ? '#b33339' : '#342e2b';
      ctx.fillText(String(day), left + index % 7 * cell + cell / 2, top + 104 + Math.floor(index / 7) * 25);
    });
  }
  ctx.font = `22px ${serif}`; ctx.fillStyle = '#975b4f';
  ctx.fillText(concept === 'tet' ? 'AN KHANG • THỊNH VƯỢNG • VẠN SỰ NHƯ Ý' : 'TRĂM NĂM HẠNH PHÚC • MỘT ĐỜI BÊN NHAU', WIDTH / 2, concept === 'tet' ? 2670 : 2630);
}
