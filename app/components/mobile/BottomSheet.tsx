import { MinusIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface IMobilePanel {
  children: React.ReactNode;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
}

export function BottomSheet({
  children,
  isDragging,
  setIsDragging,
}: IMobilePanel) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [startY, setStartY] = useState<number>(0);
  const [currentY, setCurrentY] = useState<number>(300);
  const bottomSheetRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      setIsDragging(true);
      const y = "touches" in e ? e.touches[0].clientY : e.clientY;
      setStartY(y - currentY);
    },
    [currentY]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (isDragging) {
        const y = "touches" in e ? e.touches[0].clientY : e.clientY;
        setCurrentY(y - startY);
      }
    },
    [isDragging, startY]
  );

  const translateY = useMemo(
    () =>
      typeof window !== "undefined" &&
      Math.min(Math.max(currentY, 80), window.innerHeight - 120),
    [currentY]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && (
        <div
          ref={bottomSheetRef}
          onMouseMove={handleTouchMove}
          style={{
            transform: `translateY(${translateY}px)`,
          }}
          className={`absolute z-10 h-screen w-full overflow-hidden rounded-t-3xl bg-white shadow-[4px_-1px_9px_0px_#52525230]`}
        >
          <button onMouseDown={handleTouchStart} className="w-full">
            <MinusIcon className="text-primary mx-auto w-12" />
          </button>
          <div>{children}</div>
        </div>
      )}
    </>
  );
}
