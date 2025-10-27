document.addEventListener('DOMContentLoaded', () => {
  const toc = document.querySelector('.toc');
  const tocNav = document.querySelector('.toc .toc-nav');
  if (!toc || !tocNav) return;

  // Ensure "Introduction" exists at H2 level in the root list
  let rootUl = tocNav.querySelector('#TableOfContents > ul') || tocNav.querySelector(':scope > ul');
  if (rootUl && !rootUl.querySelector('a[href="#introduction"]')) {
    const li = document.createElement('li');
    const a  = document.createElement('a');
    a.href = '#introduction';
    a.textContent = 'Introduction';
    li.appendChild(a);
    rootUl.insertBefore(li, rootUl.firstChild);
  }

  // Desktop only: run auto-follow when ToC is sticky (small screens stack)
  const isSmall  = window.matchMedia('(max-width: 1200px)').matches;
  const isSticky = getComputedStyle(toc).position === 'sticky';
  if (isSmall || !isSticky) return;

  // Build heading list from ToC links
  const links = Array.from(tocNav.querySelectorAll('a[href^="#"]'));
  if (!links.length) return;

  const decodeHash = a => decodeURIComponent(a.getAttribute('href').slice(1));
  const idToLink   = new Map(links.map(a => [decodeHash(a), a]));
  const headings   = links
    .map(a => document.getElementById(decodeHash(a)))
    .filter(Boolean);

  // Highlight helper
  const clear = () => links.forEach(l => l.classList.remove('active'));

  // Pick the heading nearest the viewport center (stable up & down)
  const pickActive = () => {
    const mid = document.scrollingElement.scrollTop + window.innerHeight * 0.52;
    let active = headings[0];
    for (let i = 0; i < headings.length; i++) {
      const top = headings[i].getBoundingClientRect().top + document.scrollingElement.scrollTop;
      if (top <= mid) active = headings[i]; else break;
    }
    if (!active) return;
    const link = idToLink.get(active.id);
    if (!link) return;
    clear();
    link.classList.add('active');

    // Keep the active link visible in the ToC scroller (only if ToC is scrollable)
    if (toc.scrollHeight > toc.clientHeight) {
      const linkRect = link.getBoundingClientRect();
      const scrollerRect = toc.getBoundingClientRect();
      const margin = 40;
      if (linkRect.top < scrollerRect.top + margin ||
          linkRect.bottom > scrollerRect.bottom - margin) {
        link.scrollIntoView({ block: 'nearest' });
      }
    }
  };

  // Throttle with rAF for smoothness
  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => { pickActive(); ticking = false; });
      ticking = true;
    }
  };

  pickActive();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', pickActive);
});
