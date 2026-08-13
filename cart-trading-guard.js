(() => {
  const originalAddCart=window.addCart;
  window.addCart=(name,price)=>{
    const cards=[...document.querySelectorAll('.price-card')].filter(card=>card.querySelector('h3')?.textContent.trim()===name);
    const unavailable=cards.some(card=>card.classList.contains('inventory-sold-out')||card.querySelector('.supply-empty'));
    if(unavailable){toast('재고가 없어 거래 중지된 상품은 장바구니에 담을 수 없습니다.');return}
    return originalAddCart(name,price);
  };
  const originalRemoteAdd=window.addRemoteCart;
  window.addRemoteCart=(id,name,price,available)=>{if(Number(available)<=0){toast('재고가 없어 거래 중지된 상품은 장바구니에 담을 수 없습니다.');return}return originalRemoteAdd(id,name,price,available)};
})();
