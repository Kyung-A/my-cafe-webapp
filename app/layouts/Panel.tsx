export const Panel = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="absolute w-72 h-full top-0 left-0 z-10 shadow-[4px_-1px_9px_0px_#52525230]">
      <div className="bg-white w-full h-full">{children}</div>
      <button className="absolute w-5 h-12 -mt-6 top-1/2 -right-5">
        <div className="w-full h-full bg-white flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
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
