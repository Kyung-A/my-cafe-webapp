/* eslint-disable @typescript-eslint/no-explicit-any */
import { json } from "@remix-run/node";
import { getCafeDetail } from "~/.server/search";

interface IParams {
  params: {
    cafeId: string;
  };
}

export async function loader({ params }: IParams) {
  const { cafeId } = params;
  const result = await getCafeDetail(cafeId);
  return json(result);
}
