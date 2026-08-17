-- 0009_i18n.sql
-- Da ngon ngu (UI toggle, khong doi URL): ban dich name/description cho
-- products/bundles theo locale. 'vi' khong can dong (dung truc tiep cot
-- goc products.name/description).

create table if not exists product_translations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id),
  locale text not null check (locale in ('en', 'zh')),
  name text not null,
  description text,
  unique (product_id, locale)
);

create table if not exists bundle_translations (
  id uuid primary key default gen_random_uuid(),
  bundle_id uuid not null references bundles(id),
  locale text not null check (locale in ('en', 'zh')),
  name text not null,
  description text,
  unique (bundle_id, locale)
);

alter table product_translations enable row level security;
alter table bundle_translations enable row level security;

create policy "Cong khai xem ban dich san pham"
  on product_translations for select
  to anon, authenticated
  using (true);

create policy "Cong khai xem ban dich combo"
  on bundle_translations for select
  to anon, authenticated
  using (true);

-- ============ seed: ban dich tieng Anh ============
insert into product_translations (product_id, locale, name, description)
select id, 'en',
  'Ultimate Personal Finance Dashboard — Basic (Free)',
  'A basic income/expense tracker on Google Sheets, free to try before upgrading to the Pro version.

Key features:
- Log daily income/expenses by category
- Monthly balance overview
- Simple bar chart by spending category

Best for: people new to personal finance management who want to try it out before buying the full version.'
from products where slug = 'ultimate-personal-finance-dashboard-basic'
on conflict (product_id, locale) do nothing;

insert into product_translations (product_id, locale, name, description)
select id, 'en',
  'Ultimate Personal Finance Dashboard — Pro',
  'The full version: dynamic charts, an auto-updating dashboard, and multi-term savings goals. Upgraded from the free Basic version.

Key features:
- Overview dashboard that auto-updates as you log new transactions
- Dynamic charts: monthly cash flow, spending breakdown by category
- Set savings goals across multiple terms (short/medium/long) with automatic progress tracking
- Alerts when spending exceeds your budget by category
- No add-ons needed — runs directly in Google Sheets

Best for: individuals and families who want professional, visual finance management without needing complex Excel formulas.'
from products where slug = 'ultimate-personal-finance-dashboard'
on conflict (product_id, locale) do nothing;

insert into product_translations (product_id, locale, name, description)
select id, 'en',
  'Automated Invoice & Client Tracker',
  'An automated invoicing system with client debt tracking and built-in automatic email sending (via Apps Script).

Key features:
- Create professional invoices in a few clicks with auto-numbering
- Track receivables: paid / outstanding / overdue, with automatic color-coded alerts
- Send invoices by email automatically straight from Google Sheets (Apps Script included)
- Revenue reports by client and by month

Best for: freelancers, small agencies, and SMEs who need tidy invoice and debt tracking without expensive accounting software.'
from products where slug = 'automated-invoice-client-tracker'
on conflict (product_id, locale) do nothing;

insert into product_translations (product_id, locale, name, description)
select id, 'en',
  'Agile/Scrum Project Manager',
  'A project tracking template that auto-draws a Gantt chart from your dates and includes a Kanban board.

Key features:
- Gantt chart auto-generated from each task''s start/end dates
- Drag-and-drop Kanban board: To Do / In Progress / Done
- Overall project progress %, with overdue task alerts
- Assign owners and filter by team member

Best for: small teams (2-15 people) who want Agile/Scrum project management without paying for Jira/Asana.'
from products where slug = 'agile-scrum-project-manager'
on conflict (product_id, locale) do nothing;

insert into product_translations (product_id, locale, name, description)
select id, 'en',
  'Smart Timesheet & Leave Tracker',
  'A timesheet that auto-calculates pay, tracks leave days, and includes a built-in approval workflow.

Key features:
- Shift-based time tracking with automatic regular/overtime hours
- Automatic pay calculation from hours worked plus allowances
- Track remaining leave days and leave request history
- Leave approval workflow built right into the Sheet (no separate app needed)

