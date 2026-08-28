let targetQuality = null;
const qualityOrder = ['hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny'];

// content.js로부터 화질 설정값을 전달받음
window.addEventListener('message', (event) => {
    if (event.source !== window || !event.data || event.data.type !== 'SET_YT_QUALITY') return;
    targetQuality = event.data.quality;
    forceQuality();
});

function forceQuality() {
    if (!targetQuality) return false;

    const player = document.getElementById('movie_player');
    if (!player || typeof player.getAvailableQualityLevels !== 'function') return false;

    const levels = player.getAvailableQualityLevels();
    if (!levels || levels.length === 0) return false;

    // 목표 화질을 기준으로 하위 화질 탐색
    const targetIdx = qualityOrder.indexOf(targetQuality);
    const validLevels = qualityOrder.slice(targetIdx);
    let bestAvailable = validLevels.find(q => levels.includes(q)) || levels[0];

    // 1. 유튜브 API를 통한 화질 강제 고정
    if (typeof player.setPlaybackQualityRange === 'function') {
        player.setPlaybackQualityRange(bestAvailable, bestAvailable);
    }
    if (typeof player.setPlaybackQuality === 'function') {
        player.setPlaybackQuality(bestAvailable);
    }

    // 2. 브라우저 로컬 스토리지에 기본 화질로 영구 기록
    try {
        const now = Date.now();
        window.localStorage.setItem('yt-player-quality', JSON.stringify({
            data: bestAvailable,
            expiration: now + 2592000000,
            creation: now
        }));
    } catch(e) {}

    return true;
}

// 비디오 로딩 시 지속적으로 화질 고정 시도
let checkInterval = setInterval(() => {
    if (forceQuality()) clearInterval(checkInterval);
}, 300);
setTimeout(() => clearInterval(checkInterval), 15000); // 최대 15초간 시도

// 유튜브 내에서 다른 영상으로 이동할 때 재적용
window.addEventListener('yt-navigate-finish', () => {
    setTimeout(forceQuality, 300);
    setTimeout(forceQuality, 1500);
});

// 광고 스킵 후 본영상 시작 등 비디오 소스가 바뀔 때 재적용
document.addEventListener('loadedmetadata', (e) => {
    if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'video') {
        forceQuality();
    }
}, true);