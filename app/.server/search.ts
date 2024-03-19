import axios from "axios";
import { IDirection } from "~/shared/types";

export async function getCafeDetail(id: string) {
  const result = await axios.get(`https://place.map.kakao.com/main/v/${id}`);
  return result.data;
}

export async function getDirection(data: IDirection) {
  try {
    const result = await axios.get(
      `https://apis-navi.kakaomobility.com/v1/directions?origin=${data.origin}&destination=${data.destination}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.MOBILITY_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return result.data;
  } catch (err) {
    console.error(err);
    return null;
  }
}
