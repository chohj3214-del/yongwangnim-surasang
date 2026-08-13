(() => {
  const normalize = value => String(value || '').replace(/\s/g, '');

  function updateCatalogStock() {
    const inventory = Array.isArray(window.approvedInventorySnapshot) ? window.approvedInventorySnapshot : [];
    document.querySelectorAll('.market-grid .all-price').forEach(card => {
      card.dataset.liveReady = '1';
      const name = card.querySelector('h3')?.textContent.trim();
      if (!name) return;
      const matches = inventory.filter(item => normalize(item.product_name).includes(normalize(name)));
      const availableItems = matches.filter(item => Number(item.quantity) > 0);
      const total = matches.reduce((sum, item) => sum + Math.max(0, Number(item.quantity) || 0), 0);
      let stock = card.querySelector('.catalog-stock');
      if (!stock) {
        stock = document.createElement('p');
        stock.className = 'catalog-stock';
        card.querySelector('h3')?.after(stock);
      }
      stock.textContent = total > 0 ? `실시간 재고 ${total}kg` : '실시간 재고 0kg · 거래 중지';
      const button = card.querySelector('.add-cart');
      card.classList.toggle('inventory-sold-out', total <= 0);
      if (!button) return;
      if (total <= 0) {
        button.disabled = true;
        button.innerHTML = '재고 없음 <b>—</b>';
        button.onclick = null;
      } else {
        const item = availableItems[0];
        const price = Number(item.wholesale_price) || 0;
        const priceNode = card.querySelector('.price strong');
        if (priceNode) priceNode.textContent = `₩ ${price.toLocaleString()}`;
        button.disabled = false;
        button.innerHTML = '장바구니 담기 <b>+</b>';
        button.onclick = () => addRemoteCart(item.id, name, price, Number(item.quantity));
      }
    });
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('.all-price .add-cart');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const card = button.closest('.all-price');
    const name = card?.querySelector('h3')?.textContent.trim();
    const inventory = Array.isArray(window.approvedInventorySnapshot) ? window.approvedInventorySnapshot : [];
    const item = inventory.find(entry => normalize(entry.product_name).includes(normalize(name)) && Number(entry.quantity) > 0);
    if (!item) { toast('재고가 없어 장바구니에 담을 수 없습니다.'); return; }
    addRemoteCart(item.id, name, Number(item.wholesale_price), Number(item.quantity));
  }, true);

  new MutationObserver(updateCatalogStock).observe(document.querySelector('.market-grid'), { childList: true });
  setInterval(updateCatalogStock, 1000);
  updateCatalogStock();
})();
