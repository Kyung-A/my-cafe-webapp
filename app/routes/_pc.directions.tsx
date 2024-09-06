/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionFunctionArgs } from "@remix-run/node";
import {
  json,
  useActionData,
  useLocation,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";

import { getDirection } from "~/.server/search";
import { Panel } from "~/shared/ui";
import { useMap } from "~/providers/Map";
import { useOverlay } from "~/providers/Overlay";
import {
  createPolyline,
  getKeywordSearchData,
  handleRemoveAll,
  handleRemovePolyline,
} from "~/entities/directions";
import { getSingleMarker } from "~/entities/search/model/getSingleMarker";
import {
  removeClusterer,
  removeMarker,
  removewOverlay,
} from "~/entities/search";
import { ISearchData } from "~/entities/search/types";
import { DirectionsForm, DirectionsInfo } from "~/features/directions";

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
  const [data, setData] = useState<ISearchData[]>([]);
  const [inputValue, setInputValue] = useState<{ [key: string]: string }>();

  const handleInputChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInputValue(focusInput === "start" ? { start: value } : { end: value });
      const { data } = await getKeywordSearchData(mapData, value);
      setData(data);
    },
    [mapData, focusInput]
  );

  const removeCurMarker = useCallback(
    (focus: string) => {
      if (focus === "start") startMarker?.setMap(null);
      if (focus === "end") endMarker?.setMap(null);
    },
    [endMarker, startMarker]
  );

  const updateMarker = useCallback(
    (x: string, y: string, dispatch: React.SetStateAction<any>) => {
      const marker = getSingleMarker(mapData, {
        y: y,
        x: x,
      });

      dispatch(marker);
    },
    [mapData]
  );

  const onClickList = useCallback(
    (item: ISearchData, focus: string | undefined) => {
      if (focus === "start") {
        removeCurMarker("start");
        updateMarker(item.x, item.y, setStartMarker);

        setStartInput({
          value: `${item.x},${item.y}`,
          name: item.place_name,
        });
        setInputValue({ start: item.place_name });
      } else {
        removeCurMarker("end");
        updateMarker(item.x, item.y, setEndMarker);

        setEndInput({
          value: `${item.x},${item.y}`,
          name: item.place_name,
        });
        setInputValue({ end: item.place_name });
      }
      setFocusInput("");
      setData([]);
    },
    [removeCurMarker, updateMarker]
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      handleRemovePolyline(polylines);
      submit(event.currentTarget);
    },
    [polylines, submit]
  );

  const handleBack = () => {
    handleRemoveAll(startMarker, endMarker, polylines);
    naviagte("/search");
  };

  useEffect(() => {
    const { kakao } = window;
    if (!kakao) return;

    if (location.state) {
      const { x, y, name, position } = location.state;

      const marker = getSingleMarker(
        mapData,
        { y: y, x: x, name: name },
        false
      );

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
  }, [location.state, mapData]);

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
          {data.length > 0 && (
            <ul className="absolute top-[92px] box-border h-40 w-full overflow-y-auto rounded-lg bg-white px-4 shadow-[0px_0px_10px_-2px_#4343432e]">
              {data.map((item) => (
                <li
                  key={item.id}
                  className="w-full border-b py-2 last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => onClickList(item, focusInput)}
                    className="block w-full text-left"
                  >
                    {item.place_name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <DirectionsForm
          onSubmit={handleSubmit}
          startValue={startInput?.value || ""}
          endValue={endInput?.value || ""}
        />
        <hr className="mt-6 border-t border-neutral-200" />
        {directions && <DirectionsInfo data={directions} />}
      </div>
    </Panel>
  );
}
