
/*! Branch Filter Strict Removal (الخديوي)
  - Runs AFTER branch-filterالخديوي.js
  - Removes (from DOM) any product-like card that is hidden (display:none)
  - Ensures only the selected branch items remain in the page.
*/
(function(){
  function isProductCard(el){
    if (!el) return false;
    const cls = (el.className || '');
    return /(card|product|item|box|swiper-slide)/i.test(cls);
  }

  function purgeHidden(){
    const nodes = document.querySelectorAll('.card, .product, .item, li, .box, .swiper-slide');
    nodes.forEach(n => {
      if (!isProductCard(n)) return;
      const style = window.getComputedStyle(n);
      if (style.display === 'none'){
        n.remove();
      }
    });

    // Clean up empty wrappers/rows if needed
    document.querySelectorAll('.row, .swiper-wrapper, .products, .items, ul, .category, .section').forEach(w => {
      if (!w) return;
      if (!w.querySelector('.card, .product, .item, li, .box, .swiper-slide')){
        // no product children left
        // hide entire wrapper to avoid big gaps
        w.style.display = 'none';
      }
    });
  }

  function run(){
    // Give branch-filter time to finish first run
    setTimeout(purgeHidden, 50);
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  // Re-run on branch change / DOM changes
  document.addEventListener('kh-branch-changed', () => setTimeout(purgeHidden, 30));
  const mo = new MutationObserver(() => setTimeout(purgeHidden, 30));
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
