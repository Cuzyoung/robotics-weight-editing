(() => {
  const button = document.querySelector('[data-copy-bibtex]');
  const code = document.getElementById('bibtex-code');
  const status = document.querySelector('.bibtex-status');
  if (!button || !code || !status) return;
  const zh = document.documentElement.lang.startsWith('zh');
  const label = button.textContent;
  let reset;
  button.hidden = false;
  button.addEventListener('click', async () => {
    clearTimeout(reset);
    try {
      await navigator.clipboard.writeText(code.textContent);
      button.textContent = zh ? '已复制' : 'Copied';
      status.textContent = zh ? 'BibTeX 已复制到剪贴板。' : 'BibTeX copied to clipboard.';
      reset = setTimeout(() => {
        button.textContent = label;
        status.textContent = '';
      }, 2500);
    } catch (_) {
      const range = document.createRange();
      range.selectNodeContents(code);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = label;
      status.textContent = zh ? '未能自动复制，请复制已选中的内容。' : 'Copy unavailable. Please copy the selected text.';
    }
  });
})();
