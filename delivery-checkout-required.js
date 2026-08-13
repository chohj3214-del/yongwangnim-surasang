(() => {
  const key='yongwang-delivery-selection';
  const originalPlaceOrder=window.placeOrder;
  window.placeOrder=()=>{
    const selected=localStorage.getItem(key);
    if(!selected){toast('구매 전에 공동 냉장배송 일정을 선택해주세요.');openModal('route');return}
    return originalPlaceOrder();
  };
})();
