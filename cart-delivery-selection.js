(() => {
  const key='yongwang-delivery-selection';
  const inject=()=>{const content=document.getElementById('modal-content');if(!content?.querySelector('.cart-total')||content.querySelector('.cart-delivery-selection'))return;const selected=localStorage.getItem(key),label=window.deliveryScheduleLabel?.(selected)||'선택된 일정이 없습니다.';const box=document.createElement('div');box.className='cart-delivery-selection';box.innerHTML=`<div><span>공동 냉장배송 일정</span><b>${label}</b></div><button onclick="openModal('route')">일정 선택</button>`;content.querySelector('.cart-total').before(box)};
  const originalOpenCart=window.openCart;window.openCart=()=>{originalOpenCart();setTimeout(inject,0)};
  document.addEventListener('delivery-schedule-selected',()=>{if(document.getElementById('modal').classList.contains('show'))setTimeout(()=>{const selected=localStorage.getItem(key),box=document.querySelector('.cart-delivery-selection');if(box)box.querySelector('b').textContent=window.deliveryScheduleLabel(selected)},0)});
})();
