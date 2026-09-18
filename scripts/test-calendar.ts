import assert from 'node:assert/strict';
import { monthDays } from '../app/lich-tet/calendar';
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
