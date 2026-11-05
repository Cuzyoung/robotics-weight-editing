// Run before styles paint so a saved dark theme never flashes white.
(() => {
  let theme = 'light';
  try { if (localStorage.getItem('robotics-weight-editing-theme') === 'dark') theme = 'dark'; } catch (_) {}
  document.documentElement.dataset.theme = theme;
})();
