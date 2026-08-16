-- 0004_product_media.sql
-- Bo sung video huong dan cho san pham; cap nhat mo ta chi tiet + nhieu anh
-- chup cho tung san pham mau (dung field description/preview_images co san).

alter table products add column if not exists video_url text;

-- ============ seed: mo ta chi tiet ============
update products set
  description = 'Bảng theo dõi thu chi cơ bản trên Google Sheets, tặng miễn phí để bạn dùng thử trước khi nâng cấp bản Pro.

Tính năng chính:
- Ghi chép thu/chi hàng ngày theo danh mục
- Tổng quan số dư cuối tháng
- Biểu đồ cột đơn giản theo danh mục chi tiêu

Phù hợp với: người mới bắt đầu quản lý tài chính cá nhân, muốn dùng thử trước khi mua bản đầy đủ.',
  preview_images = array[
    'https://placehold.co/800x600?text=Basic+Overview',
    'https://placehold.co/800x600?text=Basic+Nhap+lieu',
    'https://placehold.co/800x600?text=Basic+Bieu+do'
  ]
where slug = 'ultimate-personal-finance-dashboard-basic';

update products set
  description = 'Bản đầy đủ: biểu đồ động, dashboard tự cập nhật, mục tiêu tiết kiệm đa kỳ hạn. Nâng cấp từ bản Basic miễn phí.

Tính năng chính:
- Dashboard tổng quan tự động cập nhật khi nhập giao dịch mới
- Biểu đồ động: dòng tiền theo tháng, cơ cấu chi tiêu theo danh mục
- Đặt mục tiêu tiết kiệm nhiều kỳ hạn (ngắn/trung/dài hạn), tự tính % hoàn thành
- Cảnh báo khi chi vượt ngân sách theo danh mục
- Không cần cài thêm add-on, chạy trực tiếp trên Google Sheets

Phù hợp với: cá nhân/gia đình muốn quản lý tài chính chuyên nghiệp, trực quan mà không cần biết công thức Excel phức tạp.',
  preview_images = array[
    'https://placehold.co/800x600?text=Pro+Dashboard',
    'https://placehold.co/800x600?text=Pro+Bieu+do+dong+tien',
    'https://placehold.co/800x600?text=Pro+Muc+tieu+tiet+kiem',
    'https://placehold.co/800x600?text=Pro+Canh+bao+ngan+sach'
  ]
where slug = 'ultimate-personal-finance-dashboard';

update products set
  description = 'Hệ thống tạo hoá đơn tự động, theo dõi công nợ khách hàng, tích hợp gửi email tự động (dùng Apps Script).

Tính năng chính:
- Tạo hoá đơn chuyên nghiệp chỉ với vài cú click, tự đánh số thứ tự
- Theo dõi công nợ: đã thu / còn nợ / quá hạn, tự tô màu cảnh báo
- Gửi hoá đơn qua email tự động ngay từ Google Sheets (Apps Script có sẵn)
- Báo cáo doanh thu theo khách hàng, theo tháng

Phù hợp với: Freelancer, agency nhỏ, SME cần quản lý hoá đơn và công nợ gọn gàng mà không cần phần mềm kế toán đắt tiền.',
  preview_images = array[
    'https://placehold.co/800x600?text=Invoice+Overview',
    'https://placehold.co/800x600?text=Invoice+Cong+no',
    'https://placehold.co/800x600?text=Invoice+Email+tu+dong'
  ]
where slug = 'automated-invoice-client-tracker';

update products set
  description = 'Template quản lý tiến độ dự án, tự động vẽ biểu đồ Gantt khi nhập ngày tháng, có Kanban board.

Tính năng chính:
- Biểu đồ Gantt tự vẽ khi nhập ngày bắt đầu/kết thúc từng đầu việc
- Kanban board kéo-thả trạng thái: Chưa làm / Đang làm / Hoàn thành
- Theo dõi % tiến độ tổng dự án, cảnh báo task trễ hạn
- Phân công người phụ trách, lọc theo thành viên

Phù hợp với: team nhỏ (2-15 người) muốn quản lý dự án Agile/Scrum mà không cần trả phí Jira/Asana.',
  preview_images = array[
    'https://placehold.co/800x600?text=Gantt+Overview',
    'https://placehold.co/800x600?text=Kanban+Board',
    'https://placehold.co/800x600?text=Tien+do+du+an'
  ]
where slug = 'agile-scrum-project-manager';

update products set
  description = 'Bảng chấm công tự động tính lương, theo dõi ngày phép, tích hợp tính năng phê duyệt.

Tính năng chính:
- Chấm công theo ca, tự tính giờ làm/giờ tăng ca
- Tự động tính lương theo giờ công + phụ cấp
- Theo dõi ngày phép còn lại, lịch sử xin nghỉ
- Quy trình phê duyệt đơn nghỉ ngay trong Sheet (không cần app riêng)

Phù hợp với: doanh nghiệp 10-100 nhân sự chưa có phần mềm HR, muốn chuẩn hoá quy trình chấm công/nghỉ phép.',
  preview_images = array[
    'https://placehold.co/800x600?text=Timesheet+Overview',
    'https://placehold.co/800x600?text=Cham+cong',
    'https://placehold.co/800x600?text=Ngay+phep'
  ]
where slug = 'smart-timesheet-leave-tracker';

update products set
  description = 'Quản lý phễu bán hàng, tự động báo cáo doanh số theo tháng/nhân viên, theo dõi trạng thái chốt sale.

