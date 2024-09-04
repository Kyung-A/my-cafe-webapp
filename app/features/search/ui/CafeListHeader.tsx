interface ICafeListHeader {
  isActiveMenu: {
    id: string;
    name: string;
  };
  searchLocation: string | undefined | null;
  keyword: string | null;
}

export function CafeListHeader({
  isActiveMenu,
  searchLocation,
  keyword,
}: ICafeListHeader) {
  return (
    <>
      <h2 className="text-md mt-1 font-semibold leading-6">
        <>
          {searchLocation} 주변 <br />
        </>
      </h2>
      <h3 className="text-interaction text-xl font-semibold">
        {isActiveMenu.id === "search"
          ? `${keyword} ${isActiveMenu.name}`
          : isActiveMenu.name}
      </h3>
    </>
  );
}
