(() => {
  const URL = 'https://khuuazwwxlggsfvvofsu.supabase.co/rest/v1/seafood_inventory';
  const KEY = 'sb_publishable_Ny50rb2ZsvuwZ_bR9d1uHw_6dxXgTdO';
  const headers = { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' };
  const form = document.querySelector('#seller-form');
  if (!form) return;
  const q = id => form.querySelector(id);
  const refreshPreview = () => {
    const preview = document.querySelector('#seller-preview');
    if (preview) preview.textContent = [q('#seller-condition')?.value, q('#seller-type')?.value].filter(Boolean).join(' ');
  };
  q('#seller-spec')?.addEventListener('input', refreshPreview);

  document.addEventListener('submit', async event => {
    if (event.target !== form) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const owner = typeof currentUser === 'function' ? currentUser() : '';
    const price = Number(q('#seller-price')?.value.replace(/[^0-9]/g, ''));
    const quantity = Math.round(Number(q('#seller-spec')?.value || 0) * 2) / 2;
    const location = q('#seller-location')?.value.trim();
    const product = q('#seller-preview')?.textContent.trim();
    if (!owner) { alert('재고를 등록하려면 먼저 로그인해주세요.'); return; }
    if (!price || !location || quantity < .5) { alert('kg당 판매가, 등록 재고(0.5kg 이상), 재고 등록 장소를 입력해주세요.'); return; }
    const item = { owner, category:q('#seller-category').selectedOptions[0].text, type:q('#seller-type').value, condition:q('#seller-condition').value, process:q('#seller-process').value, spec:'', unit:'kg', price, quantity, location, display:product, approvalStatus:'pending' };
    const storageKey = 'yongwang-seller-inventory';
    const records = (() => { try { return JSON.parse(localStorage.getItem(storageKey)) || []; } catch { return []; } })();
    records.unshift(item);
    localStorage.setItem(storageKey, JSON.stringify(records));
    try {
      const response = await fetch(URL, { method:'POST', headers:{ ...headers, Prefer:'return=representation' }, body:JSON.stringify({ seller_name:owner, category:item.category, product_name:product, product_state:item.condition, processing_type:item.process, specification:'', unit:'kg', wholesale_price:price, quantity, location, approval_status:'pending' }) });
      if (!response.ok) throw new Error(await response.text());
      const [saved] = await response.json();
      item.remoteId = saved?.id;
      localStorage.setItem(storageKey, JSON.stringify(records));
      window.dispatchEvent(new Event('inventory-refreshed'));
      q('#seller-price').value = '';
      q('#seller-spec').value = '';
      q('#seller-location').value = '';
      alert(`${product} ${quantity}kg 재고가 관리자 승인 대기로 등록되었습니다.`);
    } catch (error) {
      console.error(error);
      alert('공유 재고 등록에 실패했습니다. 네트워크를 확인해주세요.');
    }
  }, true);
})();
