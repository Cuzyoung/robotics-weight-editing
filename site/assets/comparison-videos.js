(() => {
  document.querySelectorAll('.matched-comparisons').forEach(section => {
    const video = section.querySelector('video');
    const buttons = [...section.querySelectorAll('[data-frequency]')];
    buttons.forEach(button => button.addEventListener('click', () => {
      if (button.getAttribute('aria-pressed') === 'true') return;
      video.pause();
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      video.poster = button.dataset.poster;
      video.querySelector('source').src = button.dataset.src;
      section.querySelector('[data-rate-label]').textContent = `${button.dataset.frequency} Hz`;
      video.load();
    }));
  });
})();
