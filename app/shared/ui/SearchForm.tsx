/* eslint-disable @typescript-eslint/no-explicit-any */
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { IReview } from "~/shared/types";

interface ISearch {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  handleInteraction: (e: any, text: string) => void;
  userReview: IReview[];
}

export function SearchForm({
  searchInput,
  setSearchInput,
  handleInteraction,
}: ISearch) {
  return (
    <div className="flex w-full items-center justify-between overflow-hidden rounded bg-white">
      <input
        type="search"
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={(e) => handleInteraction(e, searchInput)}
        placeholder="찾으시는 카페가 있으신가요?"
        className="box-border w-[90%] border-none p-2 text-base outline-none placeholder:text-base placeholder:text-zinc-400"
      />
      <button
        type="button"
        onClick={(e) => handleInteraction(e, searchInput)}
        className="p-2"
      >
        <MagnifyingGlassIcon className="w-5 text-gray-400" />
      </button>
    </div>
  );
}
