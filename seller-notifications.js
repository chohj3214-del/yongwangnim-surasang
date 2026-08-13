(() => {
  const URL = 'https://khuuazwwxlggsfvvofsu.supabase.co/rest/v1/seller_notifications';
  const KEY = 'sb_publishable_Ny50rb2ZsvuwZ_bR9d1uHw_6dxXgTdO';
  const headers = { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' };
  const isSeller = () => { try { return users()[currentUser()]?.role === 'seller'; } catch { return false; } };
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
  const formatDate = value => new Intl.DateTimeFormat('ko-KR', { month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit' }).format(new Date(value));

  async function loadNotifications() {
    const seller = currentUser();
    if (!seller || !isSeller()) return [];
    try {
      const response = await fetch(URL + '?seller_name=eq.' + encodeURIComponent(seller) + '&order=created_at.desc', { headers });
      return response.ok ? response.json() : [];
    } catch (error) {
      console.warn('Seller notifications unavailable', error);
      return [];
    }
  }

  async function renderBadge() {
    if (!isSeller()) return;
    const list = await loadNotifications(), unread = list.filter(item => !item.read_at).length;
    const button = document.getElementById('profile-button');
    if (!button || !isSeller()) return;
    button.classList.toggle('has-sale-alert', unread > 0);
    button.textContent = currentUser() + (unread ? ` · 판매 ${unread}` : ' · 판매자');
  }

  window.openSellerAccount = async () => {
    const seller = currentUser(), account = users()[seller] || {}, list = await loadNotifications();
    const notices = list.length ? list.map(item => `<article class="${item.read_at ? '' : 'unread'}"><i>₩</i><div><b>${esc(item.product_name)} ${Number(item.quantity)}kg 판매</b><small>판매 완료 · ${formatDate(item.created_at)}</small></div></article>`).join('') : '<p class="empty-sale-alert">아직 판매 알림이 없습니다.</p>';
    showModal(`<div class="seller-account-panel"><span class="seller-account-label">SELLER ACCOUNT</span><h2>${esc(seller)} 판매자</h2><p>회원정보와 판매 알림을 한곳에서 확인할 수 있습니다.</p><div class="address-card"><strong>등록 배송지</strong><span>${esc(account.address || '주소 미등록')}</span></div><label>주소 변경</label><input id="account-address" value="${esc(account.address || '')}"><button class="submit" onclick="saveAddress()">주소 저장</button><div class="seller-alert-heading"><h3>판매 알림</h3><span>${list.filter(item => !item.read_at).length}건 미확인</span></div><div class="sale-notification-list">${notices}</div>${list.some(item => !item.read_at) ? '<button class="seller-read-button" onclick="markSellerNotificationsRead()">모두 확인</button>' : ''}<button class="logout-button" onclick="logout()">로그아웃</button></div>`);
  };

  window.openSellerNotifications = window.openSellerAccount;
  window.markSellerNotificationsRead = async () => {
    const seller = currentUser();
    try { await fetch(URL + '?seller_name=eq.' + encodeURIComponent(seller) + '&read_at=is.null', { method:'PATCH', headers:{ ...headers, Prefer:'return=minimal' }, body:JSON.stringify({ read_at:new Date().toISOString() }) }); } catch (error) { console.warn('Notification update failed', error); }
    toast('판매 알림을 확인했습니다.'); await renderBadge(); await openSellerAccount();
  };

  const originalOpenAccount = window.openAccount;
  window.openAccount = () => isSeller() ? openSellerAccount() : originalOpenAccount();
  window.addEventListener('storage', renderBadge);
  document.addEventListener('login-complete', renderBadge);
  setInterval(renderBadge, 10000);
  setTimeout(renderBadge, 400);
})();
