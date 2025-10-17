
/*! Checkout Area By Branch (الخديوي)
    - Populates #Area select with areas specific to the selected branch from branchesالخديوي.json -> areas[branchId]
    - Keeps your existing form and names as-is.
*/
(function(){
  const BRANCH_KEY = 'khdewy_branch';
  function getBranch(){
    try { return JSON.parse(localStorage.getItem(BRANCH_KEY) || 'null'); } catch(e){ return null; }
  }

  function populateAreas(){
    const branch = getBranch();
    const areaSelect = document.getElementById('Area');
    if (!areaSelect || !branch) return;

    fetch('branchesالخديوي.json')
      .then(r => r.json())
      .then(json => {
        const list = (json.areas && json.areas[String(branch.id)]) || [];
        // Clear current options
        while (areaSelect.firstChild) areaSelect.removeChild(areaSelect.firstChild);
        // Add placeholder
        const ph = document.createElement('option');
        ph.value = ''; ph.textContent = '-- اختر المنطقة --';
        areaSelect.appendChild(ph);
        // Add branch-specific areas
        list.forEach(a => {
          const opt = document.createElement('option');
          opt.value = a.name;
          opt.textContent = a.name + (a.fee != null ? (' - ' + a.fee + ' LE') : '');
          if (a.fee != null) opt.setAttribute('data-fee', a.fee);
          areaSelect.appendChild(opt);
        });
      })
      .catch(()=>{});
  }

  function onReady(){
    populateAreas();
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

  // If the user changes branch from somewhere else while checkout is open
  document.addEventListener('kh-branch-changed', populateAreas);
})();
