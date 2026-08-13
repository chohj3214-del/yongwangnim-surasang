(() => {
  const schedules=[
    {id:'today-1100',day:'오늘',date:'8월 13일',time:'오전 11:00',route:'부산공동어시장 → 서면·부전',eta:'오후 12:05 도착',seats:2,cutoff:'오전 10:20 마감'},
    {id:'today-1400',day:'오늘',date:'8월 13일',time:'오후 2:00',route:'부산공동어시장 → 서면 → 해운대',eta:'오후 3:05 도착',seats:4,cutoff:'오후 1:20 마감'},
    {id:'today-1730',day:'오늘',date:'8월 13일',time:'오후 5:30',route:'감천항 → 남포·광안리',eta:'오후 6:30 도착',seats:6,cutoff:'오후 4:50 마감'},
    {id:'tomorrow-0730',day:'내일',date:'8월 14일',time:'오전 7:30',route:'부산공동어시장 → 전 지역',eta:'오전 9:10 도착',seats:8,cutoff:'내일 오전 6:50 마감'}
  ];
  const key='yongwang-delivery-bookings';
  const bookings=()=>{try{return JSON.parse(localStorage.getItem(key))||[]}catch{return []}};
  const booked=id=>bookings().includes(id);
  function card(schedule){return `<article class="schedule-card ${booked(schedule.id)?'booked':''}"><div class="schedule-day"><b>${schedule.day}</b><small>${schedule.date}</small></div><div class="schedule-time"><strong>${schedule.time}</strong><span>${schedule.eta}</span></div><div class="schedule-route"><b>${schedule.route}</b><small>마감 · ${schedule.cutoff}</small></div><div class="schedule-seat ${schedule.seats<=2?'urgent':''}"><b>${booked(schedule.id)?'예약 완료':schedule.seats+'자리 남음'}</b><small>공동 냉장배송</small></div><button onclick="bookDelivery('${schedule.id}')">${booked(schedule.id)?'예약됨':'참여하기'}</button></article>`}
  const delivery=document.querySelector('.delivery-section');if(delivery){const panel=document.createElement('section');panel.className='delivery-schedule';panel.innerHTML=`<div class="schedule-header"><div><p>DELIVERY SCHEDULE</p><h2>공동배송 <em>일정 선택</em></h2></div><span>원하는 시간대에 주문을 함께 실어 보내세요.</span></div><div class="schedule-list">${schedules.map(card).join('')}</div>`;delivery.after(panel)}
  window.bookDelivery=id=>{const user=typeof currentUser==='function'?currentUser():'';if(!user){toast('공동배송에 참여하려면 먼저 로그인해주세요.');openLogin();return}if(!booked(id)){localStorage.setItem(key,JSON.stringify([...bookings(),id]));toast('공동배송 일정에 참여했습니다.')}document.querySelector('.delivery-schedule')?.replaceWith(Object.assign(document.createElement('section'),{className:'delivery-schedule',innerHTML:`<div class="schedule-header"><div><p>DELIVERY SCHEDULE</p><h2>공동배송 <em>일정 선택</em></h2></div><span>원하는 시간대에 주문을 함께 실어 보내세요.</span></div><div class="schedule-list">${schedules.map(card).join('')}</div>`}));};
  const originalOpenModal=window.openModal;window.openModal=type=>{if(type!=='route'){originalOpenModal(type);return}const rows=schedules.map(schedule=>`<div class="schedule-modal-row"><div><b>${schedule.day} ${schedule.time}</b><span>${schedule.route}</span></div><button onclick="bookDelivery('${schedule.id}');closeModal()">${booked(schedule.id)?'예약됨':'참여'}</button></div>`).join('');showModal(`<h2>공동배송 일정</h2><p>일정을 선택하면 주문 상품을 공동 냉장배송으로 받을 수 있습니다.</p><div class="schedule-modal-list">${rows}</div>`)};
})();
