import axios from "axios";

export default async function getCafeDetail(id: string) {
  const result = await axios.get(`https://place.map.kakao.com/main/v/${id}`);
  return result.data;
}
