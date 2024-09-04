/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export function RefetchButton({
  handleRefetch,
}: {
  handleRefetch: (e: any) => void;
}) {
  return (
    <button
      onClick={handleRefetch}
      className="bg-primary fixed bottom-6 left-1/2 z-50 ml-14 rounded-full px-5 py-2"
    >
      <div className="flex items-center gap-2">
        <div className="w-5">
          <ArrowPathIcon className="text-white" />
        </div>
        <span className="font-bold text-white">현 지도에서 검색</span>
      </div>
    </button>
  );
}
