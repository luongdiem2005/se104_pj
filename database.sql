-- MySQL dump 10.13  Distrib 8.4.9, for Win64 (x86_64)
--
-- Host: localhost    Database: qlsv
-- ------------------------------------------------------
-- Server version	8.4.9

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bangphanquyen`
--

DROP TABLE IF EXISTS `bangphanquyen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bangphanquyen` (
  `MaNhom` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaChucNang` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Them` tinyint(1) NOT NULL DEFAULT '0',
  `Sua` tinyint(1) NOT NULL DEFAULT '0',
  `Xoa` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`MaNhom`,`MaChucNang`),
  KEY `BANGPHANQUYEN_MaChucNang_fkey` (`MaChucNang`),
  CONSTRAINT `BANGPHANQUYEN_MaChucNang_fkey` FOREIGN KEY (`MaChucNang`) REFERENCES `chucnang` (`MaChucNang`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `BANGPHANQUYEN_MaNhom_fkey` FOREIGN KEY (`MaNhom`) REFERENCES `nhomnguoidung` (`MaNhom`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bangphanquyen`
--

LOCK TABLES `bangphanquyen` WRITE;
/*!40000 ALTER TABLE `bangphanquyen` DISABLE KEYS */;
INSERT INTO `bangphanquyen` VALUES ('ADMIN','BC_HP',1,1,1),('ADMIN','DKHP',1,1,1),('ADMIN','MIEN_GIAM',1,1,1),('ADMIN','QL_DIACHI',1,1,1),('ADMIN','QL_KHOA',1,1,1),('ADMIN','QL_MHOC',1,1,1),('ADMIN','QL_NGANH',1,1,1),('ADMIN','QL_SV',1,1,1),('ADMIN','QLND',1,1,1),('ADMIN','SV_HP',1,1,1),('ADMIN','SV_INFO',1,1,1),('ADMIN','SV_LSDK',1,1,1),('ADMIN','SV_LSGD',1,1,1),('ADMIN','THAMSO',1,1,1),('ADMIN','THU_HP',1,1,1),('ADMIN','XD_GIANH',1,1,1),('PDT','BC_HP',1,1,1),('PDT','DKHP',1,1,1),('PDT','QL_DIACHI',1,1,1),('PDT','QL_KHOA',1,1,1),('PDT','QL_MHOC',1,1,1),('PDT','QL_NGANH',1,1,1),('PDT','QL_SV',1,1,1),('PDT','XD_GIANH',1,1,1),('PTC','BC_HP',1,1,1),('PTC','MIEN_GIAM',1,1,1),('PTC','THU_HP',1,1,1),('PTC','XD_GIANH',1,1,1),('SV','SV_HP',1,1,1),('SV','SV_INFO',1,1,1),('SV','SV_LSDK',1,1,1),('SV','SV_LSGD',1,1,1);
/*!40000 ALTER TABLE `bangphanquyen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chucnang`
--

DROP TABLE IF EXISTS `chucnang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chucnang` (
  `MaChucNang` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TenChucNang` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TenManHinhDuocLoad` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MaChucNang`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chucnang`
--

LOCK TABLES `chucnang` WRITE;
/*!40000 ALTER TABLE `chucnang` DISABLE KEYS */;
INSERT INTO `chucnang` VALUES ('BC_HP','Báo cáo Học phí','ptc.html'),('DKHP','Đăng ký Học phần','pdt_dkhp.html'),('MIEN_GIAM','Quản lý Miễn giảm','ptc_miengiam.html'),('QL_DIACHI','Quản lý Địa chỉ (Tỉnh/Xã)','pdt_diachi.html'),('QL_KHOA','Quản lý Khoa','pdt_khoa.html'),('QL_MHOC','Quản lý Môn học','pdt_monhoc.html'),('QL_NGANH','Quản lý Ngành học','pdt_nganhhoc.html'),('QL_SV','Quản lý Sinh viên','pdt_sv.html'),('QLND','Quản lý Tài khoản','admin.html'),('SV_HP','Xem Học phí cá nhân','sv_hocphi.html'),('SV_INFO','Xem thông tin SV','sv.html'),('SV_LSDK','Lịch sử Đăng ký HP','sv_lsdk.html'),('SV_LSGD','Lịch sử Giao dịch','sv_lsgd.html'),('THAMSO','Tham số Hệ thống','admin.html'),('THU_HP','Thu Học phí','ptc_hocphi.html'),('XD_GIANH','Xét duyệt Gia hạn HP','pdt_yeucau.html');
/*!40000 ALTER TABLE `chucnang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chuongtrinhhoc`
--

DROP TABLE IF EXISTS `chuongtrinhhoc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chuongtrinhhoc` (
  `MaNganh` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaMonHoc` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `HocKy` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `KhoaApDung` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `GhiChu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MaNganh`,`MaMonHoc`),
  KEY `CHUONGTRINHHOC_MaMonHoc_fkey` (`MaMonHoc`),
  CONSTRAINT `CHUONGTRINHHOC_MaMonHoc_fkey` FOREIGN KEY (`MaMonHoc`) REFERENCES `monhoc` (`MaMonHoc`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `CHUONGTRINHHOC_MaNganh_fkey` FOREIGN KEY (`MaNganh`) REFERENCES `nganh` (`MaNganh`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chuongtrinhhoc`
--

LOCK TABLES `chuongtrinhhoc` WRITE;
/*!40000 ALTER TABLE `chuongtrinhhoc` DISABLE KEYS */;
/*!40000 ALTER TABLE `chuongtrinhhoc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ct_monhoctruoc`
--

DROP TABLE IF EXISTS `ct_monhoctruoc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ct_monhoctruoc` (
  `MaMonHoc` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaMonHocTruoc` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`MaMonHoc`,`MaMonHocTruoc`),
  KEY `CT_MONHOCTRUOC_MaMonHocTruoc_fkey` (`MaMonHocTruoc`),
  CONSTRAINT `CT_MONHOCTRUOC_MaMonHoc_fkey` FOREIGN KEY (`MaMonHoc`) REFERENCES `monhoc` (`MaMonHoc`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `CT_MONHOCTRUOC_MaMonHocTruoc_fkey` FOREIGN KEY (`MaMonHocTruoc`) REFERENCES `monhoc` (`MaMonHoc`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ct_monhoctruoc`
--

LOCK TABLES `ct_monhoctruoc` WRITE;
/*!40000 ALTER TABLE `ct_monhoctruoc` DISABLE KEYS */;
/*!40000 ALTER TABLE `ct_monhoctruoc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ct_phieudk`
--

DROP TABLE IF EXISTS `ct_phieudk`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ct_phieudk` (
  `MaPhieuDK` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaMonHoc` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`MaPhieuDK`,`MaMonHoc`),
  KEY `CT_PHIEUDK_MaMonHoc_fkey` (`MaMonHoc`),
  CONSTRAINT `CT_PHIEUDK_MaMonHoc_fkey` FOREIGN KEY (`MaMonHoc`) REFERENCES `monhoc` (`MaMonHoc`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `CT_PHIEUDK_MaPhieuDK_fkey` FOREIGN KEY (`MaPhieuDK`) REFERENCES `phieudangky` (`MaPhieu`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ct_phieudk`
--

LOCK TABLES `ct_phieudk` WRITE;
/*!40000 ALTER TABLE `ct_phieudk` DISABLE KEYS */;
/*!40000 ALTER TABLE `ct_phieudk` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doituonguutien`
--

DROP TABLE IF EXISTS `doituonguutien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doituonguutien` (
  `MaDoiTuong` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DaXoa` tinyint(1) NOT NULL DEFAULT '0',
  `TenDoiTuong` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TyLeMienGiam` decimal(5,2) NOT NULL,
  `GhiChu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MaDoiTuong`),
  UNIQUE KEY `DOITUONGUUTIEN_TenDoiTuong_key` (`TenDoiTuong`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doituonguutien`
--

LOCK TABLES `doituonguutien` WRITE;
/*!40000 ALTER TABLE `doituonguutien` DISABLE KEYS */;
INSERT INTO `doituonguutien` VALUES ('CONLIETSI',0,'Con liệt sĩ',100.00,NULL),('CONTHUONGBINH',0,'Con thương binh',70.00,NULL),('DANTOCTHIEUSO',0,'Dân tộc thiểu số',50.00,NULL),('HOCANNGHEO',0,'Hộ cận nghèo',30.00,NULL),('HONGHEO',0,'Hộ nghèo',50.00,NULL),('KHONG',0,'Không ưu tiên',0.00,NULL),('KHUYETTAT',0,'Khuyết tật',50.00,NULL),('MOCOI',0,'Mồ côi cả cha lẫn mẹ',100.00,NULL),('UT20',0,'Diện ưu tiên 20%',20.00,NULL),('UT50',0,'Diện ưu tiên 50%',50.00,NULL),('UT80',0,'Diện ưu tiên 80%',80.00,NULL),('VUNGSAU',0,'Vùng sâu, vùng xa',30.00,NULL);
/*!40000 ALTER TABLE `doituonguutien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donyeucau`
--

DROP TABLE IF EXISTS `donyeucau`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donyeucau` (
  `MaDon` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaSoSinhVien` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Loai` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `LyDo` text COLLATE utf8mb4_unicode_ci,
  `NgayTao` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `TrangThai` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CHO_DUYET',
  `GhiChuXuLy` text COLLATE utf8mb4_unicode_ci,
  `NgayXuLy` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`MaDon`),
  KEY `DONYEUCAU_MaSoSinhVien_fkey` (`MaSoSinhVien`),
  CONSTRAINT `DONYEUCAU_MaSoSinhVien_fkey` FOREIGN KEY (`MaSoSinhVien`) REFERENCES `sinhvien` (`MaSoSinhVien`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donyeucau`
--

LOCK TABLES `donyeucau` WRITE;
/*!40000 ALTER TABLE `donyeucau` DISABLE KEYS */;
/*!40000 ALTER TABLE `donyeucau` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hockynamhoc`
--

DROP TABLE IF EXISTS `hockynamhoc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hockynamhoc` (
  `MaHKNH` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `HocKy` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `NgayBatDau` datetime(3) NOT NULL,
  `NgayKetThuc` datetime(3) NOT NULL,
  `HanDongHocPhi` datetime(3) NOT NULL,
  PRIMARY KEY (`MaHKNH`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hockynamhoc`
--

LOCK TABLES `hockynamhoc` WRITE;
/*!40000 ALTER TABLE `hockynamhoc` DISABLE KEYS */;
INSERT INTO `hockynamhoc` VALUES ('2026-HK1','HK1','2026-09-01 00:00:00.000','2027-01-15 00:00:00.000','2026-10-31 00:00:00.000');
/*!40000 ALTER TABLE `hockynamhoc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `khoa`
--

DROP TABLE IF EXISTS `khoa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `khoa` (
  `MaKhoa` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DaXoa` tinyint(1) NOT NULL DEFAULT '0',
  `TenKhoa` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `VanPhongKhoa` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `GhiChu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MaKhoa`),
  UNIQUE KEY `KHOA_TenKhoa_key` (`TenKhoa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khoa`
--

LOCK TABLES `khoa` WRITE;
/*!40000 ALTER TABLE `khoa` DISABLE KEYS */;
INSERT INTO `khoa` VALUES ('CNPM',0,'Công nghệ Phần mềm',NULL,NULL);
/*!40000 ALTER TABLE `khoa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loaimonhoc`
--

DROP TABLE IF EXISTS `loaimonhoc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loaimonhoc` (
  `MaLoaiMonHoc` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DaXoa` tinyint(1) NOT NULL DEFAULT '0',
  `TenLoaiMonHoc` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SoTietMotTinChi` int NOT NULL,
  `SoTienMotTinChi` decimal(12,2) NOT NULL,
  PRIMARY KEY (`MaLoaiMonHoc`),
  UNIQUE KEY `LOAIMONHOC_TenLoaiMonHoc_key` (`TenLoaiMonHoc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loaimonhoc`
--

LOCK TABLES `loaimonhoc` WRITE;
/*!40000 ALTER TABLE `loaimonhoc` DISABLE KEYS */;
INSERT INTO `loaimonhoc` VALUES ('LT',0,'Lý thuyết',15,400000.00),('TH',0,'Thực hành',30,600000.00);
/*!40000 ALTER TABLE `loaimonhoc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `monhoc`
--

DROP TABLE IF EXISTS `monhoc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monhoc` (
  `MaMonHoc` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DaXoa` tinyint(1) NOT NULL DEFAULT '0',
  `TenMonHoc` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaKhoa` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SoTiet` int NOT NULL,
  PRIMARY KEY (`MaMonHoc`),
  UNIQUE KEY `MONHOC_TenMonHoc_key` (`TenMonHoc`),
  KEY `MONHOC_MaKhoa_fkey` (`MaKhoa`),
  CONSTRAINT `MONHOC_MaKhoa_fkey` FOREIGN KEY (`MaKhoa`) REFERENCES `khoa` (`MaKhoa`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monhoc`
--

LOCK TABLES `monhoc` WRITE;
/*!40000 ALTER TABLE `monhoc` DISABLE KEYS */;
INSERT INTO `monhoc` VALUES ('SE104',0,'Nhập môn Công nghệ phần mềm','CNPM',45);
/*!40000 ALTER TABLE `monhoc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `monhocmo`
--

DROP TABLE IF EXISTS `monhocmo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monhocmo` (
  `MaMonHocMo` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DaXoa` tinyint(1) NOT NULL DEFAULT '0',
  `MaHKNH` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaMonHoc` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaLoaiMonHoc` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SiSoToiDa` int NOT NULL DEFAULT '50',
  `SiSoHienTai` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`MaMonHocMo`),
  KEY `MONHOCMO_MaMonHoc_fkey` (`MaMonHoc`),
  KEY `MONHOCMO_MaLoaiMonHoc_fkey` (`MaLoaiMonHoc`),
  KEY `MONHOCMO_MaHKNH_fkey` (`MaHKNH`),
  CONSTRAINT `MONHOCMO_MaHKNH_fkey` FOREIGN KEY (`MaHKNH`) REFERENCES `hockynamhoc` (`MaHKNH`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `MONHOCMO_MaLoaiMonHoc_fkey` FOREIGN KEY (`MaLoaiMonHoc`) REFERENCES `loaimonhoc` (`MaLoaiMonHoc`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `MONHOCMO_MaMonHoc_fkey` FOREIGN KEY (`MaMonHoc`) REFERENCES `monhoc` (`MaMonHoc`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monhocmo`
--

LOCK TABLES `monhocmo` WRITE;
/*!40000 ALTER TABLE `monhocmo` DISABLE KEYS */;
INSERT INTO `monhocmo` VALUES ('SE104.O11',0,'2026-HK1','SE104','LT',50,0);
/*!40000 ALTER TABLE `monhocmo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nganh`
--

DROP TABLE IF EXISTS `nganh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nganh` (
  `MaNganh` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DaXoa` tinyint(1) NOT NULL DEFAULT '0',
  `TenNganh` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaKhoa` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `GhiChu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MaNganh`),
  UNIQUE KEY `NGANH_TenNganh_key` (`TenNganh`),
  KEY `NGANH_MaKhoa_fkey` (`MaKhoa`),
  CONSTRAINT `NGANH_MaKhoa_fkey` FOREIGN KEY (`MaKhoa`) REFERENCES `khoa` (`MaKhoa`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nganh`
--

LOCK TABLES `nganh` WRITE;
/*!40000 ALTER TABLE `nganh` DISABLE KEYS */;
INSERT INTO `nganh` VALUES ('KTPM',0,'Kỹ thuật Phần mềm','CNPM',NULL);
/*!40000 ALTER TABLE `nganh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nguoidung`
--

DROP TABLE IF EXISTS `nguoidung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nguoidung` (
  `TenDangNhap` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MatKhau` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `VaiTro` enum('ADMIN','PDT','PTC','SV') COLLATE utf8mb4_unicode_ci NOT NULL,
  `HoTen` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MaSoSinhVien` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TrangThai` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`TenDangNhap`),
  UNIQUE KEY `NGUOIDUNG_MaSoSinhVien_key` (`MaSoSinhVien`),
  CONSTRAINT `NGUOIDUNG_MaSoSinhVien_fkey` FOREIGN KEY (`MaSoSinhVien`) REFERENCES `sinhvien` (`MaSoSinhVien`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nguoidung`
--

LOCK TABLES `nguoidung` WRITE;
/*!40000 ALTER TABLE `nguoidung` DISABLE KEYS */;
INSERT INTO `nguoidung` VALUES ('23520001','$2a$10$nCXbX1Qm5DfUHr8he4SqMeTehIv4yxTtwwe.fP0Z7edEj8yJmI4sO','SV','Nguyễn Văn A','23520001',1),('admin','$2a$10$nCXbX1Qm5DfUHr8he4SqMeTehIv4yxTtwwe.fP0Z7edEj8yJmI4sO','ADMIN','Quản trị viên',NULL,1),('pdt','$2a$10$nCXbX1Qm5DfUHr8he4SqMeTehIv4yxTtwwe.fP0Z7edEj8yJmI4sO','PDT','Phòng Đào tạo',NULL,1),('ptc','$2a$10$nCXbX1Qm5DfUHr8he4SqMeTehIv4yxTtwwe.fP0Z7edEj8yJmI4sO','PTC','Phòng Tài chính',NULL,1);
/*!40000 ALTER TABLE `nguoidung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhomnguoidung`
--

DROP TABLE IF EXISTS `nhomnguoidung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nhomnguoidung` (
  `MaNhom` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TenNhom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`MaNhom`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhomnguoidung`
--

LOCK TABLES `nhomnguoidung` WRITE;
/*!40000 ALTER TABLE `nhomnguoidung` DISABLE KEYS */;
INSERT INTO `nhomnguoidung` VALUES ('ADMIN','Quản trị hệ thống'),('PDT','Phòng Đào tạo'),('PTC','Phòng Tài chính'),('SV','Sinh viên');
/*!40000 ALTER TABLE `nhomnguoidung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phieudangky`
--

DROP TABLE IF EXISTS `phieudangky`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phieudangky` (
  `MaPhieu` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaSoSinhVien` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaHKNH` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `NgayLapPhieu` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `TongTienDK` decimal(12,2) NOT NULL DEFAULT '0.00',
  `TienMienGiam` decimal(12,2) NOT NULL DEFAULT '0.00',
  `TongTienPhaiDong` decimal(12,2) NOT NULL DEFAULT '0.00',
  `SoTienDaDong` decimal(12,2) NOT NULL DEFAULT '0.00',
  `SoTienConLai` decimal(12,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`MaPhieu`),
  UNIQUE KEY `PHIEUDANGKY_MaSoSinhVien_MaHKNH_key` (`MaSoSinhVien`,`MaHKNH`),
  KEY `PHIEUDANGKY_MaHKNH_idx` (`MaHKNH`),
  CONSTRAINT `PHIEUDANGKY_MaHKNH_fkey` FOREIGN KEY (`MaHKNH`) REFERENCES `hockynamhoc` (`MaHKNH`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `PHIEUDANGKY_MaSoSinhVien_fkey` FOREIGN KEY (`MaSoSinhVien`) REFERENCES `sinhvien` (`MaSoSinhVien`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phieudangky`
--

LOCK TABLES `phieudangky` WRITE;
/*!40000 ALTER TABLE `phieudangky` DISABLE KEYS */;
/*!40000 ALTER TABLE `phieudangky` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phieuthuhocphi`
--

DROP TABLE IF EXISTS `phieuthuhocphi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phieuthuhocphi` (
  `MaPhieuThu` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaPhieuDK` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `NgayLapPhieu` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `SoTienThu` decimal(12,2) NOT NULL,
  PRIMARY KEY (`MaPhieuThu`),
  KEY `PHIEUTHUHOCPHI_MaPhieuDK_idx` (`MaPhieuDK`),
  CONSTRAINT `PHIEUTHUHOCPHI_MaPhieuDK_fkey` FOREIGN KEY (`MaPhieuDK`) REFERENCES `phieudangky` (`MaPhieu`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phieuthuhocphi`
--

LOCK TABLES `phieuthuhocphi` WRITE;
/*!40000 ALTER TABLE `phieuthuhocphi` DISABLE KEYS */;
/*!40000 ALTER TABLE `phieuthuhocphi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sinhvien`
--

DROP TABLE IF EXISTS `sinhvien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sinhvien` (
  `MaSoSinhVien` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DaXoa` tinyint(1) NOT NULL DEFAULT '0',
  `HoTen` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `KhoaHoc` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NgaySinh` datetime(3) DEFAULT NULL,
  `GioiTinh` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SoDienThoai` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MaXa` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MaNganh` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaDoiTuong` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TinhTrang` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Đang học',
  PRIMARY KEY (`MaSoSinhVien`),
  UNIQUE KEY `SINHVIEN_Email_key` (`Email`),
  KEY `SINHVIEN_MaDoiTuong_fkey` (`MaDoiTuong`),
  KEY `SINHVIEN_MaNganh_fkey` (`MaNganh`),
  KEY `SINHVIEN_MaXa_fkey` (`MaXa`),
  CONSTRAINT `SINHVIEN_MaDoiTuong_fkey` FOREIGN KEY (`MaDoiTuong`) REFERENCES `doituonguutien` (`MaDoiTuong`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `SINHVIEN_MaNganh_fkey` FOREIGN KEY (`MaNganh`) REFERENCES `nganh` (`MaNganh`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `SINHVIEN_MaXa_fkey` FOREIGN KEY (`MaXa`) REFERENCES `xa` (`MaXa`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sinhvien`
--

LOCK TABLES `sinhvien` WRITE;
/*!40000 ALTER TABLE `sinhvien` DISABLE KEYS */;
INSERT INTO `sinhvien` VALUES ('23520001',0,'Nguyễn Văn A',NULL,NULL,'Nam',NULL,NULL,NULL,'KTPM','KHONG','Đang học');
/*!40000 ALTER TABLE `sinhvien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thamso`
--

DROP TABLE IF EXISTS `thamso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thamso` (
  `TenThamSo` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `GiaTri` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`TenThamSo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thamso`
--

LOCK TABLES `thamso` WRITE;
/*!40000 ALTER TABLE `thamso` DISABLE KEYS */;
INSERT INTO `thamso` VALUES ('KIEM_TRA_MON_TRUOC','false'),('TY_LE_MIEN_GIAM_MAX','100'),('TY_LE_MIEN_GIAM_MIN','0');
/*!40000 ALTER TABLE `thamso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tinh`
--

DROP TABLE IF EXISTS `tinh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tinh` (
  `MaTinh` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DaXoa` tinyint(1) NOT NULL DEFAULT '0',
  `TenTinh` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`MaTinh`),
  UNIQUE KEY `TINH_TenTinh_key` (`TenTinh`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tinh`
--

LOCK TABLES `tinh` WRITE;
/*!40000 ALTER TABLE `tinh` DISABLE KEYS */;
INSERT INTO `tinh` VALUES ('HCM',0,'TP. Hồ Chí Minh');
/*!40000 ALTER TABLE `tinh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `xa`
--

DROP TABLE IF EXISTS `xa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `xa` (
  `MaXa` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DaXoa` tinyint(1) NOT NULL DEFAULT '0',
  `MaTinh` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TenXa` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `VungSauVungXa` tinyint(1) NOT NULL DEFAULT '0',
  `GhiChu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MaXa`),
  UNIQUE KEY `XA_MaTinh_TenXa_key` (`MaTinh`,`TenXa`),
  CONSTRAINT `XA_MaTinh_fkey` FOREIGN KEY (`MaTinh`) REFERENCES `tinh` (`MaTinh`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `xa`
--

LOCK TABLES `xa` WRITE;
/*!40000 ALTER TABLE `xa` DISABLE KEYS */;
INSERT INTO `xa` VALUES ('X001',0,'HCM','Phường Linh Trung',0,NULL);
/*!40000 ALTER TABLE `xa` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-10 21:04:16
