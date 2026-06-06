function countDriveItems() {
  var files = DriveApp.getFiles();
  var folders = DriveApp.getFolders();
  var fileCount = 0;
  var folderCount = 0;
  
  // 파일 개수 세기 (수량이 많으면 시간이 걸릴 수 있습니다)
  while (files.hasNext()) {
    fileCount++;
    files.next();
  }
  
  // 폴더 개수 세기
  while (folders.hasNext()) {
    folderCount++;
    folders.next();
  }
  
  var total = fileCount + folderCount;
  var remaining = 5000000 - total;
  
  Logger.log("총 파일 개수: " + fileCount + "개");
  Logger.log("총 폴더 개수: " + folderCount + "개");
  Logger.log("총 사용 중인 항목: " + total + "개 / 5,000,000개");
  Logger.log("남은 생성 가능 항목: " + remaining + "개");
}