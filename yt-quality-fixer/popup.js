document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('qualitySelect');

  // 저장된 화질 불러오기 (기본값: 1080p)
  chrome.storage.local.get(['targetQuality'], (result) => {
    select.value = result.targetQuality || 'hd1080';
  });

  // 화질 변경 시 자동 저장
  select.addEventListener('change', () => {
    chrome.storage.local.set({ targetQuality: select.value });
  });
});