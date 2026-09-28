(() => {
  const indexUrl = 'https://haku-share-pages.s3.us-west-2.wasabisys.com/index.json';
  const items = document.querySelector('#items');
  const status = document.querySelector('#status');
  const search = document.querySelector('#search');

  if (items && status && search) {
    let pages = [];
    const render = () => {
      const query = search.value.trim().toLowerCase();
      const shown = pages.filter((page) => [page.title, page.description, ...(page.tags || [])].join(' ').toLowerCase().includes(query));
      items.replaceChildren(...shown.map((page) => {
        const li = document.createElement('li');
        li.className = 'item';
        const link = document.createElement('a');
        link.href = page.url || `/p/${page.id}`;
        link.textContent = page.title;
        li.append(link);
        if (page.description) {
          const description = document.createElement('p');
          description.textContent = page.description;
          li.append(description);
        }
        const meta = document.createElement('div');
        meta.className = 'meta';
        const metaParts = [
          ...(page.created ? [new Date(page.created).toLocaleDateString()] : []),
          ...(page.tags || []),
        ];
        meta.textContent = metaParts.join(' · ');
        if (metaParts.length) li.append(meta);
        return li;
      }));
      items.hidden = false;
      status.textContent = shown.length ? `${shown.length} shared ${shown.length === 1 ? 'thing' : 'things'}` : (query ? 'No matches.' : 'Nothing listed yet.');
    };

    fetch(indexUrl, { cache: 'no-cache' })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`)))
      .then((data) => { pages = Array.isArray(data) ? data : (data.pages || []); render(); })
      .catch(() => { status.textContent = 'Nothing listed yet.'; items.hidden = true; });
    search.addEventListener('input', render);
  }

  const copyButton = document.querySelector('[data-copy-url]');
  if (copyButton) copyButton.addEventListener('click', async () => {
    await navigator.clipboard.writeText(location.href);
    const original = copyButton.textContent;
    copyButton.textContent = 'Copied';
    setTimeout(() => { copyButton.textContent = original; }, 1200);
  });
})();

(() => {
  const headings = [];

  const decorate = (heading) => {
    if (heading.querySelector(':scope > .chroma-stack')) return;

    const original = document.createElement('span');
    original.className = 'chroma-original';

    if (heading.matches('.share-page article h2, .item > a')) {
      const prompt = document.createElement('span');
      prompt.className = 'chroma-prompt';
      prompt.textContent = '>';
      original.append(prompt);
    }

    while (heading.firstChild) original.append(heading.firstChild);

    const stack = document.createElement('span');
    stack.className = 'chroma-stack';

    ['red', 'green', 'blue'].forEach((channel) => {
      const copy = original.cloneNode(true);
      copy.className = `chroma-channel chroma-channel--${channel}`;
      copy.setAttribute('aria-hidden', 'true');
      stack.append(copy);
    });

    stack.append(original);
    heading.append(stack);
    heading.classList.add('chroma-heading');
    headings.push(heading);
  };

  document
    .querySelectorAll('.share-page h1, .share-page article h2, .masthead h1')
    .forEach(decorate);

  const items = document.querySelector('#items');
  if (items) {
    const decorateLinks = () => items.querySelectorAll(':scope > .item > a').forEach(decorate);
    new MutationObserver(decorateLinks).observe(items, { childList: true });
    decorateLinks();
  }

  if (!headings.length && !items) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer;
  let resetTimer;

  const reset = (heading) => {
    heading.style.removeProperty('--ca-red-x');
    heading.style.removeProperty('--ca-red-y');
    heading.style.removeProperty('--ca-blue-x');
    heading.style.removeProperty('--ca-blue-y');
  };

  const schedule = () => {
    window.clearTimeout(timer);
    if (reducedMotion.matches || document.hidden || !headings.length) return;
    timer = window.setTimeout(pulse, 2600 + Math.random() * 4200);
  };

  const pulse = () => {
    const heading = headings[Math.floor(Math.random() * headings.length)];
    const spread = 2.4 + Math.random() * 1.8;
    const y = -0.6 + Math.random() * 1.2;

    heading.style.setProperty('--ca-red-x', `${(-spread).toFixed(2)}px`);
    heading.style.setProperty('--ca-red-y', `${y.toFixed(2)}px`);
    heading.style.setProperty('--ca-blue-x', `${spread.toFixed(2)}px`);
    heading.style.setProperty('--ca-blue-y', `${(-y).toFixed(2)}px`);

    window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => reset(heading), 90 + Math.random() * 80);
    schedule();
  };

  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener?.('change', () => {
    headings.forEach(reset);
    schedule();
  });
  schedule();
})();
