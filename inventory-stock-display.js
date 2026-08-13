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
      let priceChoices = card.querySelector('.price-choices');
      if (!priceChoices) { priceChoices = document.createElement('label'); priceChoices.className = 'price-choices'; stock.after(priceChoices); }
      const previousId = card.dataset.selectedInventoryId || '';
      const selectedItem = available.find(item => String(item.id) === previousId) || lowest;
      card.dataset.selectedInventoryId = selectedItem ? String(selectedItem.id) : '';
      priceChoices.innerHTML = selectedItem ? `구매 가격 선택<select class="seafood-price-select">${available.map(item => `<option value="${item.id}" ${String(item.id) === String(selectedItem.id) ? 'selected' : ''}>${money(item.wholesale_price)}/kg · 재고 ${Number(item.quantity).toLocaleString()}kg · ${item.location || '부산'}</option>`).join('')}</select>` : '';
      let quantityChoice = card.querySelector('.catalog-quantity');
      if (!quantityChoice) { quantityChoice = document.createElement('label'); quantityChoice.className = 'catalog-quantity'; priceChoices.after(quantityChoice); }
      const previousQuantity = Number(card.dataset.purchaseQuantity || .5);
      const purchaseQuantity = selectedItem ? Math.min(Math.max(.5, previousQuantity), Number(selectedItem.quantity)) : .5;
      card.dataset.purchaseQuantity = String(purchaseQuantity);
      quantityChoice.innerHTML = selectedItem ? `구매량 (kg)<input class="catalog-quantity-input" type="number" min="0.5" max="${Number(selectedItem.quantity)}" step="0.5" value="${purchaseQuantity}" inputmode="decimal">` : '';
      const price = card.querySelector('.price strong'), button = card.querySelector('.add-cart'); if (!button) return;
      if (!selectedItem) { if (price) price.textContent = '재고 없음'; button.disabled = true; button.innerHTML = '거래 중지 <b>—</b>'; button.onclick = null; }
      else { if (price) price.textContent = money(selectedItem.wholesale_price); button.disabled = false; button.innerHTML = `${purchaseQuantity}kg 장바구니 담기 <b>+</b>`; }
    });
    const grid = document.querySelector('.market-grid');
    if (grid) {
      const cards = [...grid.querySelectorAll('.catalog-price')];
      cards.forEach((card, index) => { if (!card.dataset.catalogOrder) card.dataset.catalogOrder = String(index); });
      const sorted = [...cards].sort((a, b) => Number(a.classList.contains('inventory-sold-out')) - Number(b.classList.contains('inventory-sold-out')) || Number(a.dataset.catalogOrder) - Number(b.dataset.catalogOrder));
      if (sorted.some((card, index) => card !== cards[index])) sorted.forEach(card => grid.appendChild(card));
    }
  }
  document.addEventListener('change', event => { if (event.target.matches('.seafood-state-select,.seafood-process-select')) { const card = event.target.closest('.catalog-price'); if (card) { card.dataset.selectedInventoryId = ''; card.dataset.purchaseQuantity = '.5'; } updateCatalogStock(); } if (event.target.matches('.seafood-price-select')) { const card = event.target.closest('.catalog-price'); if (card) { card.dataset.selectedInventoryId = event.target.value; card.dataset.purchaseQuantity = '.5'; updateCatalogStock(); } } if (event.target.matches('.catalog-quantity-input')) { const card = event.target.closest('.catalog-price'), max = Number(event.target.max); if (card) { const value = Math.min(max, Math.max(.5, Math.round(Number(event.target.value || .5) * 2) / 2)); card.dataset.purchaseQuantity = String(value); updateCatalogStock(); } } });
  document.addEventListener('click', event => { const button = event.target.closest('.catalog-price .add-cart'); if (!button || button.disabled) return; event.preventDefault(); event.stopImmediatePropagation(); const card = button.closest('.catalog-price'); window.addCatalogCart?.(card?.dataset.product, { state: card?.querySelector('.seafood-state-select')?.value || '', process: card?.querySelector('.seafood-process-select')?.value || '', inventoryId: card?.dataset.selectedInventoryId || '', quantity: Number(card?.dataset.purchaseQuantity || .5) }); }, true);
  window.addEventListener('inventory-refreshed', updateCatalogStock); window.addEventListener('catalog-rendered', updateCatalogStock);
  new MutationObserver(updateCatalogStock).observe(document.querySelector('.market-grid'), { childList: true }); setInterval(updateCatalogStock, 1000); updateCatalogStock();
})();
