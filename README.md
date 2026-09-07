# Thiệp cưới Thắng & Thương

Next.js App Router, TypeScript, Tailwind v4; ảnh WebP lưu cục bộ, font Lora và Be Vietnam Pro có đầy đủ dấu, GSAP chỉ tải khi gần phần câu chuyện trên desktop. Native scroll, tắt motion theo thiết lập hệ thống. Nhạc mặc định tắt; bản giai điệu mẫu tổng hợp cục bộ, không tải âm thanh bên thứ ba.

## Chạy

Node.js >= 20.9. `npm install`, `npm run dev`. Production: `npm run build` rồi `npm start`. `npm run typecheck` kiểm tra TypeScript.

## Thay nội dung

- `data/wedding.ts`: tên, bố mẹ, ngày giờ, tiệc, địa chỉ, câu chuyện, album, tài khoản và đường dẫn QR. Nội dung hiện tại là mẫu, không dùng để gửi khách thật.
- `public/images/`: thay ảnh cưới thật. Hero ưu tiên tải, album lazy load. Giữ ảnh WebP/AVIF khoảng 200KB và tối đa 1600px.
- Gift chưa có số tài khoản nên không hiển thị QR chuyển tiền giả. Khi có thông tin thật, tạo VietQR PNG một lần, kiểm tra người nhận rồi lưu vào `public/`; điền account/qr trong data.
- `public/music.wav`: thay nhạc có quyền sử dụng, chỉnh đường dẫn trong `components/interactions.tsx` nếu đổi định dạng.
- `data/guests.ts`: 4 khách mẫu theo plan. Slug không tồn tại hiển thị thiệp chung.

## Supabase

Chạy `supabase/schema.sql` trong SQL Editor. Sao chép `.env.example` thành `.env.local`, điền `SUPABASE_URL` và `SUPABASE_SERVICE_ROLE_KEY`. Không dùng tiền tố NEXT_PUBLIC cho service key. RLS bật, không cho anon/authenticated đọc bảng. Chỉ API server ghi dữ liệu. Khách có slug được upsert; khách chung nhập tên và tạo một bản ghi. Lời chúc riêng tư, không tự công khai.

Thiếu cấu hình trả HTTP 503 và thông báo rõ trên form. LocalStorage chỉ lưu phản hồi sau khi server xác nhận thành công. Link cá nhân là cơ chế nhận diện tiện dụng, không phải xác thực; ai có link có thể sửa phản hồi. Nếu link bị phát tán rộng, bổ sung rate limit/CAPTCHA trước phát hành.

## Import khách

`npm run guests -- guests.example.csv https://your-domain.com`

CSV UTF-8 gồm `name,side,slug` (slug tùy chọn), side là groom/bride/both. Script tạo `data/guests.ts` và `links.csv`, giữ slug đã có theo tên/bên hoặc cột slug để link không đổi. Kiểm tra vai vế trước gửi. Không commit danh sách khách thật vào repository public.

## Vercel

Import repository bằng preset Next.js, thêm ba biến môi trường trong `.env.example`. `NEXT_PUBLIC_SITE_URL` phải là domain HTTPS thực tế, rồi build/deploy lại để metadata đúng. Chạy SQL trước khi nhận RSVP. Kiểm tra ảnh OG bằng slug nháp trước khi gửi link thật qua Zalo.

## Kiểm tra trước gửi

Kiểm tra 4 slug mẫu ở 320/390/430px và `/abcxyz`; tên dài, thứ tự tiệc, album bằng bàn phím, RSVP có/không, sao chép STK sau khi cấu hình, OG tiếng Việt và Reduce Motion. Chạy Lighthouse trên deployment thật. Cần kiểm tra thủ công Android/iPhone trong Zalo/Messenger, preview qua chat và duyệt nội dung với hai gia đình; kiểm tra trình duyệt desktop không thay thế các bước này.

## Ảnh mẫu

Ảnh từ Unsplash, tải và lưu cục bộ để không phụ thuộc bên thứ ba lúc chạy. Các ID nguồn: `1519741497674-611481863552`, `1523438885200-e635ba2c371e`, `1591604466107-ec97de577aff`, `1529636798458-92182e662485`, `1511285560929-80b456fea0bc`, `1511795409834-ef04bbd61622`. Nguồn: https://unsplash.com/s/photos/wedding . Font từ https://github.com/google/fonts (SIL Open Font License).
