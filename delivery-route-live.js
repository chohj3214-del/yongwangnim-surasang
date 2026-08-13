(() => {
  const selectionKey = 'yongwang-delivery-selection';
  const schedules = () => window.deliverySchedules || [];
  const currentName = () => typeof currentUser === 'function' ? currentUser() : '';
  const orders = () => { try { return JSON.parse(localStorage.getItem('yongwang-orders')) || []; } catch { return []; } };
  const departure = schedule => { const date = new Date(); date.setHours(0,0,0,0); date.setDate(date.getDate() + Number(schedule.offset || 0)); const [hour, minute] = schedule.time.split(':').map(Number); date.setHours(hour,minute,0,0); return date; };
  const arrival = schedule => { const date = departure(schedule), [hour,minute] = schedule.eta.split(':').map(Number); date.setHours(hour,minute,0,0); return date; };
  const format = date => new Intl.DateTimeFormat('ko-KR',{hour:'numeric',minute:'2-digit'}).format(date);
  const findSchedule = () => {
    const name = currentName(), mine = name ? orders().find(order => order.user === name && order.deliveryLocked && order.deliveryScheduleId) : null;
    const id = mine?.deliveryScheduleId || localStorage.getItem(selectionKey);
    return { order: mine, schedule: schedules().find(item => item.id === id) || schedules().find(item => arrival(item) > new Date()) || schedules()[0] };
  };
  const timing = (order,schedule) => {
    const start = order?.deliveryTimes?.departure ? new Date(order.deliveryTimes.departure) : departure(schedule);
    const end = order?.deliveryTimes?.arrival ? new Date(order.deliveryTimes.arrival) : arrival(schedule);
    const now = new Date();
    if (now < start) return { key:'preparing', label:'상품 준비 중', text:`${format(start)} 출발 예정`, step:0 };
    if (now < end) return { key:'delivering', label:'냉장 배송 중', text:`${format(end)} 도착 예정`, step:1 };
    return { key:'completed', label:'판매 완료', text:`${format(end)} 배송 완료`, step:2 };
  };
  const update = () => {
    const card = document.querySelector('.route-card'); if (!card) return;
    const { order, schedule } = findSchedule(); if (!schedule) return;
    const state = timing(order,schedule), steps = card.querySelectorAll('.stop');
    card.classList.remove('live-preparing','live-delivering','live-completed'); card.classList.add(`live-${state.key}`);
    const badge = card.querySelector('.route-card-head b'); if (badge) badge.textContent = state.label;
    const progress = card.querySelector('.route-progress'); if (progress) progress.innerHTML = `<span class="progress-live route-state ${state.key}"><i></i>${state.label}</span><span>${order ? '내 공동배송 일정' : '가장 가까운 배차'}</span>`;
    steps.forEach((step,index) => { step.classList.toggle('done',index < state.step); step.classList.toggle('current',index === state.step); });
    const second = card.querySelector('.route-info div:nth-child(2)'); if (second) second.innerHTML = `<small>배송 일정</small><strong>${format(departure(schedule))} 출발</strong>`;
    const first = card.querySelector('.route-info div:first-child'); if (first) first.innerHTML = `<small>${state.key === 'completed' ? '배송 상태' : '예정 상태'}</small><strong>${state.text}</strong>`;
    const button = card.querySelector('.route-info button'); if (button) { button.textContent = order ? '주문 내역' : '일정 보기'; button.onclick = () => order ? openOrders() : openModal('route'); }
  };
  ['login-complete','delivery-schedule-selected','delivery-schedule-cancelled','delivery-schedule-locked'].forEach(event => document.addEventListener(event,() => setTimeout(update,20)));
  setInterval(update,30000); setTimeout(update,30);
})();
