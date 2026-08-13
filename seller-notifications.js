(() => {
  const URL = 'https://khuuazwwxlggsfvvofsu.supabase.co/rest/v1/seller_notifications';
  const KEY = 'sb_publishable_Ny50rb2ZsvuwZ_bR9d1uHw_6dxXgTdO';
  const headers = { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' };
  const isSeller = () => { try { return users()[currentUser()]?.role === 'seller'; } catch { return false; } };
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const date = value => new Intl.DateTimeFormat('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
  async function load() {
    const seller = currentUser();
    if (!seller || !isSeller()) return [];
    const response = await fetch(URL + '?seller_name=eq.' + encodeURIComponent(seller) + '&order=created_at.desc', { headers });
    if (!response.ok) return [];
    return response.json();
  }
  async function renderBadge() {
    const list = await load(), unread = list.filter(item => !item.read_at).length;
    const button = document.getElementById('profile-button');
    if (!button || !isSeller()) return;
    button.dataset.notificationCount = unread;
    button.classList.toggle('has-sale-alert', unread > 0);
    button.textContent = currentUser() + (unread ? ` · 판매 ${unread}` : '');
  }
  window.openSellerNotifications = async () => {
    const list = await load();
    if (!list.length) { showModal('<h2>판매 알림</h2><p>아직 새 판매 알림이 없습니다.</p>'); return; }
    showModal(`<h2>판매 알림</h2><p>구매가 완료된 상품을 확인하세요.</p><div class="sale-notification-list">${list.map(item => `<article class="${item.read_at ? '' : 'unread'}"><i>✓</i><div><b>${esc(item.product_name)} ${item.quantity}kg 판매</b><small>구매자 ${esc(item.buyer_name)} · ${date(item.created_at)}</small></div></article>`).join('')}</div><button class="submit" onclick="markSellerNotificationsRead()">확인했습니다</button>`);
  };
  window.markSellerNotificationsRead = async () => {
    const seller = currentUser();
    await fetch(URL + '?seller_name=eq.' + encodeURIComponent(seller) + '&read_at=is.null', { method: 'PATCH', headers: { ...headers, Prefer: 'return=minimal' }, body: JSON.stringify({ read_at: new Date().toISOString() }) });
    toast('판매 알림을 확인했습니다.'); closeModal(); renderBadge();
  };
  const originalOpenAccount = window.openAccount;
  window.openAccount = () => { if (isSeller()) { window.openSellerNotifications(); return; } return originalOpenAccount(); };
  window.addEventListener('storage', renderBadge); document.addEventListener('login-complete', renderBadge); setInterval(renderBadge, 10000); setTimeout(renderBadge, 400);
})();
