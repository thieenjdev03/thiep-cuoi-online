import type { Metadata } from 'next';
import CalendarEditor from './editor';
export const metadata: Metadata = {
  title: 'Lịch Tết của bạn — Tạo lịch ảnh',
  description: 'Thay ảnh, chọn năm và tải lịch Tết 12 tháng của riêng bạn.',
};
export default function Page() { return <CalendarEditor />; }
