// 1. 제외하고 싶은 유저의 닉네임을 아래 배열 안에 입력하세요. 
// 예시: const hiddenUsers = ["차단할유저명1", "유저명2"];
const hiddenUsers = ["ao", "CHaSkH"];

const targetUsers = hiddenUsers.map(user => user.toLowerCase());

function hideWorkshopItems() {
    // 스팀의 랜덤 클래스명을 무시하고 페이지 내의 모든 링크(a 태그)를 검색합니다.
    const links = document.querySelectorAll('a');

    links.forEach(a => {
        const text = a.textContent.trim().toLowerCase();

        // "제작자: ao" 또는 "creator: ao" 같은 텍스트에서 닉네임만 추출
        const cleanedText = text.replace(/^(제작자:\s*|creator:\s*|author:\s*)/i, '').trim();

        // 추출한 닉네임이 차단 목록에 있는지 확인
        if (targetUsers.includes(cleanedText)) {
            
            // 1. 구형 스팀 UI 호환성
            let card = a.closest('.workshopItem, .apphub_Card, .workshopBrowseRow');
            
            // 2. 신형 스팀 UI 대응: 동적 클래스명일 경우 부모 요소를 거슬러 올라가며 모드 카드 덩어리 찾기
            if (!card) {
                let parent = a.parentElement;
                let candidateCard = parent;
                let depth = 0;
                
                // 최대 5단계까지 부모를 거슬러 올라감
                while (parent && depth < 5) {
                    // 만약 부모 요소 안에 다른 모드의 '제작자' 링크까지 여러 개 포함되어 있다면 (즉, 카드 목록 전체를 감싸는 컨테이너라면) 멈춤
                    const authorLinksInParent = Array.from(parent.querySelectorAll('a')).filter(link => 
                        link.textContent.includes('제작자:') || link.href.includes('/myworkshopfiles/')
                    ).length;
                    
                    if (authorLinksInParent > 1) {
                        break; 
                    }
                    
                    candidateCard = parent;
                    parent = parent.parentElement;
                    depth++;
                }
                card = candidateCard;
            }

            // 찾은 모드 카드를 화면에서 완전히 숨김 처리
            if (card) {
                card.style.display = 'none'; 
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

// 문서 전체의 변화 감시 시작
observer.observe(document.body, { childList: true, subtree: true });