(() => {
  const expandAll = window.showAllPrices;
  window.showAllPrices = button => {
    if (button.dataset.expanded) {
      document.querySelectorAll('.market-grid .all-price').forEach(card => card.remove());
      delete button.dataset.expanded;
      button.disabled = false;
      button.textContent = '전체 시세 보기 →';
      return;
    }
    expandAll(button);
    button.disabled = false;
    button.textContent = '전체 시세 닫기 ↑';
  };
})();
