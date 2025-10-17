
/*! Branch Select (الخديوي) — اختيار فوري يدوي/تلقائي
    - يعرض نافذة اختيار الفرع بعد الإعلان (أو بعد مهلة قصيرة).
    - عند الضغط على بطاقة أي فرع: يعتمد فورًا ويغلق النافذة.
    - عند الضغط على "اختيار أقرب فرع تلقائيًا": يعتمد فورًا ويغلق النافذة.
    - بدون زر "اعتماد الفرع المختار".
*/
(function(){
  const STORE_KEY = 'khdewy_branch';
  const EVT = 'kh-branch-changed';
  let elements = {};
  let shown = false;

  const API = {
    get(){ try { return JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); } catch(e){ return null; } },
    set(b){ localStorage.setItem(STORE_KEY, JSON.stringify(b)); document.dispatchEvent(new CustomEvent(EVT, { detail: b })); },
    clear(){ localStorage.removeItem(STORE_KEY); document.dispatchEvent(new Event(EVT)); }
  };
  window.KH_BRANCH = API;

  function mountUI(){
    const overlay = document.createElement('div'); overlay.className = 'branch-overlay';
    const modal = document.createElement('div'); modal.className = 'branch-modal';
    const head = document.createElement('div'); head.className = 'branch-head';
    const title = document.createElement('h3'); title.className = 'branch-title'; title.textContent = 'ابدأ: اختر الفرع الأقرب لك';
    const closeX = document.createElement('button'); closeX.className = 'branch-close-x'; closeX.innerHTML = '&times;';
    head.append(title, closeX);
    const body = document.createElement('div'); body.className = 'branch-body';
    const list = document.createElement('div'); list.className = 'branch-list';
    const actions = document.createElement('div'); actions.className = 'branch-actions';
    const btnNear = document.createElement('button'); btnNear.className = 'branch-btn'; btnNear.textContent = 'اختيار أقرب فرع تلقائيًا';
    const note = document.createElement('div'); note.className = 'branch-note'; note.textContent = 'يمكنك تغيير الفرع لاحقًا من نفس الصفحة.';
    actions.append(btnNear);
    body.append(list, actions, note);
    modal.append(head, body); overlay.append(modal);
    document.body.appendChild(overlay);

    elements = { overlay, list, btnNear, closeX };
    closeX.addEventListener('click', () => overlay.classList.remove('branch-show'));
    return elements;
  }

  function show(){ if (!shown){ shown = true; elements.overlay.classList.add('branch-show'); } }
  function hide(){ elements.overlay.classList.remove('branch-show'); }

  function nearestBranchOf(coords, branches){
    const { latitude: lat, longitude: lng } = coords;
    let best=null, bestD=Infinity;
    branches.forEach(b => {
      if (typeof b.lat!=='number' || typeof b.lng!=='number') return;
      const d = Math.hypot(b.lat - lat, b.lng - lng);
      if (d < bestD){ best=b; bestD=d; }
    });
    return best;
  }

  function renderBranches(branches){
    elements.list.innerHTML = '';
    branches.forEach(b => {
      const card = document.createElement('div');
      card.className = 'branch-card';
      card.dataset.id = b.id;
      card.innerHTML = `<div style="font-weight:800">${b.name}</div>
                        <div style="font-size:12px;color:#6b7280">${b.address || ''}</div>`;
      // اختيار فوري عند الضغط
      card.addEventListener('click', () => { API.set(b); hide(); });
      elements.list.appendChild(card);
    });
  }

  function boot(){
    mountUI();
    fetch('branchesالخديوي.json?t=' + Date.now())
      .then(r => r.json())
      .then(json => {
        const branches = json.branches || [];
        renderBranches(branches);

        // زر اختيار أقرب فرع = اعتماد فوري
        elements.btnNear.addEventListener('click', () => {
          if (!navigator.geolocation){ alert('المتصفح لا يدعم تحديد الموقع'); return; }
          navigator.geolocation.getCurrentPosition(pos => {
            const best = nearestBranchOf(pos.coords, branches);
            if (best){ API.set(best); hide(); }
            else alert('لم يتم العثور على فروع قريبة');
          }, () => alert('يرجى السماح بالوصول إلى الموقع'));
        });

        // إظهار النافذة بعد الإعلان أو بعد مهلة قصيرة
        const ad = document.querySelector('.ad-overlay');
        const tryShow = () => {
          const adEl = document.querySelector('.ad-overlay');
          const visible = adEl && adEl.offsetParent !== null;
          if (!adEl || !visible) show();
        };
        setTimeout(show, 6000); // مهلة قصوى
        let tries=0; const iv=setInterval(()=>{ tryShow(); if(++tries>20||shown) clearInterval(iv); }, 200);
      })
      .catch(() => { setTimeout(show, 300); });
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
