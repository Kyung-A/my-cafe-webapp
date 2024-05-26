export function imageMaxSize(file: File, maxSize = 3000000) {
  if (file.size > maxSize) {
    alert("이미지 사이즈는 3MB 이내로 가능합니다.");
    return true;
  }
  return false;
}
