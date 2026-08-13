(() => {
  const isSeller = () => {
    const name = typeof currentUser === 'function' ? currentUser() : '';
    return Boolean(name && typeof users === 'function' && users()[name]?.role === 'seller');
  };

  const applySellerMode = () => document.body.classList.toggle('seller-mode', isSeller());
  const blocked = () => { toast('판매자 계정은 구매 기능을 이용하지 않습니다.'); return false; };

  const originalAddCart = window.addCart;
  window.addCart = (...args) => isSeller() ? blocked() : originalAddCart(...args);

  const originalRemoteCart = window.addRemoteCart;
  window.addRemoteCart = (...args) => isSeller() ? blocked() : originalRemoteCart(...args);

  const originalOpenCart = window.openCart;
  window.openCart = (...args) => isSeller() ? blocked() : originalOpenCart(...args);

  const originalPlaceOrder = window.placeOrder;
  window.placeOrder = (...args) => isSeller() ? blocked() : originalPlaceOrder(...args);

  const originalOpenOrders = window.openOrders;
  window.openOrders = (...args) => isSeller() ? blocked() : originalOpenOrders(...args);

  const originalOpenModal = window.openModal;
  window.openModal = (type, ...args) => isSeller() && type === 'route' ? blocked() : originalOpenModal(type, ...args);

  const originalSelectSchedule = window.selectDeliverySchedule;
  window.selectDeliverySchedule = (...args) => isSeller() ? blocked() : originalSelectSchedule(...args);

  const originalLogin = window.login;
  window.login = async (...args) => { const result = await originalLogin(...args); applySellerMode(); return result; };

  const originalAdminLogin = window.adminLogin;
  window.adminLogin = (...args) => { const result = originalAdminLogin(...args); applySellerMode(); return result; };

  const originalLogout = window.logout;
  window.logout = (...args) => { const result = originalLogout(...args); applySellerMode(); return result; };

  applySellerMode();
})();
