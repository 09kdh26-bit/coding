// inject.js 파일을 유튜브 웹페이지의 메인 권한으로 삽입합니다.
const script = document.createElement('script');
script.src = chrome.runtime.getURL('inject.js');
script.onload = function() {
    this.remove(); // 로드 완료 후 불필요한 태그 제거
    
    // 삽입 완료 후, 저장된 화질 설정을 inject.js로 전달
    chrome.storage.local.get(['targetQuality'], (result) => {
        window.postMessage({ type: 'SET_YT_QUALITY', quality: result.targetQuality || 'hd1080' }, '*');
    });
};
(document.head || document.documentElement).appendChild(script);

// 팝업에서 화질을 변경할 때마다 즉시 inject.js로 전달
chrome.storage.onChanged.addListener((changes) => {
    if (changes.targetQuality) {
        window.postMessage({ type: 'SET_YT_QUALITY', quality: changes.targetQuality.newValue }, '*');
    }
});