import assert from 'node:assert/strict';
import { monthDays, photoRects, cropRect, WIDTH, HEIGHT, PRINT_MM } from '../app/lich-tet/calendar';
// Khổ in 300 × 424 mm: tỉ lệ canvas phải khớp trong vòng nửa pixel.
assert.ok(Math.abs(WIDTH / HEIGHT - PRINT_MM.width / PRINT_MM.height) * HEIGHT < .5);
for (const year of [1900, 2000, 2026, 2028, 2100]) {
  let total = 0;
  for (let month = 0; month < 12; month++) {
    const cells = monthDays(year, month);
    const days = cells.filter(day => day !== null);
    assert.equal(cells.length, 42);
    assert.equal(cells.indexOf(1), new Date(Date.UTC(year, month, 1)).getUTCDay());
    assert.deepEqual(days, Array.from({ length: new Date(Date.UTC(year, month + 1, 0)).getUTCDate() }, (_, i) => i + 1));
    total += days.length;
  }
  assert.equal(total, year === 2000 || year === 2028 ? 366 : 365);
}
assert.equal(monthDays(2026, 0)[4], 1);
assert.throws(() => monthDays(2026, 12));
assert.throws(() => monthDays(NaN, 0));
console.log('Calendar checks passed: weekdays, month lengths, leap years, validation.');

// Layouts must keep every photo inside the poster, separate from the text and other photos.
for (const concept of ['tet', 'wedding', 'vintage'] as const) {
 for (const showCalendar of [false, true]) {
  for (const count of [1, 4, 6] as const) {
    const rects = photoRects(count, concept, showCalendar);
    assert.equal(rects.length, count);
    rects.forEach((rect, index) => {
      assert.ok(rect.width > 0 && rect.height > 0 && rect.x >= 0 && rect.x + rect.width <= WIDTH);
      assert.ok(rect.y >= (concept !== 'tet' ? (showCalendar ? 440 : 540) : 0));
      assert.ok(rect.y + rect.height <= (concept !== 'tet' ? (showCalendar ? 1560 : 2290) : 1640));
      rects.slice(index + 1).forEach(other => assert.ok(rect.x + rect.width <= other.x || other.x + other.width <= rect.x || rect.y + rect.height <= other.y || other.y + other.height <= rect.y));
      for (const [width, height] of [[4000, 2000], [2000, 4000]]) {
        for (const zoom of [1, 3]) {
          for (const position of [0, 50, 100]) {
            const crop = cropRect(width, height, rect.width, rect.height, { zoom, x: position, y: position });
            assert.ok(crop.x <= 0 && crop.y <= 0);
            assert.ok(crop.width + crop.x >= rect.width - 1e-6 && crop.height + crop.y >= rect.height - 1e-6);
          }
        }
      }
    });
  }
}
}
console.log('Photo layout checks passed: 1/4/6 images, no overlaps, landscape/portrait crops.');
