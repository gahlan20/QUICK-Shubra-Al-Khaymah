
/*! Branch Filter (الخديوي) v3 — ID-gated */
(function(){
  const STORE_KEY_BRANCH = 'khdewy_branch';
  let availability = {}; // { branchId: [productIds...] }

  function getBranch(){
    try { return JSON.parse(localStorage.getItem(STORE_KEY_BRANCH) || 'null'); } catch(e){ return null; }
  }

  function loadAvailability(){
    return fetch('branchesالخديوي.json')
      .then(r => r.json())
      .then(json => { availability = json.availability || {}; return availability; })
      .catch(() => (availability = {}));
  }

  // Install CSS gate once
  function ensureGateCSS(){
    if (document.getElementById('kh-branch-gate-style')) return;
    const css = document.createElement('style');
    css.id = 'kh-branch-gate-style';
    css.textContent = `
      /* Hide ALL product slides by default */
      .swiper-slide.product { display: none !important; }
      /* Show only explicitly allowed ones */
      .swiper-slide.product.kh-allow { display: block !important; }
    `;
    document.head.appendChild(css);
  }

  function allowOnly(ids){
    ensureGateCSS();
    // Remove previous allowances
    document.querySelectorAll('.swiper-slide.product.kh-allow').forEach(el => el.classList.remove('kh-allow'));
    // Allow only the provided IDs
    ids.forEach(id => {
      const el = document.getElementById('product-' + id);
      if (el) el.classList.add('kh-allow');
    });
    // Optional: remove empty wrappers to avoid gaps
    document.querySelectorAll('.swiper-wrapper, .row, .section, .products, .items').forEach(w => {
      const anyAllowed = w.querySelector('.swiper-slide.product.kh-allow');
      if (!anyAllowed){
        w.style.display = 'none';
      } else {
        w.style.display = '';
      }
    });
  }

  function filterOnce(){
    const branch = getBranch();
    if (!branch) return;
    const arr = availability[String(branch.id)];
    const ids = Array.isArray(arr) ? arr.map(String) : [];
    allowOnly(ids);
  }

  function boot(){
    loadAvailability().then(() => filterOnce());
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // Re-run when branch changes or DOM updates (for dynamic rendering)
  const mo = new MutationObserver(() => filterOnce());
  mo.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('kh-branch-changed', filterOnce);
})();
