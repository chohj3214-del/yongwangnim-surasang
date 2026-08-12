(() => {
  const roleName=role=>role==='seller'?'판매자':'소비자';
  const getUser=()=>typeof currentUser==='function'?currentUser():'';
  const getRole=()=>{const name=getUser(),all=typeof users==='function'?users():{};return all[name]?.role||'consumer'};
  const refreshRoleUI=()=>{
    const name=getUser(),seller=getRole()==='seller',register=document.querySelector('.seller-register');
    const profile=document.getElementById('profile-button');
    if(profile)profile.textContent=name?`${name} · ${roleName(getRole())}`:'로그인';
    if(register){register.classList.toggle('role-hidden',!seller);let note=document.querySelector('.consumer-inventory-note');if(!seller){if(!note){note=document.createElement('section');note.className='consumer-inventory-note';note.innerHTML='<div><span>CONSUMER SHOPPING</span><h2>오늘 가장 신선한 수산물을<br><em>비교하고 주문하세요</em></h2><p>실시간 시세와 산지·신선도 정보를 확인한 뒤 공동 냉장배송으로 받아보세요.</p></div><button onclick="document.querySelector(\'#market\').scrollIntoView({behavior:\'smooth\'})">실시간 시세 보러가기 →</button>';register.before(note)}}else note?.remove()}
  };
  const baseSignup=window.signup;
  window.openSignup=()=>showModal(`<h2>회원가입</h2><p>이용 목적에 맞는 역할을 선택해 주세요.</p><div class="login-tabs"><button onclick="openLogin()">로그인</button><b>회원가입</b></div><label>이용 역할</label><div class="role-options"><label><input type="radio" name="signup-role" value="consumer" checked><span><b>구매자</b><small>시세 비교 · 주문 · 공동배송</small></span></label><label><input type="radio" name="signup-role" value="seller"><span><b>판매자</b><small>수산물 재고 · 도매가 등록</small></span></label></div><label>이름 또는 사업자명</label><input id="signup-name" placeholder="상호 또는 이름"><label>비밀번호</label><input id="signup-password" type="password" placeholder="4자 이상 비밀번호"><label>배송 주소</label><input id="signup-address" placeholder="예: 부산광역시 부산진구 서면로 21"><button class="submit" onclick="signup()">회원가입하기</button>`);
  window.signup=()=>{const name=document.getElementById('signup-name').value.trim().replace(/\s+/g,' '),password=document.getElementById('signup-password').value,address=document.getElementById('signup-address').value.trim(),role=document.querySelector('input[name="signup-role"]:checked')?.value,all=users();if(!name||password.length<4||!address){toast('이름, 4자 이상 비밀번호, 주소를 모두 입력해주세요.');return}if(Object.keys(all).some(existing=>existing.trim().replace(/\s+/g,' ')===name)){toast('이미 사용 중인 이름입니다. 로그인해주세요.');return}all[name]={password,address,role};write('yongwang-users',all);toast('회원가입이 완료됐어요. 로그인해주세요.');openLogin()};
  const baseLogin=window.login;
  window.login=()=>{baseLogin();setTimeout(refreshRoleUI,0)};
  const baseLogout=window.logout;
  window.logout=()=>{baseLogout();setTimeout(refreshRoleUI,0)};
  refreshRoleUI();
})();
