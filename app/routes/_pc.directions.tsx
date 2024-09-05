/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionFunctionArgs } from "@remix-run/node";
import {
  Form,
  json,
  useActionData,
  useLocation,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";

import { getDirection } from "~/.server/search";
import { Panel } from "~/shared/ui";
import { useMap } from "~/providers/Map";
import { converTime } from "~/shared/lib/converTime";
import { converDistance } from "~/shared/lib/converDistance";
import { useOverlay } from "~/providers/Overlay";
import {
  createPolyline,
  handleRemoveAll,
  handleRemovePolyline,
} from "~/entities/directions";
import { getSingleMarker } from "~/entities/search/model/getSingleMarker";
import {
  removeClusterer,
  removeMarker,
  removewOverlay,
} from "~/entities/search";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import { ISearchData } from "~/entities/search/types";

interface IDirectionInput {
  value: string;
  name: string;
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

  const { mapData, markers, setMarkers, clusterer } = useMap();
  const { overlayArr, listOverlayArr } = useOverlay();

  const [startInput, setStartInput] = useState<IDirectionInput>();
  const [endInput, setEndInput] = useState<IDirectionInput>();
  const [focusInput, setFocusInput] = useState<string>();
  const [startMarker, setStartMarker] = useState<Record<string, any>>();
  const [endMarker, setEndMarker] = useState<Record<string, any>>();
  const [polylines, setPolylines] = useState<Record<string, any>[] | undefined>(
    []
  );
  const [filteredItems, setFilteredItems] = useState<ISearchData[]>([]);
  const [inputValue, setInputValue] = useState<{ [key: string]: string }>();

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInputValue(focusInput === "start" ? { start: value } : { end: value });

      const { kakao } = window;
      if (!kakao || !mapData) return;

      const ps = new kakao.maps.services.Places(mapData);
      ps.keywordSearch(
        value,
        (data: ISearchData[], status: string) => {
          if (status !== kakao.maps.services.Status.OK) return;
          setFilteredItems(data);
        },
        { useMapBounds: true, useMapCenter: true, radius: 1000 }
      );
    },
    [mapData, focusInput]
  );

  const onClickList = useCallback(
    (item: ISearchData) => {
      if (focusInput === "start") {
        if (startMarker) startMarker.setMap(null);

        const marker = getSingleMarker(mapData, {
          y: item.y,
          x: item.x,
        });
        setStartInput({
          value: `${item.x},${item.y}`,
          name: item.place_name,
        });
        setStartMarker(marker);
        setInputValue({ start: item.place_name });
      } else {
        if (endMarker) endMarker.setMap(null);

        const marker = getSingleMarker(mapData, {
          y: item.y,
          x: item.x,
        });
        setEndInput({
          value: `${item.x},${item.y}`,
          name: item.place_name,
        });
        setEndMarker(marker);
        setInputValue({ end: item.place_name });
      }
      setFocusInput("");
      setFilteredItems([]);
    },
    [endMarker, focusInput, mapData, startMarker]
  );

  const handleBack = useCallback(() => {
    handleRemoveAll(startMarker, endMarker, polylines);
    naviagte("/search");
  }, [endMarker, naviagte, polylines, startMarker]);

  useEffect(() => {
    const { kakao } = window;
    if (!kakao) return;

    if (location.state) {
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
        setInputValue({ start: name });
      } else {
        setEndInput({
          value: `${x},${y}`,
          name: name,
        });
        setEndMarker(marker);
        setInputValue({ end: name });
      }
    }
  }, [location]);

  useEffect(() => {
    const { kakao } = window;
    if (!kakao) return;
    handleRemovePolyline(polylines);
    if (startMarker) {
      startMarker.setMap(mapData);
    }
    if (endMarker) {
      endMarker.setMap(mapData);
    }
  }, [endMarker, startMarker, mapData]);

  useEffect(() => {
    const polyline = createPolyline(directions, mapData);
    setPolylines(polyline);
  }, [directions, mapData]);

  useEffect(() => {
    removeMarker(markers, setMarkers);
    removewOverlay(overlayArr, listOverlayArr);
    removeClusterer(clusterer);
  }, []);

  return (
    <Panel>
      <div className="bg-primary flex h-12 w-full items-center gap-2 px-4">
        <button
          type="button"
          onClick={handleBack}
          className="bg-primary flex flex-col items-center justify-center"
        >
          <ArrowLongLeftIcon className="w-6" />
        </button>
        <h1 className="text-xl font-semibold">길찾기</h1>
      </div>
      <div className="w-full px-4 py-6">
        <p className="break-keep text-sm text-neutral-500">
          도착지 / 출발지를 검색 후 선택해주세요.
        </p>
        <div className="relative">
          <div className="mt-2 w-full rounded border border-neutral-400">
            <input
              type="text"
              value={inputValue?.start}
              onChange={handleInputChange}
              onFocus={() => setFocusInput("start")}
              placeholder="출발지를 입력해주세요."
              className={`relative w-full cursor-pointer rounded-t border-b-[1px] border-neutral-400 p-2 text-left outline-none ${focusInput === "start" ? "focusBorder" : ""}`}
            />
            <input
              type="text"
              value={inputValue?.end}
              onChange={handleInputChange}
              onFocus={() => setFocusInput("end")}
              placeholder="도착지를 입력해주세요."
              className={`w-full cursor-pointer rounded-b p-2 text-left outline-none ${focusInput === "end" ? "focusBorder" : ""}`}
            />
          </div>
          {filteredItems.length > 0 && (
            <ul className="absolute top-[90px] box-border h-40 w-full overflow-y-auto rounded-lg bg-white px-4 shadow-md">
              {filteredItems.map((item) => (
                <li
                  key={item.id}
                  className="w-full border-b py-2 last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => onClickList(item)}
                    className="block w-full text-left"
                  >
                    {item.place_name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Form
          method="post"
          onSubmit={(event) => {
            handleRemovePolyline(polylines);
            submit(event.currentTarget);
          }}
        >
          <input
            name="origin"
            value={startInput?.value || ""}
            hidden
            readOnly
          />
          <input
            name="destination"
            value={endInput?.value || ""}
            hidden
            readOnly
          />
          <button
            type="submit"
            className="bg-interaction mt-2 rounded-full px-5 py-1 text-white"
          >
            길찾기
          </button>
        </Form>
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
              {directions.routes[0].summary.fare.taxi.toLocaleString("ko-KR")}원
            </p>
            <p className="text-sm">
              <span className="mr-2">통행요금</span>
              {directions.routes[0].summary.fare.toll.toLocaleString("ko-KR")}원
            </p>
          </div>
        )}
      </div>
    </Panel>
  );
}