Best for: businesses with 10-100 employees who don''t have HR software yet and want to standardize timesheet/leave processes.'
from products where slug = 'smart-timesheet-leave-tracker'
on conflict (product_id, locale) do nothing;

insert into product_translations (product_id, locale, name, description)
select id, 'en',
  'Mini CRM & Sales Pipeline',
  'Manage your sales funnel with automatic monthly/per-rep revenue reports and deal-stage tracking.

Key features:
- Manage leads by sales funnel stage
- Automatic monthly revenue dashboard, broken down by sales rep
- Follow-up reminders so no lead gets missed
- Conversion rate reports by lead source

Best for: small sales teams (Startups/SMEs) who need a simple CRM tool without a steep learning curve.'
from products where slug = 'mini-crm-sales-pipeline'
on conflict (product_id, locale) do nothing;

insert into product_translations (product_id, locale, name, description)
select id, 'en',
  'Rental Property ROI & Management',
  'Track rental cash flow, calculate investment ROI, and manage property maintenance.

Key features:
- Track monthly rental cash flow per property
- Automatic ROI and annual return calculations
- Includes a built-in mortgage calculator
- Maintenance/repair schedule with due-date alerts

Best for: individual investors with 1-10 rental properties who want clear visibility into investment performance.'
from products where slug = 'rental-property-roi-management'
on conflict (product_id, locale) do nothing;

insert into product_translations (product_id, locale, name, description)
select id, 'en',
  'E-com Profit & Inventory Dashboard',
  'Automatically calculate profit margin per product, track marketplace fees (Shopee, Etsy), and manage inventory by SKU.

Key features:
- Profit/loss per product after marketplace fees, shipping, and ad spend
- SKU-level inventory tracking with low-stock alerts
- Compare sales performance across marketplaces (Shopee, Etsy, TikTok Shop...)
- Weekly/monthly profit reports

Best for: online sellers and marketplace shop owners who need to know exactly whether they''re making a profit or a loss.'
from products where slug = 'ecom-profit-inventory-dashboard'
on conflict (product_id, locale) do nothing;

insert into product_translations (product_id, locale, name, description)
select id, 'en',
  'Ultimate Wedding Planner Workbook',
  'Manage your wedding budget, guest list (with automatic RSVP counting), and task checklist.

Key features:
- Track wedding budget by category, planned vs. actual
- Guest list with automatic RSVP count
- Task checklist by timeline (6 months, 3 months, 1 week before the wedding)
- Clean pastel design, easy to share with family or your wedding planner

Best for: couples planning their own wedding, or wedding planners who need a tidy management tool.'
from products where slug = 'ultimate-wedding-planner-workbook'
on conflict (product_id, locale) do nothing;

insert into product_translations (product_id, locale, name, description)
select id, 'en',
  'Client Progress / Teacher Dashboard',
  'Track student/client progress with auto-updating habit charts and a study schedule.

Key features:
- Track each student/client''s progress session by session
- Auto-updating habit tracker chart
- Study schedule with reminders for the next session
- Simple interface you can share directly with students to show progress

Best for: teachers, tutors, and life/fitness coaches who need to track progress for multiple students at once.'
from products where slug = 'client-progress-teacher-dashboard'
on conflict (product_id, locale) do nothing;

insert into product_translations (product_id, locale, name, description)
select id, 'en',
  'Fitness & Macros Tracker Dashboard',
  'Automatically calculate calories/macros and track weight-loss/muscle-gain charts and your workout schedule.

Key features:
- Automatic calorie and macro (protein/carb/fat) calculation based on your personal goals
- Weight and body measurement charts over time
- Weekly workout schedule, tracking weight/reps per exercise
- Easy to use on mobile via the Google Sheets app

Best for: gym-goers focused on weight loss or muscle gain who want to track nutrition and training systematically.'
from products where slug = 'fitness-macros-tracker-dashboard'
on conflict (product_id, locale) do nothing;

insert into bundle_translations (bundle_id, locale, name, description)
select id, 'en',
  'SME Business Bundle',
  'A set of 2 templates: Mini CRM & Sales Pipeline + Automated Invoice & Client Tracker. Buying together saves more than buying separately.'
