(() => {
  const key='yongwang-delivery-selection';
  const button=[...document.querySelectorAll('.quick-actions button')].find(item=>item.getAttribute('onclick')?.includes("openModal('route')"));
  if(!button)return;
  button.removeAttribute('onclick');
  const render=()=>{const selected=localStorage.getItem(key),label=window.deliveryScheduleLabel?.(selected)||'';if(selected){button.classList.add('has-delivery-selection');button.querySelector('b').textContent='×';button.querySelector('strong').textContent='공동배송 일정 취소';button.querySelector('small').textContent=label;button.onclick=()=>{if(confirm('선택한 공동배송 일정을 취소할까요?'))window.cancelDeliverySchedule(false)}}else{button.classList.remove('has-delivery-selection');button.querySelector('b').textContent='⌁';button.querySelector('strong').textContent='공동배송 일정 선택';button.querySelector('small').textContent='장바구니 주문에 적용할 시간을 선택하세요';button.onclick=()=>openModal('route')}};
  document.addEventListener('delivery-schedule-selected',render);document.addEventListener('delivery-schedule-cancelled',render);document.addEventListener('delivery-schedule-locked',render);render();
})();
