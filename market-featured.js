(() => {
  const heading = document.querySelector('#market');
  if (!heading) return;
  const panel = document.createElement('div'); panel.className = 'market-featured'; heading.after(panel);
  const getOrders = () => { try { return JSON.parse(localStorage.getItem('yongwang-orders')) || []; } catch { return []; } };
  const normalize = value => String(value || '').replace(/\s/g, '');
  const productName = value => String(value || '').split('·')[0].trim();
  function refreshFeatured() {
    const inventory = Array.isArray(window.approvedInventorySnapshot) ? window.approvedInventorySnapshot : [];
    const available = new Set(inventory.filter(item => Number(item.quantity) >= .5).map(item => {
      const catalog = (window.marketCatalogItems || []).find(([, name]) => normalize(item.product_name).includes(normalize(name)));
      return catalog ? catalog[1] : productName(item.product_name);
    }));
    const totals = {};
    getOrders().forEach(order => (order.items || []).forEach(item => {
      const name = productName(item.name);
      if (available.has(name)) totals[name] = (totals[name] || 0) + Number(item.quantity || 0);
    }));
    const winner = Object.entries(totals).sort((a, b) => b[1] - a[1])[0];
    document.querySelectorAll('.price-card').forEach(card => card.classList.remove('order-featured'));
    if (!winner) { panel.innerHTML = '<span class="featured-label">TODAY\'S FEATURED</span><strong>구매 가능한 대표품목이 없습니다</strong><small>승인된 재고가 등록되면 대표품목을 표시합니다.</small>'; return; }
    const [name, amount] = winner;
    panel.innerHTML = `<span class="featured-label">TODAY'S FEATURED</span><div class="featured-main"><i>★</i><span><small>구매 가능한 재고 중 주문량 기준 대표품목</small><strong>${name}</strong></span><b>누적 주문 <em>${amount * .5}kg</em></b></div>`;
    document.querySelectorAll('.price-card').forEach(card => card.classList.toggle('order-featured', card.querySelector('h3')?.textContent.trim() === name));
  }
  window.addEventListener('inventory-refreshed', refreshFeatured);
  window.addEventListener('catalog-rendered', refreshFeatured);
  const originalOrder = window.placeOrder;
  if (typeof originalOrder === 'function') window.placeOrder = function () { const result = originalOrder(); setTimeout(refreshFeatured, 0); return result; };
  setInterval(refreshFeatured, 5000); refreshFeatured();
})();
