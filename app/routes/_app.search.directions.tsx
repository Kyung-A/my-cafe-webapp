/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionFunctionArgs } from "@remix-run/node";
import {
  Form,
  json,
  useActionData,
  useLocation,
  useNavigate,
  useOutletContext,
  useSubmit,
} from "@remix-run/react";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";

import { getDirection } from "~/.server/search";
import { Panel } from "~/components";
import { useRemove } from "~/hooks";
import { useMap } from "~/shared/contexts/Map";
import { IPolyline } from "~/shared/types";
import xMark from "~/assets/xMark.svg";
import { converTime } from "~/shared/utils/converTime";
import { converDistance } from "~/shared/utils/converDistance";
import { useOverlay } from "~/shared/contexts/Overlay";

interface IDirectionInput {
  value: string;
  name: string;
}

interface IRoads {
  distance: number;
  duration: number;
  name: string;
  traffic_speed: number;
  traffic_state: number;
  vertexes: number[];
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const origin = String(formData.get("origin"));
  const destination = String(formData.get("destination"));
  const result = await getDirection({ origin, destination });

  return json(result);
}

export default function DirectionsRoute() {
  const submit = useSubmit();
  const location = useLocation();
  const naviagte = useNavigate();
  const directions = useActionData<typeof action>();
  const { coordinate } = useOutletContext<any>();

  const { mapData, markers, clusterer } = useMap();
  const { overlayArr, listOverlayArr } = useOverlay();
  const { removeMarker, removewOverlay } = useRemove();

  const [startInput, setStartInput] = useState<IDirectionInput>();
  const [endInput, setEndInput] = useState<IDirectionInput>();
  const [focusInput, setFocusInput] = useState<string>();
  const [startMarker, setStartMarker] = useState<any>();
  const [endMarker, setEndMarker] = useState<any>();
  const [polylines, setPolylines] = useState<{ [key: string]: any }[]>([]);

  const handleRemovePolyline = useCallback(() => {
    polylines.forEach((v) => v.setMap(null));
  }, [polylines]);

  const handleRemoveAll = () => {
    if (startMarker || endMarker) {
      endMarker?.setMap(null);
      startMarker?.setMap(null);
    }
    handleRemovePolyline();
  };

  useLayoutEffect(() => {
    if (markers.length > 0) {
      removeMarker();
      removewOverlay(overlayArr);
      listOverlayArr[0]?.setMap(null);
      clusterer?.clear();
    }
  }, [markers, overlayArr, listOverlayArr]);

  useEffect(() => {
    const { kakao } = window;

    if (location.state && kakao) {
      const { x, y, name, position } = location.state;

      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(y, x),
      });

      if (position === "start") {
        setStartInput({
          value: `${x},${y}`,
          name: name,
        });
        setStartMarker(marker);
      } else {
        setEndInput({
          value: `${x},${y}`,
          name: name,
        });
        setEndMarker(marker);
      }
    }
  }, [location]);

  useEffect(() => {
    const { kakao } = window;
    if (!kakao) return;
    handleRemovePolyline();

    if (startMarker) {
      startMarker.setMap(mapData);
    }
    if (endMarker) {
      endMarker.setMap(mapData);
    }
  }, [endMarker, startMarker, mapData]);

  useEffect(() => {
    const { kakao } = window;
    if (!kakao) return;

    if (coordinate) {
      if (focusInput === "start") {
        setStartInput({
          value: `${coordinate.x},${coordinate.y}`,
          name: coordinate.name,
        });

        if (startMarker) {
          startMarker.setMap(null);
        }

        const marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(coordinate.y, coordinate.x),
        });
        setStartMarker(marker);
      } else {
        setEndInput({
          value: `${coordinate.x},${coordinate.y}`,
          name: coordinate.name,
        });

        if (endMarker) {
          endMarker.setMap(null);
        }
        const marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(coordinate.y, coordinate.x),
        });

        setEndMarker(marker);
      }
      setFocusInput("");
    }
  }, [coordinate]);

  useEffect(() => {
    const { kakao } = window;
    if (!kakao) return;

    const linePath: IPolyline[] = [];
    if (directions) {
      const polylineArr: { [key: string]: any }[] = [];

      directions.routes[0].sections[0].roads.forEach((road: IRoads) => {
        road.vertexes.forEach((vertex: number, idx: number) => {
          if (idx % 2 === 0) {
            linePath.push(
              new kakao.maps.LatLng(road.vertexes[idx + 1], road.vertexes[idx])
            );
          }
        });
        const polyline = new kakao.maps.Polyline({
          map: mapData,
          path: linePath,
          strokeWeight: 5,
          strokeColor: "rgb(54 22 137)",
          strokeOpacity: 0.5,
          strokeStyle: "solid",
        });
        polylineArr.push(polyline);
        polyline.setMap(mapData);
      });
      setPolylines(polylineArr);
    }
  }, [directions, mapData]);

  return (
    <Panel left="320px">
      <button
        onClick={() => {
          handleRemoveAll();
          naviagte("/search");
        }}
        className="bg-primary absolute left-80 top-0 flex h-12 w-12 flex-col items-center justify-center"
      >
        <img src={xMark} alt="닫기" className="w-8" />
      </button>
      <Form
        method="post"
        onSubmit={(event) => {
          handleRemovePolyline();
          submit(event.currentTarget);
        }}
      >
        <div className="bg-primary flex h-12 w-full flex-col justify-center px-4">
          <h1 className="text-xl font-semibold">길찾기</h1>
        </div>
        <div className="w-full px-4 py-6">
          <p className="break-keep text-sm text-neutral-500">
            도착지 / 출발지를 선택 후 검색 또는 메뉴를 통해 이동할 곳을
            선택해주세요!
          </p>
          <div className="mt-2 w-full rounded border border-neutral-400">
            <input
              name="origin"
              value={startInput?.value || ""}
              hidden
              readOnly
            />
            <button
              type="button"
              onClick={() => setFocusInput("start")}
              className={`relative w-full cursor-pointer rounded-t border-b-[1px] border-neutral-400 p-2 text-left outline-none ${focusInput === "start" ? "focusBorder" : ""}`}
            >
              {startInput?.name ? (
                startInput?.name
              ) : (
                <span className="text-neutral-400">출발지를 선택해주세요.</span>
              )}
            </button>
            <input
              name="destination"
              value={endInput?.value || ""}
              hidden
              readOnly
            />
            <button
              type="button"
              onClick={() => setFocusInput("end")}
              className={`w-full cursor-pointer rounded-b p-2 text-left outline-none ${focusInput === "end" ? "focusBorder" : ""}`}
            >
              {endInput?.name ? (
                endInput?.name
              ) : (
                <span className="text-neutral-400">도착지를 선택해주세요.</span>
              )}
            </button>
          </div>
          <button
            type="submit"
            className="bg-interaction mt-2 rounded-full px-5 py-1 text-white"
          >
            길찾기
          </button>
          {directions && (
            <div className="mt-6 border-t border-neutral-200">
              <h2 className="text-interaction mt-6 text-sm">최적경로</h2>
              <h3 className="mt-1 text-xl font-semibold">
                {converTime(directions.routes[0].summary.duration)}
                <span className="ml-2 text-sm font-light text-neutral-400">
                  {converDistance(directions.routes[0].summary.distance)}km
                </span>
              </h3>
              <p className="mt-1 text-sm">
                <span className="mr-2">택시비</span>
                {directions.routes[0].summary.fare.taxi.toLocaleString("ko-KR")}
                원
              </p>
              <p className="text-sm">
                <span className="mr-2">통행요금</span>
                {directions.routes[0].summary.fare.toll.toLocaleString("ko-KR")}
                원
              </p>
            </div>
          )}
        </div>
      </Form>
    </Panel>
  );
}
