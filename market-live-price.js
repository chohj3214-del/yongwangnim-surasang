(() => {
  const URL = 'https://khuuazwwxlggsfvvofsu.supabase.co/rest/v1';
  const KEY = 'sb_publishable_Ny50rb2ZsvuwZ_bR9d1uHw_6dxXgTdO';
  const headers = { apikey: KEY, Authorization: 'Bearer ' + KEY };
  const normalize = value => String(value || '').replace(/\s/g, '');
  const money = value => `₩ ${Number(value || 0).toLocaleString()}`;
  const matches = (storedName, cardName) => {
    const stored = normalize(storedName), card = normalize(cardName);
    return stored.includes(card) || card.includes(stored);
  };

  async function loadPurchases() {
    try {
      const response = await fetch(URL + '/purchase_transactions?select=product_name,quantity', { headers });
      if (!response.ok) throw new Error('purchase data unavailable');
      return response.json();
    } catch (error) {
      console.warn('Purchase data unavailable', error);
      return [];
    }
  }

  function ensureDetails(card) {
    let details = card.querySelector('.live-price-details');
    if (details) return details;
    details = document.createElement('div');
    details.className = 'live-price-details';
    details.innerHTML = '<span>등록 도매가 <b></b></span><span>구매 가능가 <b></b></span><span class="supply-demand">실구매 수요 <b></b></span><span class="supply-demand">남은 공급 <b></b></span>';
    (card.querySelector('.seller-price-box') || card.querySelector('.price'))?.after(details);
    return details;
  }

  function updateCard(card, purchases) {
    const name = card.querySelector('h3')?.textContent.trim();
    if (!name) return;
    const inventory = Array.isArray(window.approvedInventorySnapshot) ? window.approvedInventorySnapshot : [];
    const related = inventory.filter(item => matches(item.product_name, name));
    const supply = related.reduce((sum, item) => sum + Math.max(0, Number(item.quantity) || 0), 0);
    const demand = purchases.filter(item => matches(item.product_name, name)).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    const selectedId = card.dataset.selectedInventoryId || '';
    const selectedInventory = related.find(item => String(item.id) === String(selectedId));
    const listedPrice = Number(selectedInventory?.wholesale_price || related.find(item => Number(item.quantity) > 0)?.wholesale_price || related[0]?.wholesale_price || 0);
    const purchaseQuantity = Number(card.dataset.purchaseQuantity || .5);
    const unavailable = related.length > 0 && supply < .5;
    const details = ensureDetails(card);
    const values = details.querySelectorAll('b');
    values[0].textContent = listedPrice ? money(listedPrice) : '등록 없음';
    values[1].textContent = unavailable ? '거래 중지' : (listedPrice ? money(listedPrice) : '재고 없음');
    values[2].textContent = `${demand}kg`;
    values[3].textContent = `${supply}kg`;
    const totalPrice = listedPrice * purchaseQuantity;
    const price = card.querySelector('.price strong');
    if (price && listedPrice && !unavailable) price.textContent = money(totalPrice);
    const change = card.querySelector('.price .up, .price .down');
    if (change) {
      change.textContent = unavailable ? '거래 중지' : (related.length ? '실제 거래 기준' : '등록 재고 없음');
      change.className = unavailable ? 'supply-empty' : 'up';
    }
    const bar = card.querySelector('.price-bar i');
    if (bar) bar.style.width = related.length ? `${unavailable ? 0 : Math.max(18, Math.min(92, 30 + supply * 5))}%` : '0%';
  }

  async function refresh() {
    const purchases = await loadPurchases();
    document.querySelectorAll('.price-card').forEach(card => updateCard(card, purchases));
  }

  new MutationObserver(refresh).observe(document.querySelector('.market-grid'), { childList: true });
  window.addEventListener('inventory-refreshed', refresh);
  window.addEventListener('catalog-price-selection-changed', refresh);
  refresh();
  setInterval(refresh, 5000);
})();
