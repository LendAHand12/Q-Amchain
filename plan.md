I. TỔNG QUAN SẢN PHẨM Q-AMCHAIN

1. Mô hình kinh doanh

Bán validator packages (Basic / Standard / Premium / …)

Affiliate 2 tầng (có thể mở rộng N tầng trong tương lai)

Hoa hồng theo từng gói

Thanh toán USDT – BNB Chain (BEP20)

Thu nhập:

Direct income (F1)

Indirect income (F2)

User có thể:

Mua gói

Giới thiệu người khác

Xem sơ đồ hệ thống

Yêu cầu rút tiền

👉 Không phải MLM phức tạp, chỉ là affiliate 2 tầng + validator sale

II. KIẾN TRÚC TỔNG THỂ (HIGH LEVEL)
Frontend (ReactJS)
│
├── Landing Page (Public)
├── User App
└── Admin Dashboard
↓
Backend (NodeJS + Express)
│
├── Auth Service
├── User Service
├── Affiliate / Commission Engine
├── Payment (Crypto USDT BEP20)
├── Withdrawal Service
└── Admin Service
↓
Database (MongoDB)
↓
Blockchain (BNB Chain)

III. PHÂN CHIA MODULE CHỨC NĂNG
A. LANDING PAGE (PUBLIC)
Các trang

Home

About Us

Validator Packages (Products)

Affiliate Program

Blog / News

FAQ

Login / Register

Công nghệ

ReactJS + Tailwind / Shadcn UI

SEO-friendly

Có referral link:

https://q-amchain.com/register?ref=ABC123

B. USER SYSTEM (CORE)

1. Đăng ký & Đăng nhập

Đăng ký bằng:

Email hoặc Username (viết liền không in hoa và không dấu)

Email verification (link xác nhận)

Password hashing (bcrypt)

Login → bắt buộc 2FA (Google Authenticator)

👉 Flow:

Register → Verify Email → Login → 2FA Verify → Dashboard

2. Referral / Affiliate System
   Cấu trúc cây

Mỗi user có:

refCode

parentId

ancestors[] (để tối ưu truy vấn F2, F3 sau này)

Ví dụ:
A
└── B
└── C

3. Validator Packages
   Bảng Package
   Field Mô tả
   name Premium
   price 800
   currency USDT
   commissionLv1 10%
   commissionLv2 2%
   status active
4. Thanh toán Crypto (USDT BEP20)
   Phương án khuyến nghị (AN TOÀN & CHUẨN):

1 ví USDT master

Mỗi user:

Tạo unique memo / amount / orderId

Backend:

Theo dõi transaction bằng:

BSCScan API

Webhook (nếu dùng provider)

Flow:
User chọn gói
→ Backend tạo Order
→ Trả về:

- Address nhận USDT
- Amount
- Order ID
  → User chuyển USDT
  → Backend verify tx
  → Kích hoạt gói

5. Commission Engine (TRÁI TIM HỆ THỐNG)
   Khi Order = SUCCESS
   buyer = B
   parent = A
   grandParent = A_parent

Tính hoa hồng
A nhận = 800 _ 10% = 80 USDT
A_parent nhận = 800 _ 2% = 16 USDT

Ghi vào:

commission_logs

wallet_balance

⚠️ Hoa hồng KHÔNG trả ngay, mà:

Cộng vào balance

Chỉ trả khi admin duyệt withdrawal

6. User Dashboard
   Dashboard chính

Tổng thu nhập

Thu nhập F1 / F2

Số người giới thiệu

Số gói đã mua

Số dư khả dụng

Trang chi tiết

My Packages

Payment History

Commission History

Referral Tree (dạng cây mở rộng)

Withdraw Request

Profile + Security (2FA reset)

7. Sơ đồ hệ thống (Referral Tree)

Dạng:

Tree View

Click mở F1 → F2

Backend:

Query theo parentId

Frontend:

D3.js / React Flow / Ant Tree

C. ADMIN SYSTEM

1. Quản lý User

Danh sách user

Xem profile chi tiết

Xem referral tree của user

Lock / Unlock user

Reset 2FA

2. Quản lý Packages

Tạo / sửa / disable gói

Set % hoa hồng từng tầng

3. Quản lý giao dịch

Orders

Transaction crypto

Commission logs

Balance logs

4. Quản lý Withdrawal

Danh sách yêu cầu rút

Approve / Reject

Nhập tx hash trả tiền

Log lịch sử xử lý

5. Audit & Logs

Lịch sử:

Update user

Update package

Admin actions

Không cho delete cứng (soft delete)

IV. DATABASE DESIGN (MONGODB)
Các collection chính

admins

users

packages

orders

transactions

commissions

wallets

withdrawals

admin_logs

blogs

👉 Dùng MongoDB + Index kỹ để scale.

V. TECH STACK ĐỀ XUẤT
Frontend

ReactJS

Redux Toolkit / Zustand

TailwindCSS

Shadcn UI

React Hook Form

D3.js (tree)

Backend

NodeJS + Express

JWT + Refresh Token

Speakeasy (2FA)

Nodemailer

Bcrypt

Web3.js / Ethers.js

BSCScan API

Database

MongoDB

VI. SECURITY CỰC KỲ QUAN TRỌNG

2FA bắt buộc

Rate limit login

Email verification

Withdraw cần:

2FA

Password

Không auto payout

Không lưu private key trên server

Admin role phân cấp

Admin user created!
Email: ameritec@gmail.com
Username: Ameritec
Password: Pierre@@1968@@@@@
Role: Super Admin

Root user created:
Email: nguyenpierre68@gmail.com
Username: NguyenPierre
Password: Pierre@@1968@@@@@
RefCode: nguyenpierre
