(() => {
  const baseNotifications = window.openSellerNotifications;
  window.openSellerNotifications = async (...args) => {
    try { await baseNotifications?.(...args); }
    catch (error) { console.warn('Seller notification load failed', error); showModal('<h2>판매 알림</h2><p>알림을 불러오지 못했습니다.</p>'); }
    const modal = document.getElementById('modal-content');
    if (!modal || modal.querySelector('.seller-logout-button')) return;
    const button = document.createElement('button'); button.className = 'logout-button seller-logout-button'; button.textContent = '로그아웃'; button.onclick = () => window.logout?.(); modal.append(button);
  };
})();
