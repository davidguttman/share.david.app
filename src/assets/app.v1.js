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
