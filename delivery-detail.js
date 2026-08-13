(() => {
  const info = document.querySelector('.route-info');
  if (!info) return;
  const detail = document.createElement('div');
  detail.className = 'route-detail';
  detail.innerHTML = `
    <div class="route-progress"><span class="progress-live"><i></i> 부산 전 지역 배송 모집 중</span><span>권역별 실시간 배차</span></div>
    <div class="stops">
      <div class="stop active"><i>1</i><span><b>부산공동어시장</b><small>권역별 공동 픽업 · 냉장 집하</small></span></div>
      <div class="stop"><i>2</i><span><b>서부·중부·동부권</b><small>강서부터 기장까지 권역별 순차 배송</small></span></div>
      <div class="stop"><i>3</i><span><b>부산 16개 구·군</b><small>배송지 기준 최적 경로로 배차</small></span></div>
    </div>
    <div class="cold-status"><span>❄ 냉장 상태</span><b>1.8°C</b><small>정상 범위 0~5°C</small></div>`;
  info.before(detail);
  const order = info.querySelector('div:nth-child(2) strong');
  if (order) order.innerHTML = '전 지역 <em>· 실시간 배차</em>';
})();
