(() => {
  const heading=document.querySelector('#market');if(!heading)return;
  const panel=document.createElement('div');panel.className='market-featured';heading.after(panel);
  const getOrders=()=>{try{return JSON.parse(localStorage.getItem('yongwang-orders'))||[]}catch{return []}};
  function refreshFeatured(){const totals={};getOrders().forEach(order=>(order.items||[]).forEach(item=>{totals[item.name]=(totals[item.name]||0)+Number(item.quantity||0)}));const winner=Object.entries(totals).sort((a,b)=>b[1]-a[1])[0];if(!winner){panel.innerHTML='<span class="featured-label">TODAY\'S FEATURED</span><strong>아직 주문 데이터가 없습니다</strong><small>첫 주문이 들어오면 대표품목이 자동 선정됩니다.</small>';return}const [name,amount]=winner;panel.innerHTML=`<span class="featured-label">TODAY\'S FEATURED</span><div class="featured-main"><i>★</i><span><small>주문량 기준 오늘의 대표품목</small><strong>${name}</strong></span><b>누적 주문 <em>${amount}개</em></b></div>`;document.querySelectorAll('.price-card').forEach(card=>{card.classList.toggle('order-featured',card.querySelector('h3')?.textContent.trim()===name)})}
  const originalOrder=window.placeOrder;if(typeof originalOrder==='function')window.placeOrder=function(){originalOrder();setTimeout(refreshFeatured,0)};refreshFeatured();
})();
