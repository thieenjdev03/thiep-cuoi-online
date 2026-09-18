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

## Lịch Tết cá nhân

Trang riêng `/lich-tet`: chọn ảnh JPG/PNG/WebP tối đa 25 MB, căn vị trí và phóng to, chọn năm 1900–2100, sửa lời chúc rồi tải PNG 3820×5400 px (khổ in 300×424 mm, ~323 DPI). Ảnh được xử lý bằng Canvas trên thiết bị, không gửi lên server; tải lại trang sẽ đặt lại bản chỉnh sửa. Lịch dương 12 tháng, Chủ nhật màu đỏ; chưa có ngày âm. Hoa đào là hình vector vẽ bằng Canvas, bố cục lấy cảm hứng từ lịch treo ảnh.

Kiểm tra ngày/thứ và năm nhuận: `npx tsx scripts/test-calendar.ts`. Kiểm tra thủ công: thay ảnh dọc/ngang, chỉnh ba thanh trượt, chọn 2028, nhập lời chúc tiếng Việt, tải PNG và mở ảnh kiểm tra kích thước; xem ở 390px và desktop.

## Happy Wedding và ghép nhiều ảnh

Trang `/happy-wedding` mở sẵn concept poster cưới; cũng có thể chuyển giữa **Happy Wedding** và **Lịch Tết** ngay trong trình chỉnh sửa. Cả hai hỗ trợ 1, 4 hoặc 6 ảnh, chọn nhiều file cùng lúc và thay từng ô riêng. Chọn thumbnail để chỉnh phóng to/vị trí cho đúng ảnh; đổi bố cục không xóa ảnh đã chọn trong phiên. Ô chưa thay giữ ảnh mẫu và được ghi rõ trong trình chỉnh sửa.

Happy Wedding có tên cặp đôi, ngày cưới tùy chọn và lời chúc; mặc định không có lịch, có thể bật lịch 12 tháng bên dưới ảnh. PNG vẫn là 3820×5400 px (300×424 mm). Ảnh và bản chỉnh sửa chỉ tồn tại trong phiên trang hiện tại, không lưu lên server. Bài kiểm tra `npx tsx scripts/test-calendar.ts` bao gồm cả vị trí khung 1/4/6 ảnh và crop ảnh ngang/dọc.

Mẫu **Trăm năm hạnh phúc** dùng nền hồng kem, hoa hồng và khung vàng phong cách thiệp cưới xưa. Bật **Thêm lịch 12 tháng vào thiết kế** trong một trong hai mẫu cưới để ghép lịch dương cùng ảnh, rồi chọn năm. Bốn ảnh xếp 2×2, sáu ảnh xếp 3×2; khung ảnh tự thu gọn khi có lịch, phần ngày tháng không chồng ảnh. Khi trình duyệt chặn tải tự động, dùng liên kết **Lưu PNG vừa tạo** xuất hiện bên dưới nút tải.
