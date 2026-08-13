(() => {
  const normalize = value => String(value || '').replace(/\s/g, '');
  const matching = (name, inventory) => inventory.filter(item => normalize(item.product_name).includes(normalize(name)));
  const money = value => `₩ ${Number(value || 0).toLocaleString()}`;
  function updateCatalogStock() {
    const inventory = Array.isArray(window.approvedInventorySnapshot) ? window.approvedInventorySnapshot : [];
    document.querySelectorAll('.market-grid .catalog-price').forEach(card => {
      const name = card.dataset.product || card.querySelector('h3')?.textContent.trim(); if (!name) return;
      const items = matching(name, inventory), total = items.reduce((sum, item) => sum + Math.max(0, Number(item.quantity) || 0), 0);
      const available = items.filter(item => Number(item.quantity) >= .5).sort((a, b) => Number(a.wholesale_price) - Number(b.wholesale_price)), lowest = available[0];
      let stock = card.querySelector('.catalog-stock'); if (!stock) { stock = document.createElement('p'); stock.className = 'catalog-stock'; card.querySelector('h3')?.after(stock); }
      stock.textContent = total >= .5 ? `판매자 재고 합산 ${total.toLocaleString()}kg · ${available.length}건` : '승인된 판매 재고 없음 · 거래 중지';
      const soldOut = total < .5;
      card.classList.toggle('inventory-sold-out', soldOut);
      let soldOutLabel = card.querySelector('.sold-out-label');
      if (soldOut && !soldOutLabel) { soldOutLabel = document.createElement('b'); soldOutLabel.className = 'sold-out-label'; soldOutLabel.textContent = 'SOLD OUT'; card.append(soldOutLabel); }
      if (!soldOut && soldOutLabel) soldOutLabel.remove();
      const price = card.querySelector('.price strong'), button = card.querySelector('.add-cart'); if (!button) return;
      if (!lowest) { if (price) price.textContent = '재고 없음'; button.disabled = true; button.innerHTML = '거래 중지 <b>—</b>'; button.onclick = null; }
      else { if (price) price.textContent = money(lowest.wholesale_price); button.disabled = false; button.innerHTML = '0.5kg 장바구니 담기 <b>+</b>'; button.onclick = () => window.addCatalogCart?.(name); }
    });
  }
  document.addEventListener('click', event => { const button = event.target.closest('.catalog-price .add-cart'); if (!button || button.disabled) return; event.preventDefault(); event.stopImmediatePropagation(); window.addCatalogCart?.(button.closest('.catalog-price')?.dataset.product); }, true);
  window.addEventListener('inventory-refreshed', updateCatalogStock); window.addEventListener('catalog-rendered', updateCatalogStock);
  new MutationObserver(updateCatalogStock).observe(document.querySelector('.market-grid'), { childList: true }); setInterval(updateCatalogStock, 1000); updateCatalogStock();
})();
