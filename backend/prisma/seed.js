// Tạo dữ liệu mẫu để test ngay sau khi migrate.
// Chạy:  npm run prisma:seed   (hoặc tự động khi prisma migrate dev)
require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('../src/config/prisma');

async function main() {
  const hash = await bcrypt.hash('123456', 10);

  // 1. Tài khoản cho 3 vai trò cán bộ
  await prisma.nGUOIDUNG.upsert({
    where: { TenDangNhap: 'admin' },
    update: {},
    create: { TenDangNhap: 'admin', MatKhau: hash, VaiTro: 'ADMIN', HoTen: 'Quản trị viên' },
  });
  await prisma.nGUOIDUNG.upsert({
    where: { TenDangNhap: 'pdt' },
    update: {},
    create: { TenDangNhap: 'pdt', MatKhau: hash, VaiTro: 'PDT', HoTen: 'Phòng Đào tạo' },
  });
  await prisma.nGUOIDUNG.upsert({
    where: { TenDangNhap: 'ptc' },
    update: {},
    create: { TenDangNhap: 'ptc', MatKhau: hash, VaiTro: 'PTC', HoTen: 'Phòng Tài chính' },
  });

  // 2. Danh mục nền
  await prisma.tINH.upsert({ where: { MaTinh: 'HCM' }, update: {}, create: { MaTinh: 'HCM', TenTinh: 'TP. Hồ Chí Minh' } });
  await prisma.xA.upsert({ where: { MaXa: 'X001' }, update: {}, create: { MaXa: 'X001', MaTinh: 'HCM', TenXa: 'Phường Linh Trung' } });
  await prisma.dOITUONGUUTIEN.upsert({ where: { MaDoiTuong: 'KHONG' }, update: {}, create: { MaDoiTuong: 'KHONG', TenDoiTuong: 'Không ưu tiên', TyLeMienGiam: 0 } });
  const dsDoiTuong = [
    { MaDoiTuong: 'CONLIETSI',  TenDoiTuong: 'Con liệt sĩ',                 TyLeMienGiam: 100 },
    { MaDoiTuong: 'CONTHUONGBINH', TenDoiTuong: 'Con thương binh',          TyLeMienGiam: 70 },
    { MaDoiTuong: 'DANTOCTHIEUSO', TenDoiTuong: 'Dân tộc thiểu số',         TyLeMienGiam: 50 },
    { MaDoiTuong: 'VUNGSAU',    TenDoiTuong: 'Vùng sâu, vùng xa',           TyLeMienGiam: 30 },
    { MaDoiTuong: 'HONGHEO',    TenDoiTuong: 'Hộ nghèo',                    TyLeMienGiam: 50 },
    { MaDoiTuong: 'HOCANNGHEO', TenDoiTuong: 'Hộ cận nghèo',                TyLeMienGiam: 30 },
    { MaDoiTuong: 'MOCOI',      TenDoiTuong: 'Mồ côi cả cha lẫn mẹ',        TyLeMienGiam: 100 },
    { MaDoiTuong: 'KHUYETTAT',  TenDoiTuong: 'Khuyết tật',                  TyLeMienGiam: 50 },
    { MaDoiTuong: 'UT20',       TenDoiTuong: 'Diện ưu tiên 20%',            TyLeMienGiam: 20 },
    { MaDoiTuong: 'UT50',       TenDoiTuong: 'Diện ưu tiên 50%',            TyLeMienGiam: 50 },
    { MaDoiTuong: 'UT80',       TenDoiTuong: 'Diện ưu tiên 80%',            TyLeMienGiam: 80 },
  ];
  for (const dt of dsDoiTuong) {
    await prisma.dOITUONGUUTIEN.upsert({ where: { MaDoiTuong: dt.MaDoiTuong }, update: {}, create: dt });
  }
  await prisma.kHOA.upsert({ where: { MaKhoa: 'CNPM' }, update: {}, create: { MaKhoa: 'CNPM', TenKhoa: 'Công nghệ Phần mềm' } });
  await prisma.nGANH.upsert({ where: { MaNganh: 'KTPM' }, update: {}, create: { MaNganh: 'KTPM', TenNganh: 'Kỹ thuật Phần mềm', MaKhoa: 'CNPM' } });

  // 3. Loại môn (quy tắc tín chỉ + đơn giá)
  await prisma.lOAIMONHOC.upsert({ where: { MaLoaiMonHoc: 'LT' }, update: {}, create: { MaLoaiMonHoc: 'LT', TenLoaiMonHoc: 'Lý thuyết', SoTietMotTinChi: 15, SoTienMotTinChi: 400000 } });
  await prisma.lOAIMONHOC.upsert({ where: { MaLoaiMonHoc: 'TH' }, update: {}, create: { MaLoaiMonHoc: 'TH', TenLoaiMonHoc: 'Thực hành', SoTietMotTinChi: 30, SoTienMotTinChi: 600000 } });

  // 4. Học kỳ năm học mẫu (để test mở môn)
  await prisma.hOCKYNAMHOC.upsert({
    where: { MaHKNH: '2026-HK1' },
    update: {},
    create: {
      MaHKNH: '2026-HK1',
      HocKy: 'HK1',
      NgayBatDau: new Date('2026-09-01'),
      NgayKetThuc: new Date('2027-01-15'),
      HanDongHocPhi: new Date('2026-10-31'),
    },
  });

  // 5. Môn học mẫu: SE104 (Lý thuyết, 45 tiết -> 3 tín chỉ × 400.000 = 1.200.000đ)
  await prisma.mONHOC.upsert({
    where: { MaMonHoc: 'SE104' },
    update: {},
    create: { MaMonHoc: 'SE104', TenMonHoc: 'Nhập môn Công nghệ phần mềm', MaKhoa: 'CNPM', SoTiet: 45 },
  });

  // 6. Mở môn SE104 trong học kỳ 2026-HK1
  await prisma.mONHOCMO.upsert({
    where: { MaMonHocMo: 'SE104.O11' },
    update: {},
    create: { MaMonHocMo: 'SE104.O11', MaHKNH: '2026-HK1', MaMonHoc: 'SE104', MaLoaiMonHoc: 'LT', SiSoToiDa: 50, SiSoHienTai: 0 },
  });

  // 7. Một sinh viên mẫu + tài khoản đăng nhập (để test SV tự đăng ký)
  await prisma.sINHVIEN.upsert({
    where: { MaSoSinhVien: '23520001' },
    update: {},
    create: { MaSoSinhVien: '23520001', HoTen: 'Nguyễn Văn A', GioiTinh: 'Nam', MaNganh: 'KTPM', MaDoiTuong: 'KHONG', TinhTrang: 'Đang học' },
  });
  await prisma.nGUOIDUNG.upsert({
    where: { TenDangNhap: '23520001' },
    update: {},
    create: { TenDangNhap: '23520001', MatKhau: hash, VaiTro: 'SV', HoTen: 'Nguyễn Văn A', MaSoSinhVien: '23520001' },
  });

  // 8. Tham số hệ thống (QĐ13)
  await prisma.tHAMSO.upsert({ where: { TenThamSo: 'KIEM_TRA_MON_TRUOC' }, update: {}, create: { TenThamSo: 'KIEM_TRA_MON_TRUOC', GiaTri: 'false' } });
  await prisma.tHAMSO.upsert({ where: { TenThamSo: 'TY_LE_MIEN_GIAM_MIN' }, update: {}, create: { TenThamSo: 'TY_LE_MIEN_GIAM_MIN', GiaTri: '0' } });
  await prisma.tHAMSO.upsert({ where: { TenThamSo: 'TY_LE_MIEN_GIAM_MAX' }, update: {}, create: { TenThamSo: 'TY_LE_MIEN_GIAM_MAX', GiaTri: '100' } });

  // 9. Phân quyền (RBAC) — chức năng, nhóm vai trò, ma trận phân quyền mặc định.
  const dsChucNang = [
    { MaChucNang: 'QLND',      TenChucNang: 'Quản lý Tài khoản',         TenManHinhDuocLoad: 'admin.html' },
    { MaChucNang: 'THAMSO',    TenChucNang: 'Tham số Hệ thống',          TenManHinhDuocLoad: 'admin.html' },
    { MaChucNang: 'QL_SV',     TenChucNang: 'Quản lý Sinh viên',         TenManHinhDuocLoad: 'pdt_sv.html' },
    { MaChucNang: 'QL_MHOC',   TenChucNang: 'Quản lý Môn học',           TenManHinhDuocLoad: 'pdt_monhoc.html' },
    { MaChucNang: 'QL_NGANH',  TenChucNang: 'Quản lý Ngành học',         TenManHinhDuocLoad: 'pdt_nganhhoc.html' },
    { MaChucNang: 'QL_DIACHI', TenChucNang: 'Quản lý Địa chỉ (Tỉnh/Xã)', TenManHinhDuocLoad: 'pdt_diachi.html' },
    { MaChucNang: 'QL_KHOA',   TenChucNang: 'Quản lý Khoa',              TenManHinhDuocLoad: 'pdt_khoa.html' },
    { MaChucNang: 'DKHP',      TenChucNang: 'Đăng ký Học phần',          TenManHinhDuocLoad: 'pdt_dkhp.html' },
    { MaChucNang: 'THU_HP',    TenChucNang: 'Thu Học phí',               TenManHinhDuocLoad: 'ptc_hocphi.html' },
    { MaChucNang: 'MIEN_GIAM', TenChucNang: 'Quản lý Miễn giảm',         TenManHinhDuocLoad: 'ptc_miengiam.html' },
    { MaChucNang: 'BC_HP',     TenChucNang: 'Báo cáo Học phí',           TenManHinhDuocLoad: 'ptc.html' },
    { MaChucNang: 'XD_GIANH',  TenChucNang: 'Xét duyệt Gia hạn HP',      TenManHinhDuocLoad: 'pdt_yeucau.html' },
    { MaChucNang: 'SV_INFO',   TenChucNang: 'Xem thông tin SV',          TenManHinhDuocLoad: 'sv.html' },
    { MaChucNang: 'SV_HP',     TenChucNang: 'Xem Học phí cá nhân',       TenManHinhDuocLoad: 'sv_hocphi.html' },
    { MaChucNang: 'SV_LSDK',   TenChucNang: 'Lịch sử Đăng ký HP',        TenManHinhDuocLoad: 'sv_lsdk.html' },
    { MaChucNang: 'SV_LSGD',   TenChucNang: 'Lịch sử Giao dịch',         TenManHinhDuocLoad: 'sv_lsgd.html' },
  ];
  for (const cn of dsChucNang) {
    await prisma.cHUCNANG.upsert({ where: { MaChucNang: cn.MaChucNang }, update: {}, create: cn });
  }

  const dsNhom = [
    { MaNhom: 'ADMIN', TenNhom: 'Quản trị hệ thống' },
    { MaNhom: 'PDT',   TenNhom: 'Phòng Đào tạo' },
    { MaNhom: 'PTC',   TenNhom: 'Phòng Tài chính' },
    { MaNhom: 'SV',    TenNhom: 'Sinh viên' },
  ];
  for (const n of dsNhom) {
    await prisma.nHOMNGUOIDUNG.upsert({ where: { MaNhom: n.MaNhom }, update: {}, create: n });
  }

  const maTran = {
    ADMIN: ['QLND','THAMSO','QL_SV','QL_MHOC','QL_NGANH','QL_DIACHI','QL_KHOA','DKHP','THU_HP','MIEN_GIAM','BC_HP','XD_GIANH','SV_INFO','SV_HP','SV_LSDK','SV_LSGD'],
    PDT:   ['QL_SV','QL_MHOC','QL_NGANH','QL_DIACHI','QL_KHOA','DKHP','BC_HP','XD_GIANH'],
    PTC:   ['THU_HP','MIEN_GIAM','BC_HP','XD_GIANH'],
    SV:    ['SV_INFO','SV_HP','SV_LSDK','SV_LSGD'],
  };
  for (const [MaNhom, dsCN] of Object.entries(maTran)) {
    for (const MaChucNang of dsCN) {
      await prisma.bANGPHANQUYEN.upsert({
        where: { MaNhom_MaChucNang: { MaNhom, MaChucNang } },
        update: { Them: true, Sua: true, Xoa: true },
        create: { MaNhom, MaChucNang, Them: true, Sua: true, Xoa: true },
      });
    }
  }

  console.log('✅ Seed dữ liệu mẫu xong. Tài khoản cán bộ: admin / pdt / ptc — mật khẩu: 123456');
  console.log('   Tài khoản sinh viên test: 23520001 — mật khẩu: 123456');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
