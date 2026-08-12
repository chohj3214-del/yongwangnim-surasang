(() => {
  const info = document.querySelector('.route-info');
  if (!info) return;
  const detail = document.createElement('div');
  detail.className = 'route-detail';
  detail.innerHTML = `
    <div class="route-progress"><span class="progress-live"><i></i> 배송 모집 중</span><span>마감까지 <b>00:38:21</b></span></div>
    <div class="stops">
      <div class="stop active"><i>1</i><span><b>부산공동어시장</b><small>오후 2:00 출발 · 픽업 8곳</small></span></div>
      <div class="stop"><i>2</i><span><b>서면·부전시장</b><small>오후 2:28 도착 예정 · 5건 배송</small></span></div>
      <div class="stop"><i>3</i><span><b>해운대·센텀</b><small>오후 3:05 도착 예정 · 7건 배송</small></span></div>
    </div>
    <div class="cold-status"><span>❄ 냉장 상태</span><b>1.8°C</b><small>정상 범위 0~5°C</small></div>`;
  info.before(detail);
  const order = info.querySelector('div:nth-child(2) strong');
  if (order) order.innerHTML = '12건 <em>· 4자리 남음</em>';
})();
