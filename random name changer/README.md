call :ProcessFolder 명령어 뒤에 **"폴더 경로"**와 **"고정할 이름"**을 나란히 적으면, 해당 폴더는 지정해주신 이름으로 무작위 파일 변경을 수행
코드를 복사하여 메모장에 붙여넣고 저장. (인코딩: ANSI 또는 EUC-KR)


폴더 경로 수정: 스크립트의 중간 즈음에 있는 call :ProcessFolder "..." 부분의 경로를 실제로 작업하실 폴더들의 경로로 변경해 주세요.

폴더 추가/삭제: 관리할 폴더가 3개가 아니라면 해당 줄을 지우거나 복사해서 더 추가하시면 됩니다. 갯수 제한 없이 모두 순차적으로 실행됩니다.


중간의 대상 폴더 및 고정 이름 지정 부분에서 경로와 이름을 세팅하시면 됩니다.

예를 들어, "C:\Images" 폴더의 파일을 "Cover"로 바꾸고 싶다면 아래처럼 한 줄을 추가하시면 됩니다.
call :ProcessFolder "C:\Images" "Cover"



:: ==========================================
:: 실제 파일 변경 작업 메인 루틴
:: ==========================================
:RunMain
call :ProcessFolder "C:\테스트\폴더1" "A"
call :ProcessFolder "D:\사진\폴더2" "B"
call :ProcessFolder "E:\문서\폴더3" "Main_File"

:: ▼ 폴더가 더 많다면 아래처럼 계속 추가하시면 됩니다 ▼
call :ProcessFolder "F:\업무\프로젝트" "Target"
call :ProcessFolder "G:\디자인\소스" "Design_Pick"
call :ProcessFolder "C:\Users\Public\Downloads" "Temp_A"
call :ProcessFolder "D:\Data\Archive" "Doc_01"
:: ▲ 필요한 만큼 무한정 추가 가능합니다 ▲

exit /b




원래 확장자를 찾아서 조합해 주던 코드를 제거하고, 고정 이름(%FIXED_NAME%) 그대로만 찾도록 수정합니다.

[수정 전]

DOS
    if exist "%FIXED_NAME%!ORIG_EXT!" (
        ren "%FIXED_NAME%!ORIG_EXT!" "!ORIG_NAME!"
        set "LAST_RESTORED=!ORIG_NAME!"
        echo   - [복구 완료] %FIXED_NAME%!ORIG_EXT! -^> !ORIG_NAME!
    )
[수정 후] !ORIG_EXT! 글자를 모두 지웁니다.

DOS
    if exist "%FIXED_NAME%" (
        ren "%FIXED_NAME%" "!ORIG_NAME!"
        set "LAST_RESTORED=!ORIG_NAME!"
        echo   - [복구 완료] %FIXED_NAME% -^> !ORIG_NAME!
    )
🛠️ 2. 새 파일 이름 변경 부분 수정
마찬가지로 새 파일에 원래 확장자를 붙여주던 코드를 제거합니다.

[수정 전]

DOS
echo !CHOSEN_FILE!> "%TRACK_FILE%"
for %%I in ("!CHOSEN_FILE!") do set "CHOSEN_EXT=%%~xI"
ren "!CHOSEN_FILE!" "%FIXED_NAME%!CHOSEN_EXT!"

echo   - [변경 완료] !CHOSEN_FILE! -^> %FIXED_NAME%!CHOSEN_EXT!
[수정 후] CHOSEN_EXT 관련 내용을 모두 지웁니다.

DOS
echo !CHOSEN_FILE!> "%TRACK_FILE%"
ren "!CHOSEN_FILE!" "%FIXED_NAME%"

echo   - [변경 완료] !CHOSEN_FILE! -^> %FIXED_NAME%
💡 이렇게 수정하면 어떻게 되나요?
이제 :RunMain에서 설정하신 이름이 확장자까지 포함된 완벽한 최종 파일명이 됩니다.

call :ProcessFolder "C:\테스트\폴더1" "A"
👉 원래 파일이 사진.jpg 였다면, 확장자 없는 그냥 A 라는 파일로 바뀝니다.

call :ProcessFolder "D:\사진\폴더2" "B.png"
👉 원래 파일이 메모.txt 였다 하더라도, 강제로 B.png 로 바뀝니다.
