// Service module Student: CRUD sinh viên + kiểm tra ràng buộc nghiệp vụ.
const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');

// include dùng chung để trả kèm thông tin liên kết cho frontend hiển thị
const includeQuanHe = {
  nganh: { select: { MaNganh: true, TenNganh: true } },
  xa: { select: { MaXa: true, TenXa: true } },
  doiTuong: { select: { MaDoiTuong: true, TenDoiTuong: true, TyLeMienGiam: true } },
};

// Kiểm tra các khóa ngoại tồn tại trước khi tạo/sửa (tránh lỗi P2003 khó hiểu)
async function kiemTraKhoaNgoai({ MaNganh, MaXa, MaDoiTuong }) {
  if (MaNganh) {
    const nganh = await prisma.nGANH.findUnique({ where: { MaNganh } });
    if (!nganh) throw new ApiError(404, `Ngành học "${MaNganh}" không tồn tại.`, 'NGANH_NOT_FOUND');
  }
  if (MaXa) {
    const xa = await prisma.xA.findUnique({ where: { MaXa } });
    if (!xa) throw new ApiError(404, `Xã "${MaXa}" không tồn tại.`, 'XA_NOT_FOUND');
  }
  if (MaDoiTuong) {
    const dt = await prisma.dOITUONGUUTIEN.findUnique({ where: { MaDoiTuong } });
    if (!dt) throw new ApiError(404, `Đối tượng ưu tiên "${MaDoiTuong}" không tồn tại.`, 'DOITUONG_NOT_FOUND');
  }
}

exports.list = async ({ search, maNganh, khoaHoc, page = 1, limit = 20 }) => {
  const where = { DaXoa: false };
  if (maNganh) where.MaNganh = maNganh;
  if (khoaHoc) where.KhoaHoc = khoaHoc;
  if (search) {
    where.OR = [
      { MaSoSinhVien: { contains: search } },
      { HoTen: { contains: search } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    prisma.sINHVIEN.findMany({
      where,
      include: includeQuanHe,
      skip,
      take: Number(limit),
      orderBy: { MaSoSinhVien: 'asc' },
    }),
    prisma.sINHVIEN.count({ where }),
  ]);

  return { items, total, page: Number(page), limit: Number(limit) };
};

exports.getOne = async (mssv) => {
  const sv = await prisma.sINHVIEN.findUnique({
    where: { MaSoSinhVien: mssv },
    include: includeQuanHe,
  });
  if (!sv) throw new ApiError(404, 'Không tìm thấy sinh viên.', 'NOT_FOUND');
  return sv;
};

exports.create = async (data) => {
  const daCo = await prisma.sINHVIEN.findUnique({ where: { MaSoSinhVien: data.MaSoSinhVien } });
  if (daCo) throw new ApiError(409, `MSSV "${data.MaSoSinhVien}" đã tồn tại.`, 'DUPLICATE_MSSV');
  await kiemTraKhoaNgoai(data);
  return prisma.sINHVIEN.create({
    data: {
      MaSoSinhVien: data.MaSoSinhVien,
      HoTen: data.HoTen,
      KhoaHoc: data.KhoaHoc || null,
      NgaySinh: data.NgaySinh ? new Date(data.NgaySinh) : null,
      GioiTinh: data.GioiTinh || null,
      SoDienThoai: data.SoDienThoai || null,
      Email: data.Email || null,
      MaXa: data.MaXa || null,
      MaNganh: data.MaNganh,
      MaDoiTuong: data.MaDoiTuong || null,
      TinhTrang: data.TinhTrang || 'Đang học',
    },
    include: includeQuanHe,
  });
};

exports.update = async (mssv, data) => {
  const sv = await prisma.sINHVIEN.findUnique({ where: { MaSoSinhVien: mssv } });
  if (!sv) throw new ApiError(404, 'Không tìm thấy sinh viên.', 'NOT_FOUND');
  await kiemTraKhoaNgoai(data);
  const dataUpd = {
    HoTen: data.HoTen,
    KhoaHoc: data.KhoaHoc || null,
    NgaySinh: data.NgaySinh ? new Date(data.NgaySinh) : null,
    GioiTinh: data.GioiTinh || null,
    SoDienThoai: data.SoDienThoai || null,
    Email: data.Email || null,
    MaXa: data.MaXa || null,
    MaNganh: data.MaNganh,
    MaDoiTuong: data.MaDoiTuong || null,
    TinhTrang: data.TinhTrang || 'Đang học',
  };
  if (data.MaSoSinhVien && data.MaSoSinhVien !== mssv) {
    const dup = await prisma.sINHVIEN.findUnique({ where: { MaSoSinhVien: data.MaSoSinhVien } });
    if (dup) throw new ApiError(409, `MSSV "${data.MaSoSinhVien}" đã tồn tại.`, 'DUPLICATE');
    dataUpd.MaSoSinhVien = data.MaSoSinhVien; // FK (nguoidung, phieudangky) tự cập nhật nhờ cascade
  }
  return prisma.sINHVIEN.update({ where: { MaSoSinhVien: mssv }, data: dataUpd, include: includeQuanHe });
};

exports.remove = async (mssv) => {
  const sv = await prisma.sINHVIEN.findUnique({
    where: { MaSoSinhVien: mssv },
    include: { phieuDangKyList: { select: { MaPhieu: true } }, nguoiDung: true },
  });
  if (!sv) throw new ApiError(404, 'Không tìm thấy sinh viên.', 'NOT_FOUND');

  // Chặn xóa nếu SV đã có phiếu đăng ký (giữ toàn vẹn dữ liệu tài chính)
  if (sv.phieuDangKyList.length > 0) {
    throw new ApiError(409, 'Không thể xóa: sinh viên đã có phiếu đăng ký học phần.', 'HAS_ENROLLMENT');
  }

  // Nếu SV có tài khoản đăng nhập -> xóa kèm trong transaction
  await prisma.$transaction(async (tx) => {
    if (sv.nguoiDung) {
      await tx.nGUOIDUNG.delete({ where: { TenDangNhap: sv.nguoiDung.TenDangNhap } });
    }
    await tx.sINHVIEN.update({ where: { MaSoSinhVien: mssv }, data: { DaXoa: true } });
  });

  return { message: 'Đã xóa sinh viên.' };
};
