// 1. 제외하고 싶은 유저의 닉네임을 아래 배열 안에 입력하세요. 
// 예시: const hiddenUsers = ["차단할유저명1", "유저명2"];
const hiddenUsers = ["여기에_유저_닉네임_입력"];

// 닉네임 대소문자 구분을 없애기 위해 소문자로 변환해 둠
const targetUsers = hiddenUsers.map(user => user.toLowerCase());

function hideWorkshopItems() {
    // 창작마당의 모드 카드 요소들 선택
    const items = document.querySelectorAll('.workshopItem, .workshopBrowserRow');

    items.forEach(item => {
        // 작성자 이름이 표시된 요소 찾기
        const authorElement = item.querySelector('.workshopItemAuthorName a');

        if (authorElement) {
            const authorName = authorElement.innerText.trim().toLowerCase();

            // 숨김 목록에 포함된 유저라면 해당 모드 카드를 화면에서 숨김 처리
            if (targetUsers.includes(authorName)) {
                item.style.display = 'none'; 
            }
        }
    });
}

// 페이지 최초 로드 시 실행
hideWorkshopItems();

// 스크롤 시 새롭게 로딩되는 아이템을 감지하여 필터링 적용 (MutationObserver)
const observer = new MutationObserver((mutations) => {
    let shouldRun = false;
    for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
            shouldRun = true;
            break;
        }
    }
    if (shouldRun) hideWorkshopItems();
});

// 문서 전체의 변화를 감시 시작
observer.observe(document.body, { childList: true, subtree: true });