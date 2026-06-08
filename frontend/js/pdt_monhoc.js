/* EduFee - QUẢN LÝ DANH MỤC MÔN HỌC (không có Loại môn — loại được chọn khi MỞ LỚP).
 * Trường: Mã, Tên, Khoa phụ trách, Số tiết, môn tiên quyết. */
document.addEventListener('DOMContentLoaded', async () => {
  await EduFeeGuard.protect(['PDT']);

  const $ = (id) => document.getElementById(id);
  const tbody = $('subjectTableBody');
  const modal = $('subjectModal');
  const form = $('subjectForm');
  const modalTitle = $('modalTitle');
  const btnAdd = $('btnOpenAddModal');
  const btnClose = $('btnCloseModal');
  const btnCancel = $('btnCancelModal');
  const inId = $('subjectId');
  const inName = $('subjectName');
  const inDept = $('subjectDepartment');
  const inPrereq = $('subjectPrerequisite');
  const inLessons = $('subjectLessons');
  const search = $('searchSubject');

  let mode = 'add', editingId = null, khoaList = [], courseList = [];

  async function loadDanhMuc() {
    khoaList = await EduFeeAPI.get('/khoa').catch(() => []);
    if (inDept) inDept.innerHTML = '<option value="">-- Khoa phụ trách --</option>' +
      khoaList.map((k) => `<option value="${k.MaKhoa}">${k.TenKhoa}</option>`).join('');
  }

  async function loadPrereqOptions(excludeId) {
    courseList = await EduFeeAPI.get('/courses?limit=200');
    courseList = courseList.items || courseList;
    if (inPrereq) inPrereq.innerHTML = '<option value="none">Không có</option>' +
      courseList.filter((c) => c.MaMonHoc !== excludeId)
        .map((c) => `<option value="${c.MaMonHoc}">[${c.MaMonHoc}] ${c.TenMonHoc}</option>`).join('');
  }

  function render(items) {
    tbody.innerHTML = '';
    if (!items.length) { tbody.innerHTML = '<tr><td colspan="5" class="text-center" style="padding:24px;color:#718096;">Không có môn học.</td></tr>'; return; }
    items.forEach((m, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${i + 1}</td><td><strong>${m.MaMonHoc}</strong></td><td>${m.TenMonHoc}</td>
        <td class="text-center">${m.SoTiet}</td>
        <td class="text-center"><div class="action-buttons">
          <button class="btn-action btn-edit" data-id="${m.MaMonHoc}"><i class="ti ti-edit"></i></button>
          <button class="btn-action btn-delete" data-id="${m.MaMonHoc}"><i class="ti ti-trash"></i></button>
        </div></td>`;
      tbody.appendChild(tr);
    });
    bind();
  }

  async function load() {
    const p = new URLSearchParams();
    if (search && search.value.trim()) p.set('search', search.value.trim());
    p.set('limit', '200');
    try { render((await EduFeeAPI.get('/courses?' + p)).items); } catch (e) { alert(e.message); }
  }

  function openModal(m, id) {
    mode = m; modal.classList.remove('hidden');
    loadPrereqOptions(id);
    if (m === 'add') { modalTitle.textContent = 'Thêm môn học'; form.reset(); inId.removeAttribute('disabled'); }
    else { modalTitle.textContent = 'Sửa môn học'; inId.removeAttribute('disabled'); fill(id); }
  }
  async function fill(id) {
    const m = await EduFeeAPI.get('/courses/' + id);
    editingId = id;
    inId.value = m.MaMonHoc; inName.value = m.TenMonHoc; inLessons.value = m.SoTiet;
    if (inDept) inDept.value = m.MaKhoa;
    if (inPrereq) inPrereq.value = (m.monHocTruocList && m.monHocTruocList[0]) ? m.monHocTruocList[0].MaMonHocTruoc : 'none';
  }
  function closeModal() { modal.classList.add('hidden'); form.reset(); editingId = null; }
  if (btnAdd) btnAdd.addEventListener('click', () => openModal('add'));
  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (btnCancel) btnCancel.addEventListener('click', closeModal);

  function bind() {
    document.querySelectorAll('.btn-edit').forEach((b) => b.addEventListener('click', () => openModal('edit', b.dataset.id)));
    document.querySelectorAll('.btn-delete').forEach((b) => b.addEventListener('click', async () => {
      if (!confirm(`Xóa môn ${b.dataset.id}?`)) return;
      try { await EduFeeAPI.del('/courses/' + b.dataset.id); load(); } catch (e) { alert(e.message); }
    }));
  }

  if (form) form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const prereq = inPrereq && inPrereq.value !== 'none' ? [inPrereq.value] : [];
    const payload = {
      MaMonHoc: inId.value.trim(), TenMonHoc: inName.value.trim(),
      MaKhoa: inDept ? inDept.value : '',
      SoTiet: Number(inLessons.value), monHocTruoc: prereq,
    };
    if (!payload.TenMonHoc || !payload.MaKhoa || !payload.SoTiet || (mode === 'add' && !payload.MaMonHoc)) {
      alert('Nhập đủ Mã, Tên, Khoa, Số tiết.'); return;
    }
    try {
      if (mode === 'add') await EduFeeAPI.post('/courses', payload);
      else await EduFeeAPI.put('/courses/' + editingId, payload);
      closeModal(); load();
    } catch (e) { alert(e.message); }
  });

  if (search) search.addEventListener('input', load);
  if (window.EduFeeExcel) EduFeeExcel.mountTableButton({ table: '.data-table', filename: 'DanhSachMonHoc', label: 'Xuất Excel' });
  await loadDanhMuc();
  await load();
});
