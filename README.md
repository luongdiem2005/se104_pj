# EduFee - Hệ Thống Quản Lý Đăng Ký Môn Học Và Thu Học Phí

## Giới thiệu

Hệ thống hỗ trợ quản lý quá trình đăng ký môn học và thu học phí trong trường đại học.

Các chức năng chính:

- Quản lý sinh viên
- Quản lý chương trình học (Khoa, Ngành học, Môn học) 
- Quản lý việc đăng ký học phần
- Theo dõi trạng thái thanh toán học phí
- Thống kê và báo cáo

---
## Thành viên nhóm

| MSSV | Họ và tên | 
|--------|------------|
| 23520079 | Trần Thị Kim Anh | 
| 23520285 | Lương Kiều Diễm | 
| 23520430 | Lê Thị Ngọc Hân | 
| 23520415 | Trần Thanh Hà |
| 23520585 | Lại Thị Thu Hương |
---

## Công nghệ sử dụng

### Frontend

- HTML
- CSS
- JavaScript 

### Backend

- Node.js
- Express.js

### Database

- MySQL
- Prisma ORM 5.22.0

### Công cụ phát triển

- Visual Studio Code
- Git
- GitHub

---

## Kiến trúc hệ thống

```
Frontend
    │
    ▼
Express API Server
    │
    ▼
Prisma ORM
    │
    ▼
MySQL Database
```
## Cấu trúc thư mục dự án
```text
QLSV/
├── backend/
│   ├── node_modules/          # Thư viện Node.js
│   ├── prisma/                # Schema và migration Prisma
│   ├── src/                   # Source code Backend
│   ├── .env                   # Biến môi trường
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── prisma.config.ts
│
└── frontend/
    ├── assets/                
    ├── components/            
    ├── js/                    
    ├── pages/
    │   ├── academic/          # Trang đào tạo
    │   ├── admin/             # Trang quản trị
    │   ├── finance/           # Trang tài chính
    │   └── student/           # Trang sinh viên
    └── index.html             # Trang đăng nhập
```
---

## Chức năng theo vai trò

### Sinh viên

- Xem Hồ sơ cá nhân
- Đăng ký học phần
- Xem lịch sử đăng ký học phần
- Thanh toán học phí
- Xem lịch sử thanh toán 

### Phòng đào tạo

- Quản lý sinh viên
- Quản lý chương trình học
- Quản lý khoa
- Quản lý ngành học
- Quản lý môn học
- Quản lý học kỳ năm học
- Quản lý môn học mở
- Quản lý đăng ký học phần
- Quản lý đối tượng ưu tiên
- Quản lý quê quán

### Phòng tài chính

- Quản lý học phí
- Quản lý phiếu thu
- Quản lý nợ học phí
- Xem báo cáo doanh thu

### Quản trị viên

- Quản lý người dùng
- Quản lý nhóm quyền
- Quản lý chức năng
- Quản lý tham số hệ thống
- Phân quyền
- Quản lý các trang của Sinh viên, Phòng đào tạo, Phòng tài chính

---


## Cài đặt dự án

### 1. Clone project

```bash
git clone https://github.com/luongdiem2005/SE104_QLDKHP-HP.git
cd SE104_QLDKHP-HP
```

### 2. Cấu hình Backend
Di chuyển vào thư mục backend:
```bash
cd backend
```
Tạo file '.env' và cấu hình các biến môi trường cần thiết.

```env
DATABASE_URL="mysql://root:password@localhost:3306/qlsv"
PORT=3000
JWT_SECRET=nhapmoncongnghephanmem
```
---
### 3. Cài đặt thư viện

```bash
npm install
```

### 4. Tạo cơ sở dữ liệu MYSQL
Mở MySQL và thực hiện:
```sql
DROP DATABASE IF EXISTS qlsv;
CREATE DATABASE qlsv;
```
---
### 5. Khởi tạo Prisma
Generate Prisma Client:
```bash
npx prisma generate
```
Đồng bộ schema với cơ sở dữ liệu:
```bash
npx prisma db push
```
---

### 6. Nạp dữ liệu mẫu 
```bash
npm run prisma:seed
```

---
### 7. Chạy Backend
```bash
npm run dev
```

Server sẽ chạy tại:

```text
http://localhost:5000
```
---
### 8. Chạy Frontend

Mở terminal mới:

```bash
cd frontend
```

Mở file giao diện:

```bash
start index.html
```

Hoặc mở trực tiếp file `index.html` bằng trình duyệt.

---
## Bảng tài khoản người dùng
Mật khẩu chung cho các tài khoản: 123456
| Tên truy cập | Vai trò |
|--------|------------|
| 23520001 | Sinh viên | 
| pdt | Phòng đào tạo | 
| ptc | Phòng tài chính | 
| admin | Quản trị viên |
---

## Kết quả đạt được

- Xây dựng hệ thống quản lý đăng ký môn học.
- Tự động tính học phí dựa trên số tín chỉ.
- Quản lý thanh toán học phí.
- Quản lý dữ liệu bằng Prisma và MySQL.

---

## Giấy phép

Dự án được phát triển phục vụ mục đích học tập và nghiên cứu.