from bundles where slug = 'combo-kinh-doanh-cho-sme'
on conflict (bundle_id, locale) do nothing;

-- ============ seed: ban dich tieng Trung (gian the) ============
insert into product_translations (product_id, locale, name, description)
select id, 'zh',
  'Ultimate Personal Finance Dashboard — 基础版（免费）',
  '基于 Google 表格的基础收支记录表，免费试用，之后可升级到专业版。

主要功能：
- 按类别记录每日收支
- 月末余额总览
- 按支出类别显示简单柱状图

适合人群：刚开始管理个人财务、希望先试用再购买完整版的用户。'
from products where slug = 'ultimate-personal-finance-dashboard-basic'
on conflict (product_id, locale) do nothing;

insert into product_translations (product_id, locale, name, description)
select id, 'zh',
  'Ultimate Personal Finance Dashboard — 专业版',
  '完整版：动态图表、自动更新的仪表盘、多期限储蓄目标。从免费基础版升级而来。

主要功能：
- 记录新交易后自动更新的总览仪表盘
- 动态图表：按月现金流、按类别支出结构
- 设置多期限储蓄目标（短期/中期/长期），自动计算完成百分比
- 支出超出类别预算时发出提醒
- 无需安装插件，直接在 Google 表格中运行

适合人群：希望专业、直观地管理财务，又不想学习复杂 Excel 公式的个人或家庭。'
from products where slug = 'ultimate-personal-finance-dashboard'
on conflict (product_id, locale) do nothing;

insert into product_translations (product_id, locale, name, description)
select id, 'zh',
  'Automated Invoice & Client Tracker（自动发票与客户管理）',
  '自动生成发票系统，跟踪客户欠款，内置自动邮件发送功能（使用 Apps Script）。

主要功能：
- 几次点击即可生成专业发票，自动编号
- 跟踪应收账款：已收/未收/逾期，自动颜色提醒
- 直接从 Google 表格自动发送发票邮件（内置 Apps Script）
- 按客户、按月生成营收报表

适合人群：自由职业者、小型代理商、需要简洁管理发票与欠款、又不想购买昂贵会计软件的中小企业。'
from products where slug = 'automated-invoice-client-tracker'
on conflict (product_id, locale) do nothing;

insert into product_translations (product_id, locale, name, description)
select id, 'zh',
  'Agile/Scrum Project Manager（敏捷项目管理）',
  '项目进度管理模板，输入日期后自动生成甘特图，并附带看板（Kanban）功能。

主要功能：
- 输入每项任务的起止日期，自动生成甘特图
- 可拖拽的看板：待处理/进行中/已完成
- 跟踪项目整体进度百分比，逾期任务自动提醒
- 分配负责人，可按成员筛选

适合人群：希望以敏捷/Scrum 方式管理项目、又不想为 Jira/Asana 付费的小团队（2-15人）。'
from products where slug = 'agile-scrum-project-manager'
on conflict (product_id, locale) do nothing;

insert into product_translations (product_id, locale, name, description)
select id, 'zh',
  'Smart Timesheet & Leave Tracker（智能考勤与请假管理）',
  '自动计算工资的考勤表，跟踪年假天数，内置审批流程。

主要功能：
- 按班次打卡，自动计算工作时长/加班时长
- 根据工时和津贴自动计算工资
- 跟踪剩余年假天数及请假历史
- 请假审批流程直接在表格内完成（无需额外App）

适合人群：10-100人规模、尚无HR软件、希望规范考勤/请假流程的企业。'
from products where slug = 'smart-timesheet-leave-tracker'
on conflict (product_id, locale) do nothing;

insert into product_translations (product_id, locale, name, description)
select id, 'zh',
  'Mini CRM & Sales Pipeline（迷你销售管理工具）',
  '管理销售漏斗，自动生成按月/按销售人员的业绩报表，跟踪成交状态。

