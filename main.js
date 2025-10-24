(function(){
  const navButtons = Array.from(document.querySelectorAll('.nav button'));
  const sections = Array.from(document.querySelectorAll('.section'));
  const pageTitle = document.getElementById('pageTitle');
  const menuToggle = document.getElementById('menuToggle');
  const navEl = document.querySelector('.nav');

  // urutan halaman
  const order = sections.map(s => s.id);

  function showSection(name, push = true) {
    sections.forEach(s => {
      if (s.id === name) s.classList.add('show');
      else s.classList.remove('show');
    });

    // update tombol nav yang aktif
    navButtons.forEach(b => b.classList.toggle('active', b.dataset.target === name));

    // update judul
    pageTitle.textContent = name[0].toUpperCase() + name.slice(1);

    // update URL hash (jika push = true)
    if (push) history.pushState({ page: name }, '', '#' + name);
  }

  // event klik tombol nav
  navButtons.forEach(b => {
    b.addEventListener('click', () => {
      const t = b.dataset.target;
      showSection(t);
    });
  });

  // tombol next/prev
  document.addEventListener('click', (e) => {
    const action = e.target.closest('[data-action]');
    if (!action) return;
    const act = action.dataset.action;
    const currentId = sections.find(s => s.classList.contains('show')).id;
    const idx = order.indexOf(currentId);

    if (act === 'next') {
      const next = order[Math.min(order.length - 1, idx + 1)];
      showSection(next);
    } else if (act === 'prev') {
      const prev = order[Math.max(0, idx - 1)];
      showSection(prev);
    }
  });

  // fungsi global untuk tombol "Selesai ✓"
  window.goTo = function(name) {
    showSection(name);
  };

  // tombol back/forward browser
  window.addEventListener('popstate', (ev) => {
    const state = (ev.state && ev.state.page) || (location.hash ? location.hash.replace('#', '') : 'home');
    showSection(state, false);
  });

  // tampilkan section awal
  const init = location.hash ? location.hash.replace('#', '') : 'home';
  if (order.includes(init)) showSection(init, false);
  else showSection('home', false);

  // toggle menu kecil (hamburger) saat di mobile
  menuToggle?.addEventListener('click', () => {
    navEl.classList.toggle('open');
    navEl.style.display = navEl.style.display === 'flex' ? '' : 'flex';
  });

  // navigasi via keyboard
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    const currentId = sections.find(s => s.classList.contains('show')).id;
    const idx = order.indexOf(currentId);
    if (e.key === 'ArrowRight') {
      const next = order[Math.min(order.length - 1, idx + 1)];
      showSection(next);
    } else if (e.key === 'ArrowLeft') {
      const prev = order[Math.max(0, idx - 1)];
      showSection(prev);
    }
  });
})();