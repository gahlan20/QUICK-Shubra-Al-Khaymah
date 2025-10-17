
/*! Branch Pricing Override (الخديوي) */
(function(){
  const STORE_KEY_BRANCH = 'khdewy_branch';
  const PRICES_APPLIED_ATTR = 'data-kh-price-applied';

  const getBranch = () => {
    try { return JSON.parse(localStorage.getItem(STORE_KEY_BRANCH) || 'null'); }
    catch(e){ return null; }
  };

  let priceMap = {};

  function loadPricing(branchId){
    return fetch('branchesالخديوي.json')
      .then(r => r.json())
      .then(json => {
        const allPricing = (json.pricing || {});
        priceMap = allPricing[String(branchId)] || {};
        return priceMap;
      }).catch(()=> (priceMap = {}));
  }

  function applyPricesToCards(){
    if (!priceMap || !Object.keys(priceMap).length) return;

    document.querySelectorAll('[data-id]:not(['+PRICES_APPLIED_ATTR+'])').forEach(el => {
      const pid = el.getAttribute('data-id');
      const newPrice = priceMap[pid];
      if (newPrice != null){
        const priceEl = el.querySelector('.price, .product-price, [data-price]');
        if (priceEl){
          priceEl.textContent = String(newPrice);
          el.setAttribute(PRICES_APPLIED_ATTR, '1');
        }
      }
    });

    document.querySelectorAll('[data-product-id]:not(['+PRICES_APPLIED_ATTR+'])').forEach(el => {
      const pid = el.getAttribute('data-product-id');
      const newPrice = priceMap[pid];
      if (newPrice != null){
        const priceEl = el.querySelector('.price, .product-price, [data-price]') || el;
        priceEl.textContent = String(newPrice);
        el.setAttribute(PRICES_APPLIED_ATTR, '1');
      }
    });

    document.querySelectorAll('a[href*="#product-"], [id^="product-"]').forEach(anchor => {
      const m = String(anchor.getAttribute('href') || anchor.id || '').match(/product-(\d+)/);
      if (!m) return;
      const pid = m[1];
      if (anchor.closest('['+PRICES_APPLIED_ATTR+']')) return;
      const card = anchor.closest('.card, .product, .item, li, .box, .swiper-slide') || anchor.parentElement;
      if (!card) return;
      const newPrice = priceMap[pid];
      if (newPrice != null){
        const priceEl = card.querySelector('.price, .product-price, [data-price]');
        if (priceEl){
          priceEl.textContent = String(newPrice);
          card.setAttribute(PRICES_APPLIED_ATTR, '1');
        }
      }
    });
  }

  function patchCartAdd(){
    const w = window;
    const candidateNames = ['addToCart', 'AddToCart', 'add_cart', 'addItemToCart'];
    candidateNames.forEach(fn => {
      if (typeof w[fn] === 'function' && !w[fn]._kh_patched){
        const orig = w[fn];
        w[fn] = function(product){
          try{
            const pid = String(product?.id ?? product?.productId ?? product?.pid ?? '');
            if (pid && priceMap[pid] != null){
              product.price = priceMap[pid];
            }
          }catch(e){}
          return orig.apply(this, arguments);
        };
        w[fn]._kh_patched = true;
      }
    });
  }

  function boot(){
    const branch = getBranch();
    if (!branch) return;
    loadPricing(branch.id).then(() => {
      applyPricesToCards();
      patchCartAdd();
    });
  }

  const mo = new MutationObserver(() => applyPricesToCards());
  mo.observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  document.addEventListener('kh-branch-changed', boot);
})();
