(() => {
  const themeButton = document.querySelector('.theme-toggle');
  const themeKey = 'robotics-weight-editing-theme';
  const zh = document.documentElement.lang.startsWith('zh');
  const applyTheme = theme => {
    const dark = theme === 'dark';
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    themeButton.setAttribute('aria-pressed', String(dark));
    themeButton.setAttribute('aria-label', dark ? (zh ? '开灯，切换纯白背景' : 'Switch to white background') : (zh ? '关灯，切换纯黑背景' : 'Switch to black background'));
    themeButton.querySelector('.theme-icon').textContent = dark ? '☀' : '☾';
    themeButton.querySelector('.theme-label').textContent = dark ? (zh ? '开灯' : 'Lights on') : (zh ? '关灯' : 'Lights off');
  };
  applyTheme(document.documentElement.dataset.theme);
  themeButton.hidden = false;
  themeButton.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
    try { localStorage.setItem(themeKey, theme); } catch (_) {}
  });
  window.addEventListener('storage', event => {
    if (event.key === themeKey || event.key === null) applyTheme(event.newValue);
  });
  const bar = document.querySelector('.reading-progress span');
  const links = [...document.querySelectorAll('.toc a')];
  const headings = [...document.querySelectorAll('#introduction, #execution, #tldr, #rtc-finding-title, #rope-finding-title, #qk-finding-title, #abstract, .article-content h2[id], .article-content h3[id]')];
  let queued = false;
  const update = () => {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = `${height > 0 ? Math.min(100, window.scrollY / height * 100) : 0}%`;
    let active = '';
    for (const heading of headings) {
      if (heading.getBoundingClientRect().top <= 140) active = heading.id;
      else break;
    }
    links.forEach(link => {
      const current = link.hash === `#${active}`;
      link.classList.toggle('active', current);
      if (current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    queued = false;
  };
  window.addEventListener('scroll', () => {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  document.querySelectorAll('.language-link').forEach(link => {
    link.addEventListener('click', () => {
      const target = new URL(link.getAttribute('href'), location.href);
      target.hash = location.hash;
      link.href = target.href;
    });
  });
  document.querySelectorAll('.mobile-toc a').forEach(link => {
    link.addEventListener('click', () => {
      const menu = link.closest('details');
      // Close before the native anchor jump so the target offset stays correct.
      if (menu) menu.open = false;
    });
  });
  update();
})();
