import User from "../models/User.model.js";
import Transaction from "../models/Transaction.model.js";
import ExcelJS from "exceljs";

export const exportUsers = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { isDeleted: { $ne: true } };

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const users = await User.find(filter)
      .populate("parentId", "username email")
      .populate("assignedPackageId", "name")
      .sort({ createdAt: -1 });

    const userIds = users.map((u) => u._id);
    const purchasedPackages = await Transaction.find({
      userId: { $in: userIds },
      type: "payment",
      status: "completed",
    })
      .populate("packageId", "name")
      .select("userId packageId packageInfo");

    const packageMap = {};
    purchasedPackages.forEach((tx) => {
      // Use packageInfo name if available, otherwise use populated packageId name
      if (tx.packageInfo && tx.packageInfo.name) {
        packageMap[tx.userId.toString()] = tx.packageInfo.name;
      } else if (tx.packageId && tx.packageId.name) {
        packageMap[tx.userId.toString()] = tx.packageId.name;
      }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    // Add Title
    worksheet.mergeCells("A1:O1");
    worksheet.getCell("A1").value = `DANH SÁCH NGƯỜI DÙNG ${startDate ? `TỪ ${startDate}` : ""} ${endDate ? `ĐẾN ${endDate}` : ""}`;
    worksheet.getCell("A1").font = { size: 16, bold: true };
    worksheet.getCell("A1").alignment = { horizontal: "center" };

    // Add Headers
    worksheet.getRow(3).values = [
      "ID",
      "Email",
      "Tên đăng nhập",
      "Mã giới thiệu",
      "Người giới thiệu (Email)",
      "Số dư (USDT)",
      "Tổng thu nhập (USDT)",
      "Số F1",
      "Gói đã mua",
      "Địa chỉ ví",
      "Họ tên",
      "Số điện thoại",
      "Số CCCD",
      "Trạng thái",
      "Ngày tham gia",
    ];

    worksheet.getRow(3).font = { bold: true };

    // Add Data
    users.forEach((user, index) => {
      // Check transaction map first, then fallback to assignedPackageId on User model
      const packageName = packageMap[user._id.toString()] || 
                         (user.assignedPackageId ? user.assignedPackageId.name : "Chưa mua");

      worksheet.addRow([
        user._id.toString(),
        user.email,
        user.username,
        user.refCode,
        user.parentId ? user.parentId.email : "N/A",
        user.walletBalance || 0,
        user.totalEarnings || 0,
        user.directReferrals || 0,
        packageName,
        user.walletAddress,
        user.fullName,
        user.phoneNumber,
        user.identityNumber,
        user.isEmailVerified ? "Đã xác minh" : "Chưa xác minh",
        user.createdAt.toLocaleString("vi-VN"),
      ]);
    });

    // Formatting
    worksheet.columns.forEach((column) => {
      column.width = 20;
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Users_Export_${new Date().toISOString().split("T")[0]}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export users error:", error);
    res.status(500).json({ success: false, message: "Lỗi xuất dữ liệu người dùng" });
  }
};

export const exportTransactions = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const transactions = await Transaction.find(filter)
      .populate("userId", "email username")
      .populate("packageId", "name")
      .sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Transactions");

    // Add Title
    worksheet.mergeCells("A1:M1");
    worksheet.getCell("A1").value = `DANH SÁCH GIAO DỊCH ${startDate ? `TỪ ${startDate}` : ""} ${endDate ? `ĐẾN ${endDate}` : ""}`;
    worksheet.getCell("A1").font = { size: 16, bold: true };
    worksheet.getCell("A1").alignment = { horizontal: "center" };

    // Add Headers
    worksheet.getRow(3).values = [
      "ID",
      "Người dùng (Email)",
      "Tên đăng nhập",
      "Loại giao dịch",
      "Gói",
      "Số tiền",
      "Đơn vị",
      "Trạng thái",
      "Hash giao dịch",
      "Từ địa chỉ",
      "Đến địa chỉ",
      "Mô tả",
      "Ngày tạo",
    ];

    worksheet.getRow(3).font = { bold: true };

    const typeMap = {
      payment: "Thanh toán",
      commission: "Hoa hồng",
      withdrawal: "Rút tiền",
      refund: "Hoàn tiền",
    };

    const statusMap = {
      pending: "Đang chờ",
      completed: "Hoàn thành",
      failed: "Thất bại",
      cancelled: "Đã hủy",
    };

    // Add Data
    transactions.forEach((tx) => {
      worksheet.addRow([
        tx._id.toString(),
        tx.userId ? tx.userId.email : "N/A",
        tx.userId ? tx.userId.username : "N/A",
        typeMap[tx.type] || tx.type,
        tx.packageInfo?.name || tx.packageId?.name || "N/A",
        tx.amount,
        tx.currency,
        statusMap[tx.status] || tx.status,
        tx.transactionHash || "N/A",
        tx.fromAddress || "N/A",
        tx.toAddress || "N/A",
        tx.description || "",
        tx.createdAt.toLocaleString("vi-VN"),
      ]);
    });

    // Formatting
    worksheet.columns.forEach((column) => {
      column.width = 20;
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Transactions_Export_${new Date().toISOString().split("T")[0]}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export transactions error:", error);
    res.status(500).json({ success: false, message: "Lỗi xuất dữ liệu giao dịch" });
  }
};
