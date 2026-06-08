/* ============================================================================
 *  EduFee - QUẢN TRỊ HỆ THỐNG (admin.js)
 *  - Tab 1: Quản lý tài khoản (NGUOIDUNG) qua /api/admin/accounts
 *  - Tab 2: Phân quyền RBAC (CHUCNANG, NHOMNGUOIDUNG, BANGPHANQUYEN) — lưu
 *           trong CSDL thật qua /api/admin/rbac (không còn dùng localStorage).
 *  - Tab 3: Tham số hệ thống (THAMSO) qua /api/admin/params
 * ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  const me = await EduFeeGuard.protect(['ADMIN']);
  if (!me) return;

  /* ───── Helpers ───── */
  const $ = (id) => document.getElementById(id);
  const VAITRO = ['ADMIN', 'PDT', 'PTC', 'SV'];

  function log(msg, type = 'info') {
    const el = $('logStreamContainer');
    if (!el) return;
    const div = document.createElement('div');
    div.className = `log-${type}`;
    div.textContent = `[${new Date().toLocaleTimeString('vi-VN')}] ${msg}`;
    el.prepend(div);
  }

  function badgeVaiTro(vt) {
    const map = { ADMIN: 'badge-admin', PDT: 'badge-pdt', PTC: 'badge-ptc', SV: 'badge-sv' };
    return `<span class="${map[vt] || ''}">${vt}</span>`;
  }

  /* ================================================================
   *  TAB NAVIGATION
   * ================================================================ */
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.admin-tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = $( btn.dataset.tab );
      if (target) target.classList.add('active');
    });
  });

  // Sub-tabs trong tab phân quyền
  document.querySelectorAll('.pq-sub-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pq-sub-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.pq-sub-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = $(btn.dataset.pqtab);
      if (target) target.classList.add('active');
    });
  });

  /* ================================================================
   *  TAB 1 — QUẢN LÝ TÀI KHOẢN
   * ================================================================ */
  const tbody = $('adminUserTableBody');

  async function loadAccounts() {
    let accounts = [];
    try { accounts = await EduFeeAPI.get('/admin/accounts'); } catch (e) { log('Lỗi tải danh sách tài khoản: ' + e.message, 'warning'); return; }

    const lblTotal = $('lblTotalUsers');
    if (lblTotal) lblTotal.textContent = accounts.length;

    tbody.innerHTML = '';
    accounts.forEach(a => {
      const tr = document.createElement('tr');
      const roleOpts = VAITRO.map(r =>
        `<option value="${r}" ${r === a.VaiTro ? 'selected' : ''}>${r}</option>`
      ).join('');
      const statusStyle = a.TrangThai
        ? 'color:#276749;background:#f0fff4;border:1px solid #68d391;'
        : 'color:#9b2c2c;background:#fff5f5;border:1px solid #fc8181;';
      tr.innerHTML = `
        <td><strong>${a.TenDangNhap}</strong></td>
        <td>${a.HoTen || '<span style="color:#a0aec0">—</span>'}</td>
        <td>${badgeVaiTro(a.VaiTro)}</td>
        <td class="text-center">
          <button class="btn-status" data-user="${a.TenDangNhap}" data-active="${a.TrangThai}"
            style="font-size:11px;padding:3px 10px;border-radius:20px;cursor:pointer;font-weight:600;${statusStyle}border-radius:12px;">
            ${a.TrangThai ? '● Hoạt động' : '○ Đã khoá'}
          </button>
        </td>
        <td class="text-center">
          <select class="role-select" data-user="${a.TenDangNhap}" style="font-size:12px;padding:3px 6px;border:1px solid #e2e8f0;border-radius:4px;">
            ${roleOpts}
          </select>
          <button class="btn-action btn-del" data-user="${a.TenDangNhap}" style="margin-left:4px;" title="Xoá">
            <i class="ti ti-trash"></i>
          </button>
        </td>`;
      tbody.appendChild(tr);
    });
    bindAccountActions();
  }

  function bindAccountActions() {
    tbody.querySelectorAll('.role-select').forEach(sel => sel.addEventListener('change', async () => {
      try {
        await EduFeeAPI.put('/admin/accounts/' + sel.dataset.user, { VaiTro: sel.value });
        log(`Đổi vai trò ${sel.dataset.user} → ${sel.value}`, 'success');
        loadAccounts();
      } catch (e) { alert(e.message); loadAccounts(); }
    }));

    tbody.querySelectorAll('.btn-status').forEach(btn => btn.addEventListener('click', async () => {
      const newActive = btn.dataset.active !== 'true';
      try {
        await EduFeeAPI.put('/admin/accounts/' + btn.dataset.user, { TrangThai: newActive });
        log(`${newActive ? 'Mở khoá' : 'Khoá'} tài khoản ${btn.dataset.user}`, 'warning');
        loadAccounts();
      } catch (e) { alert(e.message); }
    }));

    tbody.querySelectorAll('.btn-del').forEach(btn => btn.addEventListener('click', async () => {
      if (!confirm(`Xoá tài khoản "${btn.dataset.user}"?`)) return;
      try {
        await EduFeeAPI.del('/admin/accounts/' + btn.dataset.user);
        log(`Đã xoá tài khoản ${btn.dataset.user}`, 'warning');
        loadAccounts();
      } catch (e) { alert(e.message); }
    }));
  }

  // Tạo tài khoản mới
  const btnCreate = $('btnCreateAccount');
  if (btnCreate) btnCreate.addEventListener('click', async () => {
    const g = (id) => { const el = $(id); return el ? el.value.trim() : ''; };
    const body = {
      TenDangNhap: g('acTenDangNhap'),
      MatKhau: g('acMatKhau'),
      HoTen: g('acHoTen'),
      VaiTro: g('acVaiTro'),
    };
    if (!body.TenDangNhap || !body.MatKhau) { alert('Nhập tên đăng nhập và mật khẩu.'); return; }
    if (body.MatKhau.length < 6) { alert('Mật khẩu tối thiểu 6 ký tự.'); return; }
    if (body.VaiTro === 'SV') {
      body.MaSoSinhVien = g('acMSSV');
      if (!body.MaSoSinhVien) { alert('Tài khoản SV cần MSSV.'); return; }
    }
    try {
      await EduFeeAPI.post('/admin/accounts', body);
      log(`Tạo tài khoản ${body.TenDangNhap} (${body.VaiTro})`, 'success');
      ['acTenDangNhap','acMatKhau','acHoTen','acMSSV'].forEach(id => { const el = $(id); if (el) el.value = ''; });
      loadAccounts();
    } catch (e) { alert(e.message); }
  });

  /* ================================================================
   *  TAB 2 — PHÂN QUYỀN (RBAC) — DÙNG DỮ LIỆU THẬT TỪ BACKEND
   *  Bảng CHUCNANG, NHOMNGUOIDUNG, BANGPHANQUYEN qua /api/admin/rbac.
   *  (Trước đây lưu trong localStorage "edufee_rbac" — nay đã bỏ.)
   * ================================================================ */

  // Bộ nhớ tạm phía client, luôn đồng bộ lại từ server sau mỗi thao tác.
  let rbac = { chucNang: [], nhom: [], phanQuyen: [] };

  // Tải toàn bộ dữ liệu phân quyền từ server rồi vẽ lại giao diện.
  async function reloadRBAC() {
    try {
      rbac = await EduFeeAPI.get('/admin/rbac');
    } catch (e) {
      log('Lỗi tải dữ liệu phân quyền: ' + e.message, 'warning');
      rbac = { chucNang: [], nhom: [], phanQuyen: [] };
    }
    renderChucNang();
    renderNhom();
    renderPhanQuyen();
    renderMatrix();
    renderSummary();
    // Cập nhật KPI trong tab phân quyền
    const kNhom = $('kpiNhomCount'); if (kNhom) kNhom.textContent = rbac.nhom.length;
    const kCN   = $('kpiCNCount');   if (kCN)   kCN.textContent   = rbac.chucNang.length;
    const kPQ   = $('kpiPQCount');   if (kPQ)   kPQ.textContent   = rbac.phanQuyen.length;
  }
  // Giữ tên cũ để phần KHỞI TẠO vẫn gọi được.
  async function refreshPQ() { await reloadRBAC(); }

  // -- Render chức năng
  function renderChucNang() {
    const body = $('chucNangBody');
    if (!body) return;
    body.innerHTML = '';
    rbac.chucNang.forEach(cn => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><code style="font-size:11px;">${cn.MaChucNang}</code></td>
        <td>${cn.TenChucNang}</td>
        <td style="font-size:11px;color:#718096;">${cn.TenManHinhDuocLoad || ''}</td>
        <td><button class="btn-sm-red del-cn" data-ma="${cn.MaChucNang}" title="Xoá"><i class="ti ti-trash"></i></button></td>`;
      body.appendChild(tr);
    });
    body.querySelectorAll('.del-cn').forEach(btn => btn.addEventListener('click', async () => {
      if (!confirm(`Xoá chức năng "${btn.dataset.ma}"? Các quyền liên quan cũng sẽ bị thu hồi.`)) return;
      try {
        await EduFeeAPI.del('/admin/rbac/chuc-nang/' + encodeURIComponent(btn.dataset.ma));
        log(`Xoá chức năng ${btn.dataset.ma}`, 'warning');
        await reloadRBAC();
      } catch (e) { alert(e.message); }
    }));
    const lbl = $('lblChucNangTotal');
    if (lbl) lbl.textContent = rbac.chucNang.length + ' chức năng';
    const kpi = $('lblChucNangCount');
    if (kpi) kpi.textContent = rbac.chucNang.length;
    rebuildSelects();
  }

  // -- Render nhóm
  function renderNhom() {
    const body = $('nhomBody');
    if (!body) return;
    body.innerHTML = '';
    rbac.nhom.forEach(n => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="badge-${n.MaNhom.toLowerCase()}">${n.MaNhom}</span></td>
        <td>${n.TenNhom}</td>
        <td><button class="btn-sm-red del-nhom" data-ma="${n.MaNhom}" title="Xoá"><i class="ti ti-trash"></i></button></td>`;
      body.appendChild(tr);
    });
    body.querySelectorAll('.del-nhom').forEach(btn => btn.addEventListener('click', async () => {
      if (!confirm(`Xoá nhóm "${btn.dataset.ma}"? Các quyền của nhóm cũng sẽ bị thu hồi.`)) return;
      try {
        await EduFeeAPI.del('/admin/rbac/nhom/' + encodeURIComponent(btn.dataset.ma));
        log(`Xoá nhóm ${btn.dataset.ma}`, 'warning');
        await reloadRBAC();
      } catch (e) { alert(e.message); }
    }));
    rebuildSelects();
  }

  // -- Render bảng phân quyền (kèm cờ Thêm/Xóa/Sửa)
  function renderPhanQuyen() {
    const body = $('phanQuyenBody');
    if (!body) return;
    body.innerHTML = '';
    rbac.phanQuyen.forEach(pq => {
      const cn = rbac.chucNang.find(c => c.MaChucNang === pq.MaChucNang);
      const chip = (on, txt) => `<span class="perm-chip ${on ? 'on' : ''}">${txt}</span>`;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="badge-${pq.MaNhom.toLowerCase()}">${pq.MaNhom}</span></td>
        <td>${cn ? cn.TenChucNang : pq.MaChucNang}<br>
            ${chip(pq.Them, 'T')}${chip(pq.Xoa, 'X')}${chip(pq.Sua, 'S')}</td>
        <td style="font-size:11px;color:#718096;">${cn ? (cn.TenManHinhDuocLoad || '') : ''}</td>
        <td><button class="btn-sm-red del-pq" data-nhom="${pq.MaNhom}" data-cn="${pq.MaChucNang}" title="Thu hồi quyền"><i class="ti ti-minus"></i></button></td>`;
      body.appendChild(tr);
    });
    body.querySelectorAll('.del-pq').forEach(btn => btn.addEventListener('click', async () => {
      try {
        await EduFeeAPI.del('/admin/rbac/phan-quyen/' + encodeURIComponent(btn.dataset.nhom) + '/' + encodeURIComponent(btn.dataset.cn));
        log(`Thu hồi quyền ${btn.dataset.cn} của nhóm ${btn.dataset.nhom}`, 'warning');
        await reloadRBAC();
      } catch (e) { alert(e.message); }
    }));
  }

  // -- Helper: tìm dòng phân quyền (nhóm × chức năng)
  function timQuyen(maNhom, maCN) {
    return rbac.phanQuyen.find(p => p.MaNhom === maNhom && p.MaChucNang === maCN) || null;
  }

  // -- Lưu trạng thái 1 ô (gọi PUT /admin/rbac/phan-quyen)
  async function luuQuyenO(maNhom, maCN, quyen) {
    try {
      await EduFeeAPI.put('/admin/rbac/phan-quyen', {
        MaNhom: maNhom, MaChucNang: maCN,
        Them: quyen.Them, Xoa: quyen.Xoa, Sua: quyen.Sua,
      });
      const tat = !quyen.Them && !quyen.Xoa && !quyen.Sua;
      log(`Cập nhật quyền ${maCN} cho ${maNhom}: ${tat ? 'thu hồi' : [quyen.Them && 'Thêm', quyen.Xoa && 'Xóa', quyen.Sua && 'Sửa'].filter(Boolean).join('+')}`, tat ? 'warning' : 'success');
      await reloadRBAC();
    } catch (e) { alert(e.message); await reloadRBAC(); }
  }

  // -- Render MA TRẬN có thể tick Thêm/Xóa/Sửa cho từng (chức năng × vai trò)
  function renderMatrix() {
    const head = $('matrixHead');
    const body = $('matrixBody');
    if (!head || !body) return;

    const badgeMap = { ADMIN:'badge-admin', PDT:'badge-pdt', PTC:'badge-ptc', SV:'badge-sv' };
    const nhomList = rbac.nhom.map(n => n.MaNhom);

    // Header
    head.innerHTML = `<tr><th style="min-width:220px;">Chức năng</th>${
      nhomList.map(m => `<th class="text-center"><span class="${badgeMap[m] || ''}">${m}</span></th>`).join('')
    }</tr>`;

    // Body: mỗi ô = 3 checkbox T / X / S
    body.innerHTML = '';
    if (!rbac.chucNang.length) {
      body.innerHTML = `<tr><td colspan="${nhomList.length + 1}" class="text-center" style="color:#a0aec0;padding:18px;font-style:italic;">Chưa có chức năng nào.</td></tr>`;
      return;
    }
    rbac.chucNang.forEach(cn => {
      const tr = document.createElement('tr');
      const cells = nhomList.map(maNhom => {
        const q = timQuyen(maNhom, cn.MaChucNang);
        const ck = (perm, txt) => {
          const on = q && q[perm];
          return `<label class="${on ? 'on' : ''}">
            <input type="checkbox" data-nhom="${maNhom}" data-cn="${cn.MaChucNang}" data-perm="${perm}" ${on ? 'checked' : ''}>
            ${txt}</label>`;
        };
        return `<td class="perm-cell"><div class="perm-group">${ck('Them','Thêm')}${ck('Xoa','Xóa')}${ck('Sua','Sửa')}</div></td>`;
      }).join('');
      tr.innerHTML = `<td>${cn.TenChucNang} <span style="font-size:10px;color:#a0aec0;">(${cn.TenManHinhDuocLoad || ''})</span></td>${cells}`;
      body.appendChild(tr);
    });

    // Bắt sự kiện tick: gom cả 3 cờ của ô rồi lưu
    body.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        const maNhom = cb.dataset.nhom, maCN = cb.dataset.cn;
        const ô = body.querySelectorAll(`input[data-nhom="${maNhom}"][data-cn="${maCN}"]`);
        const quyen = { Them: false, Xoa: false, Sua: false };
        ô.forEach(x => { quyen[x.dataset.perm] = x.checked; });
        luuQuyenO(maNhom, maCN, quyen);
      });
    });
  }

  // -- Render BẢNG TỔNG HỢP (chỉ xem) các chức năng và quyền theo vai trò
  function renderSummary() {
    const body = $('summaryBody');
    if (!body) return;
    const nhomList = ['ADMIN', 'PDT', 'PTC', 'SV'].filter(m => rbac.nhom.some(n => n.MaNhom === m));
    // Nếu có nhóm khác ngoài 4 vai trò mặc định, vẫn thêm vào cuối
    rbac.nhom.forEach(n => { if (!nhomList.includes(n.MaNhom)) nhomList.push(n.MaNhom); });

    body.innerHTML = '';
    if (!rbac.chucNang.length) {
      body.innerHTML = `<tr><td colspan="${nhomList.length + 3}" class="text-center" style="color:#a0aec0;padding:18px;font-style:italic;">Chưa có chức năng nào.</td></tr>`;
    } else {
      rbac.chucNang.forEach(cn => {
        const tr = document.createElement('tr');
        const cells = nhomList.map(maNhom => {
          const q = timQuyen(maNhom, cn.MaChucNang);
          if (!q) return `<td class="text-center"><span class="perm-none">—</span></td>`;
          const chip = (on, txt) => `<span class="perm-chip ${on ? 'on' : ''}">${txt}</span>`;
          return `<td class="text-center">${chip(q.Them, 'T')}${chip(q.Xoa, 'X')}${chip(q.Sua, 'S')}</td>`;
        }).join('');
        tr.innerHTML = `
          <td><code style="font-size:11px;">${cn.MaChucNang}</code></td>
          <td>${cn.TenChucNang}</td>
          <td style="font-size:11px;color:#718096;">${cn.TenManHinhDuocLoad || ''}</td>
          ${cells}`;
        body.appendChild(tr);
      });
    }
    const lbl = $('lblSummaryTotal');
    if (lbl) lbl.textContent = rbac.chucNang.length + ' chức năng';
  }

  function rebuildSelects() {
    // select nhóm
    const selNhom = $('pqNhom');
    if (selNhom) {
      selNhom.innerHTML = '<option value="">-- chọn --</option>';
      rbac.nhom.forEach(n => selNhom.insertAdjacentHTML('beforeend', `<option value="${n.MaNhom}">${n.MaNhom} - ${n.TenNhom}</option>`));
    }
    // select chức năng
    const selCN = $('pqCN');
    if (selCN) {
      selCN.innerHTML = '<option value="">-- chọn --</option>';
      rbac.chucNang.forEach(cn => selCN.insertAdjacentHTML('beforeend', `<option value="${cn.MaChucNang}">${cn.MaChucNang} - ${cn.TenChucNang}</option>`));
    }
  }

  // Thêm chức năng
  const btnAddCN = $('btnAddChucNang');
  if (btnAddCN) btnAddCN.addEventListener('click', async () => {
    const ma = $('cnMa')?.value.trim().toUpperCase();
    const ten = $('cnTen')?.value.trim();
    const mh  = $('cnManHinh')?.value.trim();
    if (!ma || !ten) { alert('Nhập đủ Mã và Tên chức năng.'); return; }
    try {
      await EduFeeAPI.post('/admin/rbac/chuc-nang', { MaChucNang: ma, TenChucNang: ten, TenManHinhDuocLoad: mh || null });
      log(`Thêm chức năng: ${ma}`, 'success');
      ['cnMa','cnTen','cnManHinh'].forEach(id => { const el = $(id); if (el) el.value = ''; });
      await reloadRBAC();
    } catch (e) { alert(e.message); }
  });

  // Thêm nhóm
  const btnAddNhom = $('btnAddNhom');
  if (btnAddNhom) btnAddNhom.addEventListener('click', async () => {
    const ma  = $('nhMa')?.value.trim().toUpperCase();
    const ten = $('nhTen')?.value.trim();
    if (!ma || !ten) { alert('Nhập đủ Mã và Tên nhóm.'); return; }
    try {
      await EduFeeAPI.post('/admin/rbac/nhom', { MaNhom: ma, TenNhom: ten });
      log(`Thêm nhóm: ${ma} - ${ten}`, 'success');
      ['nhMa','nhTen'].forEach(id => { const el = $(id); if (el) el.value = ''; });
      await reloadRBAC();
    } catch (e) { alert(e.message); }
  });

  // Cấp quyền
  const btnCapQuyen = $('btnCapQuyen');
  if (btnCapQuyen) btnCapQuyen.addEventListener('click', async () => {
    const maNhom = $('pqNhom')?.value;
    const maCN   = $('pqCN')?.value;
    if (!maNhom || !maCN) { alert('Chọn Nhóm và Chức năng.'); return; }
    try {
      await EduFeeAPI.post('/admin/rbac/phan-quyen', { MaNhom: maNhom, MaChucNang: maCN, Them: true, Xoa: true, Sua: true });
      log(`Cấp quyền ${maCN} cho nhóm ${maNhom} (Thêm/Xóa/Sửa)`, 'success');
      await reloadRBAC();
    } catch (e) { alert(e.message); }
  });

  /* ================================================================
   *  TAB 3 — THAM SỐ HỆ THỐNG
   * ================================================================ */
  async function loadParams() {
    let params = [];
    try { params = await EduFeeAPI.get('/admin/params'); } catch (e) { return; }
    const lbl = $('lblParamCount');
    if (lbl) lbl.textContent = params.length;
    const body = $('paramTableBody');
    if (!body) return;
    body.innerHTML = '';
    params.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><code>${p.TenThamSo}</code></td>
        <td>${p.GiaTri}</td>
        <td class="text-center">
          <button class="btn-action edit-param" data-ten="${p.TenThamSo}" data-val="${p.GiaTri}" title="Sửa">
            <i class="ti ti-edit"></i>
          </button>
          <button class="btn-action btn-del del-param" data-ten="${p.TenThamSo}" title="Xoá">
            <i class="ti ti-trash"></i>
          </button>
        </td>`;
      body.appendChild(tr);
    });

    body.querySelectorAll('.edit-param').forEach(btn => btn.addEventListener('click', () => {
      const row = $('paramFormRow');
      if (row) row.style.display = 'flex';
      const tenEl = $('paramTen'); const valEl = $('paramGiaTri');
      if (tenEl) { tenEl.value = btn.dataset.ten; tenEl.disabled = true; }
      if (valEl) valEl.value = btn.dataset.val;
    }));
    body.querySelectorAll('.del-param').forEach(btn => btn.addEventListener('click', async () => {
      if (!confirm(`Xoá tham số "${btn.dataset.ten}"?`)) return;
      try {
        await EduFeeAPI.del('/admin/params/' + btn.dataset.ten);
        log(`Xoá tham số ${btn.dataset.ten}`, 'warning');
        loadParams();
      } catch (e) { alert(e.message); }
    }));
  }

  const btnAddParam = $('btnAddParam');
  if (btnAddParam) btnAddParam.addEventListener('click', () => {
    const row = $('paramFormRow');
    if (row) row.style.display = 'flex';
    const tenEl = $('paramTen'); const valEl = $('paramGiaTri');
    if (tenEl) { tenEl.value = ''; tenEl.disabled = false; }
    if (valEl) valEl.value = '';
  });

  const btnSaveParam = $('btnSaveParam');
  if (btnSaveParam) btnSaveParam.addEventListener('click', async () => {
    const ten = $('paramTen')?.value.trim();
    const val = $('paramGiaTri')?.value.trim();
    if (!ten) { alert('Nhập tên tham số.'); return; }
    try {
      await EduFeeAPI.put('/admin/params/' + ten, { GiaTri: val });
      log(`Cập nhật tham số ${ten} = ${val}`, 'success');
      const row = $('paramFormRow');
      if (row) row.style.display = 'none';
      loadParams();
    } catch (e) { alert(e.message); }
  });

  const btnCancelParam = $('btnCancelParam');
  if (btnCancelParam) btnCancelParam.addEventListener('click', () => {
    const row = $('paramFormRow');
    if (row) row.style.display = 'none';
  });

  /* ================================================================
   *  KHỞI TẠO
   * ================================================================ */
  await loadAccounts();
  await refreshPQ();
  await loadParams();
  log('Đã tải dữ liệu hệ thống.', 'success');
});
