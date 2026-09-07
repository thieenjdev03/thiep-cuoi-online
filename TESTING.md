# Kiểm tra bản mẫu — 07/09/2026

- Production build và TypeScript: đạt.
- Chromium: 4 khách mẫu + slug lạ, mỗi URL ở 320/390/430px: 15/15 HTTP 200, không tràn ngang. Khách nhà gái thấy tiệc nhà gái trước. Không ghi nhận lỗi JavaScript.
- Album: mở, điều hướng và đóng bằng Escape. Gift: mở hộp, hiển thị trạng thái chưa có tài khoản. Lịch nhà gái chứa đúng thời gian UTC. API từ chối slug giả (400), báo chưa cấu hình Supabase (503).
- RSVP thành công, tải lại giữ lựa chọn, chỉnh sửa và từ chối tham dự: đạt với response API mô phỏng. Chưa kiểm tra ghi dữ liệu trên Supabase thật.
- OG tên dài: HTTP 200, PNG 1200×630, đã nhìn trực tiếp để xác nhận dấu tiếng Việt.
- Reduce Motion: animation none. Font WOFF2 đã kiểm tra glyph ẫ ợ ỡ ữ ặ ể Đ đ.
- CSV: xuất đủ bốn khách và giữ nguyên slug.
- Lighthouse mobile, production local, lần cuối: Performance 96, Accessibility 100, LCP 2,8 giây, CLS 0, tổng tải đo được khoảng 339 KiB. Chưa đạt LCP < 2,5 giây; cần đo lại trên deployment và thiết bị thực. Không coi số local là cam kết trên 4G.

Ảnh chụp và báo cáo JSON nằm trong `test-results/` (không commit). Còn cần: cấu hình Supabase, thông tin/QR thật, deploy domain HTTPS, kiểm tra Zalo/Messenger trên Android và iPhone, duyệt nội dung với cô dâu chú rể.