Tính năng chính:
- Quản lý khách hàng tiềm năng theo từng giai đoạn phễu bán hàng
- Dashboard doanh số tự động theo tháng, theo từng nhân viên sale
- Nhắc lịch follow-up khách hàng, tránh bỏ sót lead
- Báo cáo tỷ lệ chuyển đổi (conversion rate) theo nguồn khách

Phù hợp với: đội sale nhỏ (Startup/SME) cần 1 công cụ CRM đơn giản, không cần học phần mềm phức tạp.',
  preview_images = array[
    'https://placehold.co/800x600?text=CRM+Overview',
    'https://placehold.co/800x600?text=Sales+Pipeline',
    'https://placehold.co/800x600?text=Bao+cao+doanh+so'
  ]
where slug = 'mini-crm-sales-pipeline';

update products set
  description = 'Bảng theo dõi dòng tiền cho thuê, tính toán ROI đầu tư, quản lý bảo trì tài sản.

Tính năng chính:
- Theo dõi dòng tiền thuê hàng tháng theo từng bất động sản
- Tự động tính ROI, tỷ suất lợi nhuận theo năm
- File tính toán vay thế chấp (mortgage calculator) đi kèm
- Lịch bảo trì, sửa chữa tài sản, cảnh báo khi đến hạn

Phù hợp với: nhà đầu tư cá nhân sở hữu 1-10 bất động sản cho thuê, muốn theo dõi hiệu quả đầu tư rõ ràng.',
  preview_images = array[
    'https://placehold.co/800x600?text=Rental+ROI+Overview',
    'https://placehold.co/800x600?text=Dong+tien+thue',
    'https://placehold.co/800x600?text=Mortgage+Calculator'
  ]
where slug = 'rental-property-roi-management';

update products set
  description = 'Tự động tính biên lợi nhuận từng sản phẩm, theo dõi phí sàn (Shopee, Etsy), quản lý tồn kho theo SKU.

Tính năng chính:
- Tính lãi/lỗ từng sản phẩm sau khi trừ phí sàn, phí ship, phí quảng cáo
- Theo dõi tồn kho theo SKU, cảnh báo khi sắp hết hàng
- So sánh hiệu quả bán hàng giữa các sàn (Shopee, Etsy, TikTok Shop...)
- Báo cáo lợi nhuận tổng theo tuần/tháng

Phù hợp với: người bán hàng online, chủ shop trên các sàn TMĐT cần biết chính xác mình đang lãi hay lỗ.',
  preview_images = array[
    'https://placehold.co/800x600?text=Ecom+Overview',
    'https://placehold.co/800x600?text=Loi+nhuan+SKU',
    'https://placehold.co/800x600?text=Ton+kho'
  ]
where slug = 'ecom-profit-inventory-dashboard';

update products set
  description = 'Quản lý ngân sách cưới, danh sách khách mời (tự động đếm RSVP), phân công nhiệm vụ (checklist).

Tính năng chính:
- Quản lý ngân sách cưới theo từng hạng mục, so sánh dự kiến/thực tế
- Danh sách khách mời, tự động đếm số khách xác nhận tham dự (RSVP)
- Checklist công việc cần làm theo mốc thời gian (6 tháng, 3 tháng, 1 tuần trước cưới)
- Giao diện màu pastel, dễ nhìn, phù hợp chia sẻ với gia đình/wedding planner

Phù hợp với: cặp đôi tự lên kế hoạch đám cưới, wedding planner cần công cụ quản lý gọn gàng.',
  preview_images = array[
    'https://placehold.co/800x600?text=Wedding+Overview',
    'https://placehold.co/800x600?text=Ngan+sach+cuoi',
    'https://placehold.co/800x600?text=Danh+sach+khach+moi'
  ]
where slug = 'ultimate-wedding-planner-workbook';

update products set
  description = 'Theo dõi tiến độ học viên/khách hàng, tự động vẽ biểu đồ thói quen, lịch trình học tập.

Tính năng chính:
- Theo dõi tiến độ từng học viên/khách hàng theo buổi học
- Biểu đồ thói quen (habit tracker) tự động cập nhật
- Lịch trình học tập, nhắc lịch buổi học tiếp theo
- Giao diện đơn giản, có thể chia sẻ trực tiếp cho học viên xem tiến độ

Phù hợp với: giáo viên, gia sư, Life/Fitness Coach cần theo dõi tiến độ nhiều học viên cùng lúc.',
  preview_images = array[
    'https://placehold.co/800x600?text=Client+Progress+Overview',
    'https://placehold.co/800x600?text=Habit+Tracker',
    'https://placehold.co/800x600?text=Lich+hoc'
  ]
where slug = 'client-progress-teacher-dashboard';

update products set
  description = 'Tính Calo/Macros tự động, theo dõi biểu đồ giảm cân/tăng cơ và lịch tập luyện.

Tính năng chính:
- Tự động tính Calo, Protein/Carb/Fat (Macros) theo mục tiêu cá nhân
- Biểu đồ cân nặng, số đo cơ thể theo thời gian
- Lịch tập luyện theo tuần, theo dõi mức tạ/số rep từng bài
- Dễ dùng trên điện thoại qua Google Sheets app

Phù hợp với: người tập gym, giảm cân/tăng cơ muốn theo dõi số liệu dinh dưỡng và tập luyện có hệ thống.',
  preview_images = array[
    'https://placehold.co/800x600?text=Fitness+Overview',
    'https://placehold.co/800x600?text=Macros+Tracker',
    'https://placehold.co/800x600?text=Lich+tap'
  ]
where slug = 'fitness-macros-tracker-dashboard';
