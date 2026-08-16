-- 0002_industry_categories.sql
-- Chuyen category tu loai file (canva/figma/ppt/word/excel) sang 10 nhom nganh
-- theo chien luoc SEO/khai thac noi dung. Xoa du lieu mau cu, seed lai theo
-- nhom nganh moi. Them cot monetization_strategy de luu ghi chu chien luoc
-- khai thac cho tung san pham (chi dung noi bo, khong hien thi cho khach).

delete from download_tokens where order_id in (select id from orders);
delete from email_logs where order_id in (select id from orders);
delete from payment_transactions;
delete from orders;
delete from products;

alter table products add column if not exists monetization_strategy text;

alter table products drop constraint if exists products_category_check;
alter table products add constraint products_category_check check (
  category in (
    'personal-finance',
    'accounting-b2b',
    'project-management',
    'hr-operations',
    'marketing-sales',
    'real-estate',
    'ecommerce',
    'event-wedding',
    'education-coaching',
    'fitness-health'
  )
);

insert into products (slug, name, description, category, price, preview_images, file_path, is_active, monetization_strategy) values
(
  'ultimate-personal-finance-dashboard',
  'Ultimate Personal Finance Dashboard',
  'Bảng điều khiển tài chính cá nhân toàn diện trên Google Sheets: biểu đồ trực quan, theo dõi thu chi và mục tiêu tiết kiệm tự động.',
  'personal-finance', 129000,
  array['https://placehold.co/600x450?text=Personal+Finance+Dashboard'],
  'ultimate-personal-finance-dashboard.xlsx', true,
  'Phễu mối nhử (Lead Magnet): tặng miễn phí bản Basic để thu Email, bán bản Pro có biểu đồ động giá 5-10 USD. Cần build luồng freemium riêng (chưa có ở bản này).'
),
(
  'automated-invoice-client-tracker',
  'Automated Invoice & Client Tracker',
  'Hệ thống tạo hoá đơn tự động, theo dõi công nợ khách hàng, tích hợp gửi email tự động (dùng Apps Script).',
  'accounting-b2b', 349000,
  array['https://placehold.co/600x450?text=Invoice+Tracker'],
  'automated-invoice-client-tracker.xlsx', true,
  'Bán trực tiếp (Paid): hướng tới Freelancer/SME. Giá 15-29 USD, tỉ lệ chuyển đổi cao vì giúp họ kiếm tiền.'
),
(
  'agile-scrum-project-manager',
  'Agile/Scrum Project Manager',
  'Template quản lý tiến độ dự án, tự động vẽ biểu đồ Gantt khi nhập ngày tháng, có Kanban board.',
  'project-management', 499000,
  array['https://placehold.co/600x450?text=Agile+Project+Manager'],
  'agile-scrum-project-manager.xlsx', true,
  'Sản phẩm chủ lực (Core Offer): cạnh tranh bằng tính dễ sử dụng so với phần mềm đắt đỏ (Jira, Asana). Giá 20-40 USD.'
),
(
  'smart-timesheet-leave-tracker',
  'Smart Timesheet & Leave Tracker',
  'Bảng chấm công tự động tính lương, theo dõi ngày phép, tích hợp tính năng phê duyệt.',
  'hr-operations', 990000,
  array['https://placehold.co/600x450?text=Timesheet+Leave+Tracker'],
  'smart-timesheet-leave-tracker.xlsx', true,
  'Bán B2B cao cấp (High-ticket): đóng gói cùng video hướng dẫn vận hành. Doanh nghiệp sẵn sàng trả 50+ USD cho giải pháp này.'
),
(
  'mini-crm-sales-pipeline',
  'Mini CRM & Sales Pipeline',
  'Quản lý phễu bán hàng, tự động báo cáo doanh số theo tháng/nhân viên, theo dõi trạng thái chốt sale.',
  'marketing-sales', 399000,
  array['https://placehold.co/600x450?text=Mini+CRM+Sales+Pipeline'],
  'mini-crm-sales-pipeline.xlsx', true,
  'Gói combo (Bundle): bán chung với các template khác dành cho Startup/SME hoặc bán lẻ giá 19-29 USD. Cần build cơ chế combo (chưa có ở bản này).'
),
(
  'rental-property-roi-management',
  'Rental Property ROI & Management',
  'Bảng theo dõi dòng tiền cho thuê, tính toán ROI đầu tư, quản lý bảo trì tài sản.',
  'real-estate', 799000,
  array['https://placehold.co/600x450?text=Rental+Property+ROI'],
  'rental-property-roi-management.xlsx', true,
  'Giá trị cao (High-ticket): nhà đầu tư sẵn sàng trả 30-50 USD. Bán kèm file tính toán vay thế chấp (mortgage calculator).'
),
(
  'ecom-profit-inventory-dashboard',
  'E-com Profit & Inventory Dashboard',
  'Tự động tính biên lợi nhuận từng sản phẩm, theo dõi phí sàn (Shopee, Etsy), quản lý tồn kho theo SKU.',
  'ecommerce', 349000,
  array['https://placehold.co/600x450?text=Ecom+Profit+Dashboard'],
  'ecom-profit-inventory-dashboard.xlsx', true,
  'Bán trực tiếp: đánh vào nhóm bán hàng online/Etsy. Cực kỳ dễ chốt sale vì giải quyết trực tiếp bài toán lỗ lãi.'
),
(
  'ultimate-wedding-planner-workbook',
  'Ultimate Wedding Planner Workbook',
  'Quản lý ngân sách cưới, danh sách khách mời (tự động đếm RSVP), phân công nhiệm vụ (checklist).',
  'event-wedding', 249000,
  array['https://placehold.co/600x450?text=Wedding+Planner+Workbook'],
  'ultimate-wedding-planner-workbook.xlsx', true,
  'Phân phối B2C (Etsy/Pinterest): nhu cầu cực lớn, yêu cầu thiết kế UI bắt mắt, màu sắc pastel/sang trọng. Giá 10-15 USD.'
),
(
  'client-progress-teacher-dashboard',
  'Client Progress / Teacher Dashboard',
  'Theo dõi tiến độ học viên/khách hàng, tự động vẽ biểu đồ thói quen, lịch trình học tập.',
  'education-coaching', 99000,
  array['https://placehold.co/600x450?text=Client+Progress+Dashboard'],
  'client-progress-teacher-dashboard.xlsx', true,
  'Bán số lượng lớn (Volume): nhắm đến giáo viên hoặc Life/Fitness Coach. Thiết kế đơn giản nhưng yếu tố Gamification hoá.'
),
(
  'fitness-macros-tracker-dashboard',
  'Fitness & Macros Tracker Dashboard',
  'Tính Calo/Macros tự động, theo dõi biểu đồ giảm cân/tăng cơ và lịch tập luyện.',
  'fitness-health', 149000,
  array['https://placehold.co/600x450?text=Fitness+Macros+Tracker'],
  'fitness-macros-tracker-dashboard.xlsx', true,
  'Affiliate / Influencer Marketing: hợp tác với các Fitness Blogger để họ bán cho follower. Tặng bản Basic để dẫn lead — cần build cơ chế affiliate riêng (chưa có ở bản này).'
);
