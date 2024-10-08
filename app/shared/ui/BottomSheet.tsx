import { MinusIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface IMobilePanel {
  children: React.ReactNode;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  fullSheet: boolean;
}

export function BottomSheet({
  children,
  isDragging,
  setIsDragging,
  fullSheet,
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
      Math.min(
        Math.max(currentY, fullSheet ? -100 : 80),
        window.innerHeight - 120
      ),
    [currentY, fullSheet]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (bottomSheetRef.current) {
      const scrollEl = bottomSheetRef.current.querySelector(
        ".overflow-y-auto"
      ) as HTMLElement;
      if (!scrollEl) return;

      const rect = bottomSheetRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const visibleTop = Math.max(rect.top, 0);
      const visibleBottom = Math.min(rect.bottom, windowHeight);
      const visibleHeight = visibleBottom - visibleTop;

      scrollEl.style.height = `${Math.max(0, visibleHeight)}px`;
    }
  }, [bottomSheetRef.current, translateY]);

  return (
    <>
      {mounted && (
        <div
          ref={bottomSheetRef}
          onMouseMove={handleTouchMove}
          style={{
            transform: `translateY(${translateY}px)`,
            borderRadius: (translateY as number) <= -100 ? "" : "1.5rem",
          }}
          className="absolute z-10 w-full overflow-hidden bg-white shadow-[4px_-1px_9px_0px_#52525230]"
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
