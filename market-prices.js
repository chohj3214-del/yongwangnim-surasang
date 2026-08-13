(() => {
  const items = [
    ['어류','고등어'],['어류','갈치'],['어류','광어'],['어류','연어'],['어류','참돔'],['어류','방어'],['어류','삼치'],['어류','조기'],['어류','명태'],['어류','대구'],['어류','아귀'],['어류','병어'],['어류','멸치'],
    ['연체류','오징어'],['연체류','갑오징어'],['연체류','낙지'],['연체류','주꾸미'],['연체류','문어'],
    ['갑각류','꽃게'],['갑각류','대게'],['갑각류','킹크랩'],['갑각류','새우'],
    ['패류','전복'],['패류','굴'],['패류','바지락'],['패류','꼬막'],['패류','가리비'],['패류','홍합'],['패류','소라'],
    ['기타','해삼'],['기타','멍게'],['해조류','미역'],['해조류','다시마'],['해조류','김']
  ];
  const grid = () => document.querySelector('.market-grid');
  const card = ([category, name], extra = false) => `<article class="price-card catalog-price${extra ? ' catalog-extra' : ''}" data-product="${name}"><div class="card-top"><span class="pill">${category}</span><span class="origin">승인 재고 합산</span></div><div class="product-image"></div><h3>${name}</h3><p>판매자 승인 재고 · 500g 단위</p><div class="price"><strong>재고 확인 중</strong><span class="up">실시간 합산</span></div><div class="bar-row"><span>판매자 등록가 기준</span><span>500g 기준</span></div><div class="price-bar"><i style="width:0%"></i></div><button class="add-cart" disabled>재고 확인 중 <b>—</b></button></article>`;
  function renderInitial() { const root = grid(); if (!root || root.querySelector('.catalog-price')) return; root.innerHTML = items.slice(0, 3).map(item => card(item)).join(''); }
  window.marketCatalogItems = items;
  window.showAllPrices = button => { const root = grid(); if (button.dataset.expanded) { root.querySelectorAll('.catalog-extra').forEach(node => node.remove()); delete button.dataset.expanded; button.textContent = '전체 시세 보기 →'; } else { root.insertAdjacentHTML('beforeend', items.slice(3).map(item => card(item, true)).join('')); button.dataset.expanded = 'true'; button.textContent = '전체 시세 닫기 ↑'; } window.dispatchEvent(new Event('catalog-rendered')); };
  renderInitial();
  const trigger = document.querySelector('#market .ghost'); if (trigger) trigger.addEventListener('click', event => { event.preventDefault(); window.showAllPrices(trigger); });
})();
