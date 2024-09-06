import { IDirections } from "~/entities/directions/types";
import { converDistance } from "~/shared/lib/converDistance";
import { converTime } from "~/shared/lib/converTime";

interface IDirectionsInfo {
  data: IDirections;
}

export function DirectionsInfo({ data }: IDirectionsInfo) {
  return (
    <>
      <h2 className="text-interaction mt-6 text-sm">최적경로</h2>
      <h3 className="mt-1 text-xl font-semibold">
        {converTime(data.routes[0].summary.duration)}
        <span className="ml-2 text-sm font-light text-neutral-400">
          {converDistance(data.routes[0].summary.distance)}km
        </span>
      </h3>
      <p className="mt-1 text-sm">
        <span className="mr-2">택시비</span>
        {data.routes[0].summary.fare.taxi.toLocaleString("ko-KR")}원
      </p>
      <p className="text-sm">
        <span className="mr-2">통행요금</span>
        {data.routes[0].summary.fare.toll.toLocaleString("ko-KR")}원
      </p>
    </>
  );
}
