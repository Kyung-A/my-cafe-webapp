export const SearchForm = () => {
  return (
    <div className="flex w-full items-center justify-between overflow-hidden rounded-sm bg-white">
      <input
        type="search"
        placeholder="찾으시는 카페가 있으신가요?"
        className="box-border w-[90%] border-none p-2 text-base outline-none placeholder:text-base placeholder:text-zinc-400"
      />
      <button className="p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5 text-zinc-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </button>
    </div>
  );
};
