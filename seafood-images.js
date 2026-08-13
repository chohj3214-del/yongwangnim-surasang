(() => {
  const imageFor = name => {
    const value = (name || '').replace(/\s/g, '');
    if (/연어/.test(value)) return 'salmon-photo';
    if (/대구|명태/.test(value)) return 'cod-photo';
    if (/광어|가자미|병어/.test(value)) return 'flatfish-photo';
    if (/오징어|갑오징어/.test(value)) return 'squid-photo';
    if (/게|새우|크랩/.test(value)) return 'crab-photo';
    if (/문어|낙지|쭈꾸미/.test(value)) return 'octopus-photo';
    return 'fish-photo';
  };
  const applyPhotos = () => document.querySelectorAll('.price-card').forEach(card => {
    const image = card.querySelector('.product-image');
    const name = card.querySelector('h3')?.textContent || '';
    if (!image || image.dataset.seafoodPhoto) return;
    image.dataset.seafoodPhoto = 'true';
    image.classList.add('seafood-photo', imageFor(name));
    image.textContent = '';
  });
  applyPhotos();
  new MutationObserver(applyPhotos).observe(document.querySelector('.market-grid'), { childList: true });
})();
