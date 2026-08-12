(() => {
  window.removeOneFromMarketCart = name => {
    const item = cart.find(entry => entry.name === name);
    if (!item) { toast(name+'은(는) 장바구니에 없어요.'); return; }
    item.quantity -= 1;
    if (item.quantity < 1) cart = cart.filter(entry => entry.name !== name);
    if (typeof saveCart === 'function') saveCart();
    updateCartBadge();
    toast(name+' 수량을 1개 줄였어요.');
  };
  const addMinus = card => {
    if (card.querySelector('.market-cart-minus')) return;
    const product = card.querySelector('h3')?.textContent.trim();
    const addButton = card.querySelector('.add-cart');
    if (!product || !addButton) return;
    const minus = document.createElement('button');
    minus.type = 'button'; minus.className = 'market-cart-minus'; minus.textContent = '−';
    minus.setAttribute('aria-label', product+' 장바구니 수량 빼기');
    minus.addEventListener('click', () => window.removeOneFromMarketCart(product));
    const actions = document.createElement('div');
    actions.className = 'market-cart-actions';
    addButton.before(actions);
    actions.append(minus, addButton);
  };
  document.querySelectorAll('.price-card').forEach(addMinus);
  new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
    if (node.nodeType === 1 && node.classList.contains('price-card')) addMinus(node);
  }))).observe(document.querySelector('.market-grid'), {childList:true});
})();
