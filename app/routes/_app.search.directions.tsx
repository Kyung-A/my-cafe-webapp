/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionFunctionArgs } from "@remix-run/node";
import { Form, json, useLocation, useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";

import { getDirection } from "~/.server/search";
import { Panel } from "~/components";

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
  const location = useLocation();
  const { coordinate } = useOutletContext<any>();

  const [startInput, setStartInput] = useState<IDirectionInput>();
  const [endInput, setEndInput] = useState<IDirectionInput>();
  const [focusInput, setFocusInput] = useState<string>();

  useEffect(() => {
    if (location.state) {
      const { x, y, name, position } = location.state;
      if (position === "start") {
        setStartInput({
          value: `${x},${y}`,
          name: name,
        });
      } else {
        setEndInput({
          value: `${x},${y}`,
          name: name,
        });
      }
    }
  }, [location]);

  useEffect(() => {
    if (coordinate) {
      if (focusInput === "start") {
        setStartInput({
          value: `${coordinate.x},${coordinate.y}`,
          name: coordinate.name,
        });
      } else {
        setEndInput({
          value: `${coordinate.x},${coordinate.y}`,
          name: coordinate.name,
        });
      }
      setFocusInput("");
    }
  }, [coordinate]);

  return (
    <Panel left="320px">
      <Form method="post" navigate={false}>
        <div className="bg-primary flex h-12 w-full flex-col justify-center px-4">
          <h1 className="text-xl font-semibold">길찾기</h1>
        </div>
        <div className="w-full  px-4 py-6">
          <p className="break-keep text-sm text-neutral-500">
            도착지 / 출발지를 선택 후 검색 또는 메뉴를 통해 이동할 곳을
            선택해주세요!
          </p>
          <div className="mt-2 w-full rounded border border-neutral-400">
            <input name="origin" value={startInput?.value} hidden readOnly />
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
            <input name="destination" value={endInput?.value} hidden readOnly />
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
