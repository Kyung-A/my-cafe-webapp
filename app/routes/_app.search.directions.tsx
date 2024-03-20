/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionFunctionArgs } from "@remix-run/node";
import {
  Form,
  json,
  useActionData,
  useLocation,
  useOutletContext,
} from "@remix-run/react";
import { useEffect, useState } from "react";

import { getDirection } from "~/.server/search";
import { Panel } from "~/components";
import { useRemove } from "~/hooks";
import { useMap } from "~/shared/contexts/Map";
import { IPolyline } from "~/shared/types";

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
  const location = useLocation();
  const directions = useActionData<typeof action>();
  const { coordinate } = useOutletContext<any>();
  const { mapData } = useMap();
  const { removeMarker } = useRemove();

  const [startInput, setStartInput] = useState<IDirectionInput>();
  const [endInput, setEndInput] = useState<IDirectionInput>();
  const [focusInput, setFocusInput] = useState<string>();
  const [startMarker, setStartMarker] = useState<any>();
  const [endMarker, setEndMarker] = useState<any>();

  useEffect(() => {
    removeMarker();
  }, []);

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
  }, [location, mapData]);

  useEffect(() => {
    const { kakao } = window;
    if (!kakao) return;

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
  }, [coordinate, mapData]);

  useEffect(() => {
    const { kakao } = window;
    if (!kakao) return;

    const linePath: IPolyline[] = [];
    if (directions) {
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
        polyline.setMap(mapData);
      });
    }
  }, [directions, mapData]);

  return (
    <Panel left="320px">
      <Form method="post">
        <div className="bg-primary flex h-12 w-full flex-col justify-center px-4">
          <h1 className="text-xl font-semibold">길찾기</h1>
        </div>
        <div className="w-full  px-4 py-6">
          <p className="break-keep text-sm text-neutral-500">
            도착지 / 출발지를 선택 후 검색 또는 메뉴를 통해 이동할 곳을
            선택해주세요!
          </p>
          <div className="mt-2 w-full rounded border border-neutral-400">
            <input
              name="origin"
              value={startInput?.value}
              onChange={() => null}
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
              value={endInput?.value}
              onChange={() => null}
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
        </div>
      </Form>
    </Panel>
  );
}
