# Permission Management Scripts

Các script tiện ích để quản lý permissions cho hệ thống role-based access control.

## Scripts có sẵn

### 1. Add Permissions (Thêm quyền mới)

Thêm permissions mới cho một trang/tính năng và cập nhật vào các roles.

```bash
cd server
npm run add-permissions
```

**Script sẽ hỏi:**
1. Tên feature (ví dụ: `reports`, `analytics`, `settings`)
2. Các loại permission cần tạo (view, create, update, delete)
3. Roles nào sẽ nhận permissions này
4. Xác nhận trước khi thực hiện

**Ví dụ:**
```
📝 Enter feature name: reports
📋 Which permissions do you want to create?
   - view? (y/n): y
   - create? (y/n): y
   - update? (y/n): n
   - delete? (y/n): n

✨ Permissions to be created:
   - reports.view
   - reports.create

🎭 Which roles should have these permissions?
   - Super Admin? (y/n): y
   - Other existing roles? (y/n): y
```

**Kết quả:**
- Permissions được thêm vào database cho các roles đã chọn
- Script sẽ hiển thị code cần thêm vào `Role.model.js`

### 2. List Permissions (Xem danh sách quyền)

Hiển thị tất cả roles và permissions của chúng.

```bash
cd server
npm run list-permissions
```

**Kết quả:**
```
📋 Current Roles and Permissions

🎭 Super Admin
   Description: Full access to all features
   Status: Active
   Default: Yes
   Permissions (24):

      ADMINS:
         ✓ admins.view
         ✓ admins.create
         ✓ admins.update
         ✓ admins.delete

      USERS:
         ✓ users.view
         ✓ users.create
         ✓ users.update
         ✓ users.delete
         ...
```

## Quy trình thêm trang mới

### Bước 1: Chạy script add permissions

```bash
cd server
npm run add-permissions
```

Nhập thông tin:
- Feature name: `analytics`
- Chọn permissions: view, create
- Chọn roles: Super Admin (y), Other roles (y)

### Bước 2: Cập nhật Role Model

Mở `server/models/Role.model.js` và thêm permissions vào enum:

```javascript
permissions: [
  {
    type: String,
    enum: [
      // ... existing permissions
      
      // Analytics (mới thêm)
      "analytics.view",
      "analytics.create",
    ],
  },
],
```

### Bước 3: Restart server

```bash
# Server sẽ tự động restart nếu dùng nodemon
# Hoặc restart thủ công
```

### Bước 4: Sử dụng trong code

**Backend route:**
```javascript
router.get("/analytics", 
  checkPermission("analytics.view"), 
  analyticsController.getAnalytics
);
```

**Frontend route config:**
```javascript
// client/src/config/routePermissions.js
export const ROUTE_PERMISSIONS = {
  // ...
  '/admin/analytics': 'analytics.view',
};
```

## Lưu ý

- ⚠️ Luôn thêm permissions vào `Role.model.js` enum sau khi chạy script
- ⚠️ Restart server sau khi cập nhật model
- ✅ Script chỉ cập nhật database, không sửa code
- ✅ Có thể chạy script nhiều lần, không tạo duplicate permissions
- ✅ Script có confirmation trước khi thực hiện thay đổi

## Troubleshooting

**Lỗi: "Permission denied"**
- Đảm bảo đã thêm permission vào `Role.model.js` enum
- Restart server

**Lỗi: "MongoDB connection failed"**
- Kiểm tra `MONGODB_URI` trong file `.env`
- Đảm bảo MongoDB đang chạy

**Muốn xóa permission:**
- Hiện tại chưa có script tự động
- Xóa thủ công trong database hoặc qua MongoDB Compass
- Xóa khỏi `Role.model.js` enum
