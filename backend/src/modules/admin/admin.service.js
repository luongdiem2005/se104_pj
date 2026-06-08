// Service module Admin: quản lý tài khoản (NGUOIDUNG) và tham số hệ thống (THAMSO).
const bcrypt = require('bcryptjs');
const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');

function boMatKhau(u) {
  if (!u) return u;
  const { MatKhau, ...rest } = u;
  return rest;
}

// ---------------- TÀI KHOẢN ----------------
const accounts = {
  list: async ({ search, vaiTro }) => {
    const where = {};
    if (vaiTro) where.VaiTro = vaiTro;
    if (search) where.OR = [{ TenDangNhap: { contains: search } }, { HoTen: { contains: search } }];
    const rows = await prisma.nGUOIDUNG.findMany({ where, orderBy: { TenDangNhap: 'asc' } });
    return rows.map(boMatKhau);
  },

  getOne: async (ten) => {
    const u = await prisma.nGUOIDUNG.findUnique({ where: { TenDangNhap: ten } });
    if (!u) throw new ApiError(404, 'Không tìm thấy tài khoản.', 'NOT_FOUND');
    return boMatKhau(u);
  },

  create: async (data) => {
    const existed = await prisma.nGUOIDUNG.findUnique({ where: { TenDangNhap: data.TenDangNhap } });
    if (existed) throw new ApiError(409, `Tên đăng nhập "${data.TenDangNhap}" đã tồn tại.`, 'DUPLICATE');

    let maSV = null;
    if (data.VaiTro === 'SV') {
      if (!data.MaSoSinhVien) throw new ApiError(400, 'Tài khoản SV phải gắn MaSoSinhVien.', 'VALIDATION');
      const sv = await prisma.sINHVIEN.findUnique({ where: { MaSoSinhVien: data.MaSoSinhVien } });
      if (!sv) throw new ApiError(404, `Sinh viên "${data.MaSoSinhVien}" không tồn tại.`, 'SV_NOT_FOUND');
      const linked = await prisma.nGUOIDUNG.findUnique({ where: { MaSoSinhVien: data.MaSoSinhVien } });
      if (linked) throw new ApiError(409, 'Sinh viên này đã có tài khoản.', 'SV_LINKED');
      maSV = data.MaSoSinhVien;
    }

    const hash = await bcrypt.hash(data.MatKhau, 10);
    const created = await prisma.nGUOIDUNG.create({
      data: {
        TenDangNhap: data.TenDangNhap,
        MatKhau: hash,
        VaiTro: data.VaiTro,
        HoTen: data.HoTen || null,
        MaSoSinhVien: maSV,
        TrangThai: data.TrangThai === undefined ? true : !!data.TrangThai,
      },
    });
    return boMatKhau(created);
  },

  update: async (ten, data) => {
    const u = await prisma.nGUOIDUNG.findUnique({ where: { TenDangNhap: ten } });
    if (!u) throw new ApiError(404, 'Không tìm thấy tài khoản.', 'NOT_FOUND');

    const patch = {};
    if (data.HoTen !== undefined) patch.HoTen = data.HoTen || null;
    if (data.VaiTro !== undefined) patch.VaiTro = data.VaiTro;
    if (data.TrangThai !== undefined) patch.TrangThai = !!data.TrangThai;
    if (data.MatKhauMoi) {
      if (String(data.MatKhauMoi).length < 6) throw new ApiError(400, 'Mật khẩu mới phải có ít nhất 6 ký tự.', 'VALIDATION');
      patch.MatKhau = await bcrypt.hash(data.MatKhauMoi, 10);
    }

    const updated = await prisma.nGUOIDUNG.update({ where: { TenDangNhap: ten }, data: patch });
    return boMatKhau(updated);
  },

  remove: async (ten, currentUser) => {
    if (ten === currentUser.TenDangNhap) {
      throw new ApiError(409, 'Không thể xóa tài khoản đang đăng nhập.', 'SELF_DELETE');
    }
    const u = await prisma.nGUOIDUNG.findUnique({ where: { TenDangNhap: ten } });
    if (!u) throw new ApiError(404, 'Không tìm thấy tài khoản.', 'NOT_FOUND');
    await prisma.nGUOIDUNG.delete({ where: { TenDangNhap: ten } });
    return { message: 'Đã xóa tài khoản.' };
  },
};