主要功能：
- 按销售漏斗阶段管理潜在客户
- 自动生成按月、按销售人员的业绩仪表盘
- 客户跟进提醒，避免遗漏商机
- 按客户来源生成转化率报表

适合人群：需要简单易用CRM工具、不想学习复杂软件的初创/中小企业销售团队。'
from products where slug = 'mini-crm-sales-pipeline'
on conflict (product_id, locale) do nothing;

insert into product_translations (product_id, locale, name, description)
select id, 'zh',
  'Rental Property ROI & Management（出租房产投资回报管理）',
  '跟踪租金现金流，计算投资回报率（ROI），管理房产维护。

主要功能：
- 按房产跟踪每月租金现金流
- 自动计算ROI及年化收益率
- 附带房贷计算器
- 维护/维修日程提醒，到期自动提醒

适合人群：拥有1-10套出租房产、希望清晰掌握投资回报的个人投资者。'
from products where slug = 'rental-property-roi-management'
on conflict (product_id, locale) do nothing;

insert into product_translations (product_id, locale, name, description)
select id, 'zh',
  'E-com Profit & Inventory Dashboard（电商利润与库存看板）',
  '自动计算每件商品的利润率，跟踪平台费用（Shopee、Etsy等），按SKU管理库存。

主要功能：
- 扣除平台费、运费、广告费后计算每件商品盈亏
- 按SKU跟踪库存，库存不足自动提醒
- 对比各平台（Shopee、Etsy、TikTok Shop等）销售表现
- 按周/按月生成总利润报表

适合人群：需要准确掌握盈亏情况的电商卖家及平台店主。'
from products where slug = 'ecom-profit-inventory-dashboard'
on conflict (product_id, locale) do nothing;

insert into product_translations (product_id, locale, name, description)
select id, 'zh',
  'Ultimate Wedding Planner Workbook（婚礼筹备手册）',
  '管理婚礼预算、宾客名单（自动统计RSVP回复），并分配筹备任务清单。

主要功能：
- 按类别管理婚礼预算，对比预计与实际支出
- 宾客名单，自动统计确认出席人数（RSVP）
- 按时间节点（婚礼前6个月、3个月、1周）列出待办清单
- 柔和马卡龙配色，方便与家人或婚礼策划师共享

适合人群：自行筹备婚礼的新人，或需要简洁管理工具的婚礼策划师。'
from products where slug = 'ultimate-wedding-planner-workbook'
on conflict (product_id, locale) do nothing;

insert into product_translations (product_id, locale, name, description)
select id, 'zh',
  'Client Progress / Teacher Dashboard（学员进度追踪表）',
  '跟踪学员/客户进度，自动生成习惯养成图表和学习计划。

主要功能：
- 按课程跟踪每位学员/客户的进度
- 自动更新的习惯追踪图表
- 学习计划安排，提醒下一次课程
- 界面简洁，可直接分享给学员查看进度

适合人群：需要同时跟踪多名学员进度的教师、家教及健身/生活教练。'
from products where slug = 'client-progress-teacher-dashboard'
on conflict (product_id, locale) do nothing;

insert into product_translations (product_id, locale, name, description)
select id, 'zh',
  'Fitness & Macros Tracker Dashboard（健身营养与训练追踪表）',
  '自动计算卡路里/三大营养素（蛋白质/碳水/脂肪），跟踪减脂增肌图表及训练计划。

主要功能：
- 根据个人目标自动计算卡路里及三大营养素摄入量
- 体重、身体维度变化趋势图
- 每周训练计划，记录每个动作的重量/次数
- 可在手机 Google 表格App上方便使用

适合人群：希望系统化跟踪营养与训练数据的健身、减脂增肌人群。'
from products where slug = 'fitness-macros-tracker-dashboard'
on conflict (product_id, locale) do nothing;

insert into bundle_translations (bundle_id, locale, name, description)
select id, 'zh',
  '中小企业经营套装',
  '包含2款模板：迷你CRM销售管理 + 自动发票与客户管理。组合购买比单独购买更划算。'
from bundles where slug = 'combo-kinh-doanh-cho-sme'
on conflict (bundle_id, locale) do nothing;
