@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

:: ==========================================
:: [설정] 아래 경로와 단어를 상황에 맞게 수정하세요.
:: ==========================================
set "TARGET_DIR=C:\대상\폴더\경로를\여기에\입력하세요"
set "OLD_WORD=바꾸기전단어"
set "NEW_WORD=새로운단어"
set "FILE_TYPES=*.atlas, *.txt, *.md, *.csv, *.json"
:: ==========================================

echo.
echo 대상 폴더: %TARGET_DIR%
echo 변경 내용: [%OLD_WORD%] -^> [%NEW_WORD%]
echo.
echo ⚠️ 주의: 바이너리 파일(이미지, 엑셀 등)의 손상을 막기 위해,
echo 내부 데이터 변경은 %FILE_TYPES% 확장자 파일에만 적용됩니다.
echo 작업 전 반드시 원본 폴더를 백업해 두시기를 강력히 권장합니다.
pause

echo.
echo [1/2] 파일 및 폴더 이름 변경 중...
powershell -NoProfile -Command "Get-ChildItem -Path '%TARGET_DIR%' -Recurse | Where-Object { $_.Name -match '%OLD_WORD%' } | Rename-Item -NewName { $_.Name -replace '%OLD_WORD%', '%NEW_WORD%' } -PassThru"

echo.
echo [2/2] 파일 내부 데이터 변경 중...
powershell -NoProfile -Command "Get-ChildItem -Path '%TARGET_DIR%' -File -Recurse -Include %FILE_TYPES% | ForEach-Object { $content = Get-Content $_.FullName -Raw -Encoding UTF8; if ($content -match '%OLD_WORD%') { $content -replace '%OLD_WORD%', '%NEW_WORD%' | Set-Content $_.FullName -Encoding UTF8 } }"

echo.
echo 모든 일괄 변경 작업이 완료되었습니다.
pause