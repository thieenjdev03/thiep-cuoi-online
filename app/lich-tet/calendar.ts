export function monthDays(year: number, month: number) {
  if (!Number.isInteger(year) || year < 1900 || year > 2100 || !Number.isInteger(month) || month < 0 || month > 11) throw new Error('Năm hoặc tháng không hợp lệ');
  const offset = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const count = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return Array.from({ length: 42 }, (_, i) => i >= offset && i < offset + count ? i - offset + 1 : null);
}

export const WIDTH = 1800;
export const HEIGHT = 2700;
export type Options = { year: number; caption: string; zoom: number; x: number; y: number };

export function drawCalendar(canvas: HTMLCanvasElement, photo: HTMLImageElement | null, options: Options, scale = 1) {
  canvas.width = WIDTH * scale;
  canvas.height = HEIGHT * scale;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Trình duyệt không hỗ trợ Canvas');
  const ctx = context;
  ctx.scale(scale, scale);
  const { year, caption, zoom, x, y } = options;
  const serif = 'CalendarSerif, Georgia, serif';
  const sans = 'CalendarSans, sans-serif';
  ctx.fillStyle = '#fff5ef';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  if (photo) {
    const ratio = Math.max(WIDTH / photo.naturalWidth, 1640 / photo.naturalHeight) * zoom;
    const w = photo.naturalWidth * ratio, h = photo.naturalHeight * ratio;
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, WIDTH, 1640); ctx.clip();
    ctx.drawImage(photo, (WIDTH - w) * x / 100, (1640 - h) * y / 100, w, h);
    ctx.restore();
  }
  const fade = ctx.createLinearGradient(0, 1380, 0, 1640);
  fade.addColorStop(0, '#fff5ef00'); fade.addColorStop(1, '#fff5ef');
  ctx.fillStyle = fade; ctx.fillRect(0, 1380, WIDTH, 320);

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
  branch(0, 1500, 1, 1); branch(WIDTH, 1480, -1, 1);
  branch(-20, 2680, 1, .4); branch(WIDTH + 20, 2680, -1, .4);
  ctx.textAlign = 'center';
  ctx.font = `30px ${sans}`; ctx.fillStyle = '#963a36';
  ctx.fillText('CHÚC MỪNG NĂM MỚI', WIDTH / 2, 1555);
  ctx.font = `bold 190px ${serif}`;
  ctx.lineWidth = 8; ctx.strokeStyle = '#f4d49a'; ctx.strokeText(String(year), WIDTH / 2, 1740);
  const gold = ctx.createLinearGradient(0, 1570, 0, 1750);
  gold.addColorStop(0, '#df7149'); gold.addColorStop(.5, '#a62222'); gold.addColorStop(1, '#702720');
  ctx.fillStyle = gold; ctx.fillText(String(year), WIDTH / 2, 1740);
  ctx.font = `italic 32px ${serif}`; ctx.fillStyle = '#8c4c45';
  ctx.fillText(caption, WIDTH / 2, 1800, 1400);

  for (let month = 0; month < 12; month++) {
    const left = 105 + (month % 4) * 405, top = 1850 + Math.floor(month / 4) * 250;
    ctx.fillStyle = '#ac342e'; ctx.beginPath(); ctx.roundRect(left + 61, top, 244, 43, 10); ctx.fill();
    ctx.font = `25px ${serif}`; ctx.fillStyle = '#fff5df'; ctx.fillText(`THÁNG ${month + 1}`, left + 183, top + 30);
    ctx.font = `16px ${sans}`;
    ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].forEach((day, col) => {
      ctx.fillStyle = col === 0 ? '#b33339' : '#624941'; ctx.fillText(day, left + col * 52 + 26, top + 72);
    });
    ctx.font = `21px ${sans}`;
    monthDays(year, month).forEach((day, index) => {
      if (!day) return;
      ctx.fillStyle = index % 7 === 0 ? '#b33339' : '#342e2b';
      ctx.fillText(String(day), left + index % 7 * 52 + 26, top + 104 + Math.floor(index / 7) * 25);
    });
  }
  ctx.font = `22px ${serif}`; ctx.fillStyle = '#975b4f';
  ctx.fillText('AN KHANG • THỊNH VƯỢNG • VẠN SỰ NHƯ Ý', WIDTH / 2, 2670);
}
