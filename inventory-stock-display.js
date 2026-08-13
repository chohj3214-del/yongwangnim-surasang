(() => {
  const normalize = value => String(value || '').replace(/\s/g, '');
  const matching = (name, inventory) => inventory.filter(item => normalize(item.product_name).includes(normalize(name)));
  const money = value => `₩ ${Number(value || 0).toLocaleString()}`;
  const options = (items, key) => [...new Set(items.map(item => String(item[key] || '').trim()).filter(Boolean))];
  function filterItems(card, items) {
    const state = card.querySelector('.seafood-state-select')?.value || '';
    const process = card.querySelector('.seafood-process-select')?.value || '';
    return items.filter(item => (!state || item.product_state === state) && (!process || item.processing_type === process));
  }
  function updateCatalogStock() {
    const inventory = Array.isArray(window.approvedInventorySnapshot) ? window.approvedInventorySnapshot : [];
    document.querySelectorAll('.market-grid .catalog-price').forEach(card => {
      const name = card.dataset.product || card.querySelector('h3')?.textContent.trim(); if (!name) return;
      const items = matching(name, inventory), selected = filterItems(card, items);
      let choices = card.querySelector('.seafood-choices');
      if (!choices) { choices = document.createElement('div'); choices.className = 'seafood-choices'; card.querySelector('h3')?.after(choices); }
      const states = options(items, 'product_state'), processes = options(items, 'processing_type');
      const oldState = card.querySelector('.seafood-state-select')?.value || '', oldProcess = card.querySelector('.seafood-process-select')?.value || '';
      choices.innerHTML = `<label>상태<select class="seafood-state-select"><option value="">전체</option>${states.map(value => `<option ${value === oldState ? 'selected' : ''}>${value}</option>`).join('')}</select></label><label>처리<select class="seafood-process-select"><option value="">전체</option>${processes.map(value => `<option ${value === oldProcess ? 'selected' : ''}>${value}</option>`).join('')}</select></label>`;
      const total = selected.reduce((sum, item) => sum + Math.max(0, Number(item.quantity) || 0), 0);
      const available = selected.filter(item => Number(item.quantity) >= .5).sort((a, b) => Number(a.wholesale_price) - Number(b.wholesale_price)), lowest = available[0];
      let stock = card.querySelector('.catalog-stock'); if (!stock) { stock = document.createElement('p'); stock.className = 'catalog-stock'; choices.after(stock); }
      stock.textContent = total >= .5 ? `선택 재고 ${total.toLocaleString()}kg · ${available.length}건` : '선택 조건의 승인 재고 없음 · 거래 중지';
      const soldOut = total < .5;
      card.classList.toggle('inventory-sold-out', soldOut);
      let soldOutLabel = card.querySelector('.sold-out-label');
      if (soldOut && !soldOutLabel) { soldOutLabel = document.createElement('b'); soldOutLabel.className = 'sold-out-label'; soldOutLabel.textContent = 'SOLD OUT'; card.append(soldOutLabel); }
      if (!soldOut && soldOutLabel) soldOutLabel.remove();
      const price = card.querySelector('.price strong'), button = card.querySelector('.add-cart'); if (!button) return;
      if (!lowest) { if (price) price.textContent = '재고 없음'; button.disabled = true; button.innerHTML = '거래 중지 <b>—</b>'; button.onclick = null; }
      else { if (price) price.textContent = money(lowest.wholesale_price); button.disabled = false; button.innerHTML = '0.5kg 장바구니 담기 <b>+</b>'; button.onclick = () => window.addCatalogCart?.(name, { state: oldState, process: oldProcess }); }
    });
    const grid = document.querySelector('.market-grid');
    if (grid) {
      const cards = [...grid.querySelectorAll('.catalog-price')];
      cards.forEach((card, index) => { if (!card.dataset.catalogOrder) card.dataset.catalogOrder = String(index); });
      const sorted = [...cards].sort((a, b) => Number(a.classList.contains('inventory-sold-out')) - Number(b.classList.contains('inventory-sold-out')) || Number(a.dataset.catalogOrder) - Number(b.dataset.catalogOrder));
      if (sorted.some((card, index) => card !== cards[index])) sorted.forEach(card => grid.appendChild(card));
    }
  }
  document.addEventListener('change', event => { if (event.target.matches('.seafood-state-select,.seafood-process-select')) updateCatalogStock(); });
  document.addEventListener('click', event => { const button = event.target.closest('.catalog-price .add-cart'); if (!button || button.disabled) return; event.preventDefault(); event.stopImmediatePropagation(); const card = button.closest('.catalog-price'); window.addCatalogCart?.(card?.dataset.product, { state: card?.querySelector('.seafood-state-select')?.value || '', process: card?.querySelector('.seafood-process-select')?.value || '' }); }, true);
  window.addEventListener('inventory-refreshed', updateCatalogStock); window.addEventListener('catalog-rendered', updateCatalogStock);
  new MutationObserver(updateCatalogStock).observe(document.querySelector('.market-grid'), { childList: true }); setInterval(updateCatalogStock, 1000); updateCatalogStock();
})();
