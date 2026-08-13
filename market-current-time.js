(() => {
  const update=()=>{
    const target=document.querySelector('#market .section-head')||document.querySelector('#market');
    const text=target?.querySelector('p:last-child');
    if(!text)return;
    const parts=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:true}).formatToParts(new Date());
    const value=type=>parts.find(part=>part.type===type)?.value||'';
    text.textContent=`${value('year')}. ${value('month')}. ${value('day')}. ${value('dayPeriod')} ${value('hour')}:${value('minute')} 기준 · 부산공동어시장`;
  };
  update();setInterval(update,60000);
})();
