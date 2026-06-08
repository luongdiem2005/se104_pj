-- ============================================================================
--  Migration vá lỗi + nâng cấp phân quyền chi tiết
--  1) Nới rộng cột MaDoiTuong: các migration init đang để VARCHAR(10) trong khi
--     seed có mã dài 13 ký tự (vd: 'CONTHUONGBINH', 'DANTOCTHIEUSO') -> seed
--     crash giữa chừng nên SINHVIEN / MONHOCMO... không được tạo -> trang
--     Sinh viên trống. Đưa về VARCHAR(50) đúng như schema.prisma.
--  2) Thêm 3 cột quyền chi tiết (Them / Sua / Xoa) vào BANGPHANQUYEN để cấp
--     quyền Thêm - Xóa - Sửa theo từng (nhóm vai trò × chức năng).
-- ============================================================================

-- 1) MaDoiTuong: phải bỏ FK trước khi đổi kiểu cột khóa chính & cột tham chiếu.
ALTER TABLE `SINHVIEN` DROP FOREIGN KEY `SINHVIEN_MaDoiTuong_fkey`;
ALTER TABLE `DOITUONGUUTIEN` MODIFY `MaDoiTuong` VARCHAR(50) NOT NULL;
ALTER TABLE `SINHVIEN` MODIFY `MaDoiTuong` VARCHAR(50) NULL;
ALTER TABLE `SINHVIEN`
  ADD CONSTRAINT `SINHVIEN_MaDoiTuong_fkey`
  FOREIGN KEY (`MaDoiTuong`) REFERENCES `DOITUONGUUTIEN`(`MaDoiTuong`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- 2) Quyền chi tiết Thêm / Sửa / Xóa cho bảng phân quyền.
ALTER TABLE `bangphanquyen`
  ADD COLUMN `Them` BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN `Sua`  BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN `Xoa`  BOOLEAN NOT NULL DEFAULT false;

-- Các quyền đã cấp sẵn trước đây: bật đủ Thêm/Sửa/Xóa để khớp hành vi cũ.
UPDATE `bangphanquyen` SET `Them` = true, `Sua` = true, `Xoa` = true;
