(() => {
  const previousLogout = window.logout;
  window.logout = () => {
    try { previousLogout?.(); } catch (error) { console.warn('Normal logout failed', error); }
    localStorage.removeItem('yongwang-current-user');
    localStorage.removeItem('yongwang-current-cart');
    document.body.classList.add('login-required');
    if (typeof updateAccountButton === 'function') updateAccountButton();
    if (typeof updateCartBadge === 'function') updateCartBadge();
    if (typeof closeModal === 'function') closeModal();
    setTimeout(() => window.openLogin?.(), 0);
  };
})();
