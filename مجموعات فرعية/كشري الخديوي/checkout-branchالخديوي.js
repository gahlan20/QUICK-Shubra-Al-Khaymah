
/*! Checkout Branch Wiring (الخديوي) */
(function(){
  const BRANCH_KEY = 'khdewy_branch';

  function getBranch(){
    try { return JSON.parse(localStorage.getItem(BRANCH_KEY) || 'null'); } catch(e){ return null; }
  }

  function ensureBranchBadge(){
    const branch = getBranch();
    if (!branch) return;

    let badge = document.getElementById('kh-branch-badge');
    if (!badge){
      badge = document.createElement('div');
      badge.id = 'kh-branch-badge';
      badge.style.cssText = 'margin:10px 0;padding:8px 10px;background:#eefbf3;border:1px solid #86efac;border-radius:8px;color:#065f46;font-weight:700;direction:rtl;';
      const container = document.querySelector('.button_div') || document.body;
      container.parentElement.insertBefore(badge, container);
    }
    badge.textContent = 'سيتم إرسال الطلب إلى فرع: ' + (branch.name || branch.id);
  }

  function injectHiddenInput(form){
    const branch = getBranch();
    if (!branch || !form) return;
    let hidden = form.querySelector('input[name="Branch"]');
    if (!hidden){
      hidden = document.createElement('input');
      hidden.type = 'hidden';
      hidden.name = 'Branch';
      form.appendChild(hidden);
    }
    hidden.value = branch.name || branch.id;
  }

  function onReady(){
    const form = document.querySelector('form');
    ensureBranchBadge();
    injectHiddenInput(form);
    if (form){
      form.addEventListener('submit', function(){
        injectHiddenInput(form);
      });
    }
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