// ---------------- THAM SỐ HỆ THỐNG ----------------
const params = {
  list: () => prisma.tHAMSO.findMany({ orderBy: { TenThamSo: 'asc' } }),

  set: async (ten, giaTri) => {
    if (giaTri === undefined || giaTri === null) {
      throw new ApiError(400, 'Thiếu GiaTri.', 'VALIDATION');
    }
    return prisma.tHAMSO.upsert({
      where: { TenThamSo: ten },
      update: { GiaTri: String(giaTri) },
      create: { TenThamSo: ten, GiaTri: String(giaTri) },
    });
  },

  remove: async (ten) => {
    const t = await prisma.tHAMSO.findUnique({ where: { TenThamSo: ten } });
    if (!t) throw new ApiError(404, 'Không tìm thấy tham số.', 'NOT_FOUND');
    await prisma.tHAMSO.delete({ where: { TenThamSo: ten } });
    return { message: 'Đã xóa tham số.' };
  },
};

// ---------------- PHÂN QUYỀN (RBAC) ----------------
// Mô hình: CHUCNANG (chức năng/màn hình) × NHOMNGUOIDUNG (nhóm vai trò) -> BANGPHANQUYEN.
// MaNhom dùng đúng giá trị VaiTro (ADMIN/PDT/PTC/SV) nên khớp với cơ chế đăng nhập hiện có.
const rbac = {
  // Lấy toàn bộ dữ liệu RBAC trong 1 lần gọi (tiện cho frontend dựng ma trận).
  getAll: async () => {
    const [chucNang, nhom, phanQuyen] = await Promise.all([
      prisma.cHUCNANG.findMany({ orderBy: { MaChucNang: 'asc' } }),
      prisma.nHOMNGUOIDUNG.findMany({ orderBy: { MaNhom: 'asc' } }),
      prisma.bANGPHANQUYEN.findMany(),
    ]);
    return { chucNang, nhom, phanQuyen };
  },

  // --- Chức năng ---
  addChucNang: async (data) => {
    const ma = String(data.MaChucNang || '').trim().toUpperCase();
    const ten = String(data.TenChucNang || '').trim();
    if (!ma || !ten) throw new ApiError(400, 'Thiếu Mã hoặc Tên chức năng.', 'VALIDATION');
    const existed = await prisma.cHUCNANG.findUnique({ where: { MaChucNang: ma } });
    if (existed) throw new ApiError(409, `Mã chức năng "${ma}" đã tồn tại.`, 'DUPLICATE');
    return prisma.cHUCNANG.create({
      data: { MaChucNang: ma, TenChucNang: ten, TenManHinhDuocLoad: data.TenManHinhDuocLoad || null },
    });
  },
  removeChucNang: async (ma) => {
    const cn = await prisma.cHUCNANG.findUnique({ where: { MaChucNang: ma } });
    if (!cn) throw new ApiError(404, 'Không tìm thấy chức năng.', 'NOT_FOUND');
    // Xoá chức năng -> các dòng phân quyền liên quan tự xoá theo (ON DELETE CASCADE).
    await prisma.cHUCNANG.delete({ where: { MaChucNang: ma } });
    return { message: 'Đã xoá chức năng.' };
  },

  // --- Nhóm người dùng ---
  addNhom: async (data) => {
    const ma = String(data.MaNhom || '').trim().toUpperCase();
    const ten = String(data.TenNhom || '').trim();
    if (!ma || !ten) throw new ApiError(400, 'Thiếu Mã hoặc Tên nhóm.', 'VALIDATION');
    const existed = await prisma.nHOMNGUOIDUNG.findUnique({ where: { MaNhom: ma } });
    if (existed) throw new ApiError(409, `Mã nhóm "${ma}" đã tồn tại.`, 'DUPLICATE');
    return prisma.nHOMNGUOIDUNG.create({ data: { MaNhom: ma, TenNhom: ten } });
  },
  removeNhom: async (ma) => {
    const n = await prisma.nHOMNGUOIDUNG.findUnique({ where: { MaNhom: ma } });
    if (!n) throw new ApiError(404, 'Không tìm thấy nhóm.', 'NOT_FOUND');
    await prisma.nHOMNGUOIDUNG.delete({ where: { MaNhom: ma } });
    return { message: 'Đã xoá nhóm.' };
  },

  // --- Cấp / cập nhật / thu hồi quyền (kèm 3 cờ chi tiết Thêm/Sửa/Xóa) ---
  // Quy ước: 1 dòng BANGPHANQUYEN nghĩa là nhóm được dùng chức năng đó;
  // 3 cờ Them/Sua/Xoa là quyền chi tiết. Nếu cả 3 cờ đều false -> xoá dòng
  // (nhóm không còn quyền với chức năng này nữa).
  setQuyen: async (MaNhom, MaChucNang, quyen = {}) => {
    if (!MaNhom || !MaChucNang) throw new ApiError(400, 'Thiếu MaNhom hoặc MaChucNang.', 'VALIDATION');
    const [n, cn] = await Promise.all([
      prisma.nHOMNGUOIDUNG.findUnique({ where: { MaNhom } }),
      prisma.cHUCNANG.findUnique({ where: { MaChucNang } }),
    ]);
    if (!n) throw new ApiError(404, `Nhóm "${MaNhom}" không tồn tại.`, 'NOT_FOUND');
    if (!cn) throw new ApiError(404, `Chức năng "${MaChucNang}" không tồn tại.`, 'NOT_FOUND');

    const Them = !!quyen.Them;
    const Sua = !!quyen.Sua;
    const Xoa = !!quyen.Xoa;

    // Bỏ tick cả 3 -> thu hồi hẳn quyền của chức năng này.
    if (!Them && !Sua && !Xoa) {
      const existed = await prisma.bANGPHANQUYEN.findUnique({
        where: { MaNhom_MaChucNang: { MaNhom, MaChucNang } },
      });
      if (existed) await prisma.bANGPHANQUYEN.delete({ where: { MaNhom_MaChucNang: { MaNhom, MaChucNang } } });
      return { MaNhom, MaChucNang, Them: false, Sua: false, Xoa: false, removed: true };
    }

    return prisma.bANGPHANQUYEN.upsert({
      where: { MaNhom_MaChucNang: { MaNhom, MaChucNang } },
      update: { Them, Sua, Xoa },
      create: { MaNhom, MaChucNang, Them, Sua, Xoa },
    });
  },
  revoke: async (MaNhom, MaChucNang) => {
    const pq = await prisma.bANGPHANQUYEN.findUnique({
      where: { MaNhom_MaChucNang: { MaNhom, MaChucNang } },
    });
    if (!pq) throw new ApiError(404, 'Không tìm thấy dòng phân quyền.', 'NOT_FOUND');
    await prisma.bANGPHANQUYEN.delete({ where: { MaNhom_MaChucNang: { MaNhom, MaChucNang } } });
    return { message: 'Đã thu hồi quyền.' };
  },
};

// Giữ tên cũ "grant" như alias để không vỡ chỗ gọi khác (nếu có).
rbac.grant = (MaNhom, MaChucNang, quyen) => rbac.setQuyen(MaNhom, MaChucNang, quyen);

module.exports = { accounts, params, rbac };
