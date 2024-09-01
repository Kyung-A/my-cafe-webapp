export const converTime = (sec: number) => {
  let result: string = "";
  const min = Math.floor(sec / 60);
  if (min > 60) {
    const h = Math.floor(min / 60);
    const m = Math.floor(min % 60);
    result = `${h}시간 ${m}분`;
  } else {
    result = `${min}분`;
  }
  return result;
};
