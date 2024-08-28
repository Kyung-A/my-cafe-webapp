import { useEffect, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { IMenu, IReview } from "~/shared/types";

interface ISearch {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  handleEnter: (
    e: { key: string },
    text: string,
    userReview: IReview[]
  ) => void;
  onSubmit: (text: string, userReview: IReview[]) => void;
  isActiveMenu: IMenu | undefined;
  userReview: IReview[];
}

export function SearchForm({
  searchInput,
  setSearchInput,
  handleEnter,
  onSubmit,
  isActiveMenu,
  userReview,
}: ISearch) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      if (!isActiveMenu || isActiveMenu.id !== "search") {
        inputRef.current.value = "";
      }
    }
  }, [isActiveMenu, inputRef]);

  return (
    <div className="flex w-full items-center justify-between overflow-hidden rounded bg-white">
      <input
        ref={inputRef}
        type="search"
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={(e) => handleEnter(e, searchInput, userReview)}
        placeholder="찾으시는 카페가 있으신가요?"
        className="box-border w-[90%] border-none p-2 text-base outline-none placeholder:text-base placeholder:text-zinc-400"
      />
      <button
        type="button"
        onClick={() => onSubmit(searchInput, userReview)}
        className="p-2"
      >
        <MagnifyingGlassIcon className="w-5 text-gray-400" />
      </button>
    </div>
  );
}
