
/*! Branch Enforce (الخديوي) v2 - throttled */
(function(){
  const BRANCH_KEY = 'khdewy_branch';
  let availability = {};
  let allow = new Set();
  let rafScheduled = false;

  function getBranch(){
    try { return JSON.parse(localStorage.getItem(BRANCH_KEY) || 'null'); } catch(e){ return null; }
  }

  function loadAvailability(){
    return fetch('branchesالخديوي.json?t=' + Date.now())
      .then(r => r.json())
      .then(json => { availability = json.availability || {}; })
      .catch(()=> { availability = {}; });
  }

  function computeAllow(){
    const branch = getBranch();
    const arr = branch ? availability[String(branch.id)] : null;
    allow = new Set(Array.isArray(arr) ? arr.map(String) : []);
  }

  function isProductCard(el){
    return el && el.classList && el.classList.contains('product') && el.classList.contains('swiper-slide');
  }
  function extractId(el){
    const m = (el.id || '').match(/product-(\d+)/);
    return m ? m[1] : null;
  }

  function enforce(){
    if (!allow.size) return;
    const cards = document.querySelectorAll('.swiper-slide.product');
    cards.forEach(card => {
      const pid = extractId(card);
      const ok = pid && allow.has(String(pid));
      card.style.setProperty('display', ok ? 'block' : 'none', 'important');
      card.classList.toggle('kh-allow', !!ok);
    });
    document.querySelectorAll('.products.swiper-wrapper, .slider_products, .slide_product').forEach(w => {
      const hasAllowed = w.querySelector('.swiper-slide.product.kh-allow');
      w.style.display = hasAllowed ? '' : 'none';
    });
  }

  function schedule(){
    if (rafScheduled) return;
    rafScheduled = true;
    requestAnimationFrame(() => {
      rafScheduled = false;
      enforce();
    });
  }

  function boot(){
    computeAllow();
    schedule();                    // أول فرض
    setTimeout(schedule, 200);     // فرض بعد رسم السوايبر
  }

  loadAvailability().then(() => {
    if (document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }
  });

  // عند تغيير الفرع
  document.addEventListener('kh-branch-changed', () => { computeAllow(); schedule(); });

  // راقب تغييرات DOM لكن بتهدئة
  const mo = new MutationObserver(() => schedule());
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
