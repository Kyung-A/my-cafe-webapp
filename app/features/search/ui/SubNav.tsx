interface ISubNav {
  onClick: () => void;
  isActiveMenu: string;
}

export function SubNav({ onClick, isActiveMenu }: ISubNav) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-primary rounded-full border px-2 py-[2px] text-xs ${isActiveMenu === "visited" ? "bg-primary font-semibold text-white" : "text-zinc-400"}`}
    >
      방문한 카페
    </button>
  );
}
