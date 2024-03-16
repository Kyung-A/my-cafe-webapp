export const Panel = ({
  children,
  left,
}: {
  children: React.ReactNode;
  left?: string;
}) => {
  return (
    <div
      className="absolute top-0 z-10 h-full w-80 shadow-[4px_-1px_9px_0px_#52525230]"
      style={{ left: left ?? "0px" }}
    >
      <div className="h-full w-full bg-white">{children}</div>
      <button className="absolute -right-5 top-1/2 -mt-6 h-12 w-5">
        <div className="flex h-full w-full items-center justify-center bg-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
      </button>
    </div>
  );
};
