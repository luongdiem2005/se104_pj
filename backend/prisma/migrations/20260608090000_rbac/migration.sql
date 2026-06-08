-- ============================================================================
--  RBAC: Phân quyền theo nhóm người dùng (đồng bộ với tài liệu thiết kế)
--  - CHUCNANG       : danh mục chức năng / màn hình
--  - NHOMNGUOIDUNG  : nhóm vai trò (MaNhom trùng giá trị VaiTro: ADMIN/PDT/PTC/SV)
--  - BANGPHANQUYEN  : ma trận nhóm × chức năng
-- ============================================================================

-- CreateTable
CREATE TABLE `chucnang` (
    `MaChucNang` VARCHAR(30) NOT NULL,
    `TenChucNang` VARCHAR(150) NOT NULL,
    `TenManHinhDuocLoad` VARCHAR(100) NULL,

    PRIMARY KEY (`MaChucNang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nhomnguoidung` (
    `MaNhom` VARCHAR(20) NOT NULL,
    `TenNhom` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`MaNhom`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bangphanquyen` (
    `MaNhom` VARCHAR(20) NOT NULL,
    `MaChucNang` VARCHAR(30) NOT NULL,

    INDEX `BANGPHANQUYEN_MaChucNang_fkey`(`MaChucNang`),
    PRIMARY KEY (`MaNhom`, `MaChucNang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bangphanquyen` ADD CONSTRAINT `BANGPHANQUYEN_MaNhom_fkey` FOREIGN KEY (`MaNhom`) REFERENCES `nhomnguoidung`(`MaNhom`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bangphanquyen` ADD CONSTRAINT `BANGPHANQUYEN_MaChucNang_fkey` FOREIGN KEY (`MaChucNang`) REFERENCES `chucnang`(`MaChucNang`) ON DELETE CASCADE ON UPDATE CASCADE;
