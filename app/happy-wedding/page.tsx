import type { Metadata } from 'next';
import CalendarEditor from '../lich-tet/editor';
export const metadata: Metadata = {
  title: 'Happy Wedding — Tạo poster ảnh cưới',
  description: 'Tạo poster Happy Wedding với 1, 4 hoặc 6 ảnh, tên cặp đôi và ngày cưới.',
};
export default function Page() { return <CalendarEditor initialConcept="wedding" />; }
