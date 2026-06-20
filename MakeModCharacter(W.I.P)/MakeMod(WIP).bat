@echo off
chcp 65001 >nul
setlocal

:: ==========================================
:: 1. 폴더 및 캐릭터 이름 설정 (여기를 수정하세요)
:: ==========================================
set "VANILLA_DIR=vanilla_musketeer"
set "TARGET_DIR=mod_stargrit"
set "OLD_NAME=musketeer"
set "NEW_NAME=stargrit"

set "OLD_NAME_CAP=Musketeer"
set "NEW_NAME_CAP=Stargrit"

set "OLD_NAME_UP=MUSKETEER"
set "NEW_NAME_UP=STARGRIT"

echo ===================================================
echo 다키스트 던전 캐릭터 모드 생성기
echo ===================================================

if not exist "%VANILLA_DIR%" (
    echo [오류] 원본 폴더(%VANILLA_DIR%)를 찾을 수 없습니다.
    pause
    exit /b
)

echo [1/3] 파일을 새 폴더로 복사하는 중...
xcopy "%VANILLA_DIR%" "%TARGET_DIR%" /E /I /H /Y >nul

echo [2/3] 파일 내부 데이터(텍스트) 치환 중...
powershell -Command "Get-ChildItem -Path '%TARGET_DIR%' -Recurse -File -Include *.darkest, *.xml, *.txt, *.string_table | ForEach-Object { $content = Get-Content $_.FullName -Raw -Encoding UTF8; $content = $content -cReplace '%OLD_NAME%', '%NEW_NAME%' -cReplace '%OLD_NAME_CAP%', '%NEW_NAME_CAP%' -cReplace '%OLD_NAME_UP%', '%NEW_NAME_UP%'; Set-Content -Path $_.FullName -Value $content -Encoding UTF8 -NoNewline }"

echo [3/3] 파일 이름 변경 중...
powershell -Command "Get-ChildItem -Path '%TARGET_DIR%' -Recurse -File | ForEach-Object { $newName = $_.Name -cReplace '%OLD_NAME%', '%NEW_NAME%' -cReplace '%OLD_NAME_CAP%', '%NEW_NAME_CAP%' -cReplace '%OLD_NAME_UP%', '%NEW_NAME_UP%'; if ($newName -cne $_.Name) { Rename-Item $_.FullName -NewName $newName } }"

echo ===================================================
echo [완료] 성공적으로 %TARGET_DIR% 모드가 생성되었습니다!
echo ===================================================
pause