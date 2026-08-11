document.getElementById('downloadBtn').addEventListener('click', async () => {
  const statusDiv = document.getElementById('status');
  statusDiv.innerText = "페이지 내에서 다운로드를 시도합니다...";

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // 블로그 페이지 안으로 직접 침투하여 실행
    chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      func: extractAndDownloadFiles
    }, (results) => {
      let totalFiles = 0;
      if (results) {
        results.forEach(frame => {
          if (frame.result) {
            totalFiles += frame.result;
          }
        });
      }

      if (totalFiles === 0) {
        statusDiv.innerText = "파일을 찾지 못했습니다. (모바일 주소 m.blog.naver.com 접속 권장)";
      } else {
        statusDiv.innerText = `${totalFiles}개의 파일 다운로드 진행 중!`;
      }
    });

  } catch (error) {
    statusDiv.innerText = "오류 발생: " + error.message;
  }
});

// 웹페이지 안에서 유령 손이 되어 직접 클릭하는 함수
function extractAndDownloadFiles() {
  let fileLinks = [];
  let docs = [document];

  // 프레임 안쪽까지 확인
  const iframe = document.getElementById('mainFrame');
  if (iframe) {
    try {
      docs.push(iframe.contentDocument || iframe.contentWindow.document);
    } catch (e) {}
  }

  docs.forEach(doc => {
    if (!doc) return;
    const links = doc.querySelectorAll('a');
    links.forEach(link => {
      let href = link.href || link.getAttribute('href') || link.getAttribute('data-url') || "";
      const lowerHref = href.toLowerCase();

      // 파일 다운로드 관련 링크 수집
      if (lowerHref.includes('filedown') || lowerHref.includes('attach') || lowerHref.includes('download')) {
        if (href.startsWith('/')) href = window.location.origin + href;
        if (href.startsWith('http')) fileLinks.push(href);
      }
    });

    const seLinks = doc.querySelectorAll('.se-module-file-link, .se-file-button');
    seLinks.forEach(el => {
      let href = el.href || el.getAttribute('href') || el.getAttribute('data-url');
      if (!href) {
        const childA = el.querySelector('a');
        if (childA) href = childA.href || childA.getAttribute('href');
      }
      if (href) {
        if (href.startsWith('/')) href = window.location.origin + href;
        if (href.startsWith('http')) fileLinks.push(href);
      }
    });
  });

  // 중복된 주소 제거
  const uniqueUrls = [...new Set(fileLinks)];

  // 크롬 API가 아닌, 페이지 내부에서 직접 가짜 링크를 만들어 클릭 (네이버 서버 우회)
  uniqueUrls.forEach((url, index) => {
    setTimeout(() => {
      const a = document.createElement('a');
      a.href = url;
      document.body.appendChild(a);
      a.click(); // 사용자가 클릭한 것처럼 흉내 냄
      document.body.removeChild(a);
    }, index * 500); // 0.5초(500ms) 간격으로 하나씩 클릭
  });

  return uniqueUrls.length; // 찾은 파일 개수만 반환
}