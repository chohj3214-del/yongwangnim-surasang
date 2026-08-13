(() => {
  const URL='https://khuuazwwxlggsfvvofsu.supabase.co/rest/v1/market_accounts';
  const KEY='sb_publishable_Ny50rb2ZsvuwZ_bR9d1uHw_6dxXgTdO';
  const headers={'apikey':KEY,'Authorization':'Bearer '+KEY,'Content-Type':'application/json'};
  const syncAccount=async(name,role)=>{if(!name)return;try{await fetch(URL+'?on_conflict=display_name',{method:'POST',headers:{...headers,'Prefer':'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({display_name:name,role:role||'consumer'})})}catch(error){console.warn('Account sync failed',error)}};
  const localSignup=window.signup;
  window.signup=()=>{const name=document.getElementById('signup-name')?.value.trim().replace(/\s+/g,' '),role=document.querySelector('input[name="signup-role"]:checked')?.value||'consumer';localSignup();setTimeout(()=>{if(name&&users()[name])syncAccount(name,role)},0)};
  syncAccount('admin','admin');
  const localAccountView=window.openAccount;
  window.openAccount=async()=>{if(currentUser()!=='admin'){localAccountView();return}showModal('<h2>관리자 회원 현황</h2><p>공유 데이터베이스의 회원 목록을 불러오는 중입니다.</p>');try{const response=await fetch(URL+'?select=display_name,role,created_at&order=created_at.desc',{headers});if(!response.ok)throw new Error('load failed');const accounts=await response.json();const sellers=accounts.filter(account=>account.role==='seller').length,consumers=accounts.filter(account=>account.role==='consumer').length;showModal(`<h2>관리자 회원 현황</h2><p>공유 데이터베이스에 등록된 회원입니다.</p><div class="admin-summary"><span>총 회원<b>${accounts.length}명</b></span><span>판매자<b>${sellers}명</b></span><span>구매자<b>${consumers}명</b></span></div><div class="member-list">${accounts.map(account=>`<article><i>${account.role==='admin'?'관리자':account.role==='seller'?'판매자':'구매자'}</i><strong>${account.display_name}</strong><small>가입 · ${new Date(account.created_at).toLocaleDateString('ko-KR')}</small></article>`).join('')||'<p>등록된 회원이 없습니다.</p>'}</div><button class="logout-button" onclick="logout()">관리자 로그아웃</button>`)}catch(error){showModal('<h2>관리자 회원 현황</h2><p>공유 회원 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p>')}};
})();
