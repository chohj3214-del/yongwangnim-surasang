(() => {
  const schedules=[
    {id:'west-morning',offset:0,time:'09:30',route:'서부권 · 강서·사하·사상·북구',eta:'11:10'},
    {id:'central-noon',offset:0,time:'11:30',route:'중부권 · 중구·서구·동구·부산진·동래',eta:'13:00'},
    {id:'east-afternoon',offset:0,time:'14:00',route:'동부권 · 수영·해운대·기장',eta:'15:35'},
    {id:'south-afternoon',offset:0,time:'16:30',route:'남부권 · 남구·연제·금정',eta:'18:00'},
    {id:'all-evening',offset:0,time:'19:00',route:'부산 전 지역 · 통합 공동배송',eta:'21:00'},
    {id:'all-next-morning',offset:1,time:'07:00',route:'부산 전 지역 · 새벽 공동배송',eta:'09:30'}
  ];
  const key='yongwang-delivery-selection',now=()=>new Date();
  const departure=s=>{const date=now();date.setHours(0,0,0,0);date.setDate(date.getDate()+s.offset);const [hour,minute]=s.time.split(':').map(Number);date.setHours(hour,minute,0,0);return date};
  const koreanDate=date=>new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric',weekday:'short'}).format(date),displayTime=text=>{const [hour,minute]=text.split(':').map(Number);return `${hour<12?'오전':'오후'} ${hour%12||12}:${String(minute).padStart(2,'0')}`};
  const remaining=s=>{const minutes=Math.floor((departure(s)-now())/60000);if(minutes<0)return {closed:true,text:'출발 완료'};const close=Math.max(0,minutes-40);return {closed:false,text:close>=60?`${Math.floor(close/60)}시간 ${close%60}분 후 마감`:`${close}분 후 마감`}};
  const slots=s=>Math.max(1,2+(Math.floor((departure(s)-now())/60000)%7+7)%7);
  function card(s){const state=remaining(s),date=departure(s);return `<article class="schedule-card ${state.closed?'closed':''}"><div class="schedule-day"><b>${s.offset?'내일':'오늘'}</b><small>${koreanDate(date)}</small></div><div class="schedule-time"><strong>${displayTime(s.time)}</strong><span>${displayTime(s.eta)} 도착</span></div><div class="schedule-route"><b>${s.route}</b><small>${state.text}</small></div><div class="schedule-seat ${slots(s)<=2?'urgent':''}"><b>${state.closed?'출발 완료':slots(s)+'자리 남음'}</b><small>공동 냉장배송</small></div></article>`}
  const panel=()=>`<div class="schedule-header"><div><p>BUSAN ALL-AREA DELIVERY · ${new Intl.DateTimeFormat('ko-KR',{hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(now())}</p><h2>부산 전 지역 <em>공동배송 일정</em></h2></div><span>16개 구·군을 권역별로 운행합니다. 현재 시간 기준 출발·마감 시간입니다.</span></div><div class="schedule-list">${schedules.map(card).join('')}</div>`;
  const delivery=document.querySelector('.delivery-section');if(delivery){const section=document.createElement('section');section.className='delivery-schedule';section.innerHTML=panel();delivery.after(section)}
  const refresh=()=>{const section=document.querySelector('.delivery-schedule');if(section)section.innerHTML=panel()};
  window.deliverySchedules=schedules;window.deliveryScheduleLabel=id=>{const schedule=schedules.find(item=>item.id===id);return schedule?`${schedule.offset?'내일':'오늘'} ${displayTime(schedule.time)} · ${schedule.route}`:''};
  window.selectDeliverySchedule=id=>{const schedule=schedules.find(item=>item.id===id);if(!schedule||remaining(schedule).closed)return;localStorage.setItem(key,id);toast('공동배송 일정을 선택했어요. 이제 주문할 수 있습니다.');closeModal();document.dispatchEvent(new Event('delivery-schedule-selected'));setTimeout(()=>openCart(),120)};
  const originalOpenModal=window.openModal;window.openModal=type=>{if(type!=='route'){originalOpenModal(type);return}const selected=localStorage.getItem(key),rows=schedules.map(s=>`<div class="schedule-modal-row"><div><b>${s.offset?'내일':'오늘'} ${displayTime(s.time)}</b><span>${s.route} · ${remaining(s).text}</span></div><button ${remaining(s).closed?'disabled':''} onclick="selectDeliverySchedule('${s.id}')">${selected===s.id?'선택됨':remaining(s).closed?'마감':'일정 선택'}</button></div>`).join('');showModal(`<h2>부산 전 지역 공동배송</h2><p>배송지 권역에 맞는 일정을 선택하세요. 모든 부산 지역에 배송합니다.</p><div class="schedule-modal-list">${rows}</div>`) };
  refresh();setInterval(refresh,30000);
})();
