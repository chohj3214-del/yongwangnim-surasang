(() => {
  const inventoryKey='yongwang-seller-inventory';
  const readInventory=()=>{try{return JSON.parse(localStorage.getItem(inventoryKey))||[]}catch{return []}};
  const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
  const renderSellerListings=()=>{
    const grid=document.querySelector('.market-grid');if(!grid)return;
    grid.querySelectorAll('.seller-listing-card').forEach(card=>card.remove());
    readInventory().forEach((item,index)=>{
      const price=Number(item.price)||0;
      const name=item.display||item.type||'판매자 등록 수산물';
      const card=document.createElement('article');
      card.className='price-card seller-listing-card';
      card.dataset.liveReady='1';
      card.dataset.product=name;
      card.innerHTML=`<div class="card-top"><span class="pill seller-pill">판매자 등록</span><span class="origin">${escapeHtml(item.location||'등록 장소 미입력')}</span></div><div class="product-image seller-product-art"></div><h3>${escapeHtml(name)}</h3><p>${escapeHtml(item.owner||'판매자')} · 재고 ${escapeHtml(item.quantity||'')} ${escapeHtml(item.unit||'')}</p><div class="seller-price-box"><span>판매자 등록 도매가</span><strong>₩ ${price.toLocaleString()}</strong><small>등록 가격 그대로 판매</small></div><button class="add-cart" onclick="addCart('${String(name).replace(/'/g,"\\'")}',${price})">이 가격으로 구매하기 <b>+</b></button></article>`;
      grid.prepend(card);
    });
  };
  renderSellerListings();
  setInterval(renderSellerListings,1200);
})();
