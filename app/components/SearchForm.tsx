import search from "~/assets/search.svg";

interface ISearch {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  handleEnter: (e: { key: string }, text: string) => void;
  onSubmit: (text: string) => void;
}

export function SearchForm({
  searchInput,
  setSearchInput,
  handleEnter,
  onSubmit,
}: ISearch) {
  return (
    <div className="flex w-full items-center justify-between overflow-hidden rounded bg-white">
      <input
        type="search"
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={(e) => handleEnter(e, searchInput)}
        placeholder="찾으시는 카페가 있으신가요?"
        className="box-border w-[90%] border-none p-2 text-base outline-none placeholder:text-base placeholder:text-zinc-400"
      />
      <button
        type="button"
        onClick={() => onSubmit(searchInput)}
        className="p-2"
      >
        <img src={search} className="w-5" alt="검색" />
      </button>
    </div>
  );
}
