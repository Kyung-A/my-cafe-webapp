/* eslint-disable @typescript-eslint/no-explicit-any */
export const markerOption = (kakao: { maps: { [key: string]: any } }) => {
  const imageSrc = "https://t1.daumcdn.net/mapjsapi/images/2x/marker.png",
    imageSize = new kakao.maps.Size(28, 40),
    markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
  return markerImage;
};
