(() => {
  const URL = 'https://khuuazwwxlggsfvvofsu.supabase.co/rest/v1/market_accounts';
  const KEY = 'sb_publishable_Ny50rb2ZsvuwZ_bR9d1uHw_6dxXgTdO';
  const headers = { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' };
  const normalize = name => (name || '').trim().replace(/\s+/g, ' ');
  const escapeHtml = value => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);

  async function findAccount(name) {
    const response = await fetch(URL + '?select=display_name,is_deleted&display_name=eq.' + encodeURIComponent(name), { headers });
    if (!response.ok) throw new Error('account lookup failed');
    const accounts = await response.json();
    return accounts[0] || null;
  }

  async function syncAccount(name, role) {
    if (!name) return;
    await fetch(URL + '?on_conflict=display_name', {
      method: 'POST', headers: { ...headers, Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ display_name: name, role: role || 'consumer' })
    });
  }

  const localSignup = window.signup;
  window.signup = async () => {
    const name = normalize(document.getElementById('signup-name')?.value);
    if (!name) return localSignup();
    try {
      const account = await findAccount(name);
      if (account) {
        toast(account.is_deleted ? '삭제된 계정입니다. 관리자에게 문의해주세요.' : '이미 사용 중인 이름입니다. 로그인해주세요.');
        return;
      }
    } catch (error) { console.warn('Account lookup failed', error); }
    const role = document.querySelector('input[name="signup-role"]:checked')?.value || 'consumer';
    localSignup();
    setTimeout(async () => {
      if (name && users()[name]) {
        try { await syncAccount(name, role); } catch (error) { console.warn('Account sync failed', error); }
      }
    }, 0);
  };

  const localLogin = window.login;
  window.login = async () => {
    const name = normalize(document.getElementById('login-name')?.value);
    if (name && name !== 'admin') {
      try {
        const account = await findAccount(name);
        if (account?.is_deleted) { toast('삭제된 계정입니다. 관리자에게 문의해주세요.'); return; }
      } catch (error) { console.warn('Account lookup failed', error); }
    }
    localLogin();
  };

  syncAccount('admin', 'admin').catch(error => console.warn('Admin sync failed', error));

  const localAccountView = window.openAccount;
  window.openAccount = async () => {
    if (currentUser() !== 'admin') { localAccountView(); return; }
    showModal('<h2>관리자 회원 현황</h2><p>공유 데이터베이스의 회원 목록을 불러오는 중입니다.</p>');
    try {
      const response = await fetch(URL + '?select=display_name,role,created_at,is_deleted&is_deleted=eq.false&order=created_at.desc', { headers });
      if (!response.ok) throw new Error('load failed');
      const accounts = await response.json();
      const sellers = accounts.filter(account => account.role === 'seller').length;
      const consumers = accounts.filter(account => account.role === 'consumer').length;
      const entries = accounts.map(account => {
        const name = escapeHtml(account.display_name);
        const role = account.role === 'admin' ? '관리자' : account.role === 'seller' ? '판매자' : '구매자';
        const deleteButton = account.role === 'admin' ? '' : `<button class="admin-account-delete" onclick="deleteSharedAccount(${JSON.stringify(account.display_name)})">계정 삭제</button>`;
        return `<article><i>${role}</i><strong>${name}</strong><small>가입일 ${new Date(account.created_at).toLocaleDateString('ko-KR')}</small>${deleteButton}</article>`;
      }).join('') || '<p>등록된 회원이 없습니다.</p>';
      showModal(`<h2>관리자 회원 현황</h2><p>공유 데이터베이스에 등록된 회원입니다.</p><div class="admin-summary"><span>총 회원<b>${accounts.length}명</b></span><span>판매자<b>${sellers}명</b></span><span>구매자<b>${consumers}명</b></span></div><div class="member-list">${entries}</div><button class="logout-button" onclick="logout()">관리자 로그아웃</button>`);
    } catch (error) {
      console.warn('Shared account list unavailable', error);
      localAccountView();
      toast('공유 회원 목록 대신 이 기기의 관리자 정보를 표시합니다.');
    }
  };

  window.deleteSharedAccount = async name => {
    if (!confirm(`${name} 계정을 삭제할까요?`)) return;
    try {
      const response = await fetch(URL + '?display_name=eq.' + encodeURIComponent(name), {
        method: 'PATCH', headers: { ...headers, Prefer: 'return=minimal' }, body: JSON.stringify({ is_deleted: true })
      });
      if (!response.ok) throw new Error('delete failed');
      toast('계정이 삭제되었습니다.');
      openAccount();
    } catch (error) { toast('계정 삭제에 실패했습니다.'); }
  };
})();
