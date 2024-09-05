import { useCallback, useRef } from "react";

export function useImageUpload() {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = useCallback(() => {
    if (fileRef?.current) {
      fileRef.current.click();
    }
  }, [fileRef]);

  return { fileRef, handleFileUpload };
}
