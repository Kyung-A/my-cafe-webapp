export const Panel = ({
  children,
  left = "0px",
  open,
}: {
  children: React.ReactNode;
  left?: string;
  open?: boolean;
}) => {
  return (
    <div
      className="absolute top-0 z-10 h-full w-80 shadow-[4px_-1px_9px_0px_#52525230] transition-all"
      style={{
        left: open
          ? location.pathname === "/search"
            ? "-320px"
            : "-640px"
          : left,
      }}
    >
      <div className="h-full w-full bg-white">{children}</div>
    </div>
  );
};
