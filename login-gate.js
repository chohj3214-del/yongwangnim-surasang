(() => {
  const applyGate=()=>document.body.classList.toggle('login-required',!currentUser());
  const originalLogin=window.login;
  window.login=()=>{originalLogin();setTimeout(applyGate,0)};
  const originalLogout=window.logout;
  window.logout=()=>{originalLogout();setTimeout(()=>{applyGate();openLogin()},0)};
  applyGate();
  if(!currentUser())setTimeout(openLogin,120);
})();
