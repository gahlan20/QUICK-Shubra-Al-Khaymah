
/*! Branch Services (الخديوي) */
(function(){
  const STORE_KEY_BRANCH = 'khdewy_branch';
  let services = {}; // { branchId: [strings...] }

  function getBranch(){
    try { return JSON.parse(localStorage.getItem(STORE_KEY_BRANCH) || 'null'); } catch(e){ return null; }
  }

  function ensurePanel(){
    let panel = document.getElementById('kh-branch-services');
    if (!panel){
      panel = document.createElement('div');
      panel.id = 'kh-branch-services';
      panel.className = 'branch-services';
      const mountAfter = document.querySelector('.categories') || document.querySelector('.swiper') || document.body;
      mountAfter.parentElement.insertBefore(panel, mountAfter.nextSibling);
    }
    return panel;
  }

  function render(){
    const branch = getBranch();
    if (!branch) return;
    const panel = ensurePanel();
    const list = services[String(branch.id)] || [];
    const title = 'خدمات الفرع: ' + (branch.name || branch.id);
    if (!list.length){
      panel.innerHTML = '<h4>'+title+'</h4><div>لا توجد خدمات مخصصة لهذا الفرع حاليًا.</div>';
    } else {
      const items = list.map(s => '<li>'+s+'</li>').join('');
      panel.innerHTML = '<h4>'+title+'</h4><ul>'+items+'</ul>';
    }
  }

  function boot(){
    fetch('branchesالخديوي.json')
      .then(r => r.json())
      .then(json => { services = json.services || {}; render(); })
      .catch(()=>{});
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  document.addEventListener('kh-branch-changed', render);
})();
