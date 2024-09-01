import { useState } from "react";

import { FileInput } from "~/shared/ui";
import { imageMaxSize } from "~/shared/lib/imageMaxSize";

interface IPreviewWithAction {
  handleFileUpload: () => void;
  preview: string | undefined;
}

interface IUploadProfile {
  handleFileUpload: () => void;
  fileRef: React.MutableRefObject<HTMLInputElement | null>;
}

function PreviewWithAction({ handleFileUpload, preview }: IPreviewWithAction) {
  return (
    <div className="bg-trueGray-200 relative mx-auto h-20 w-20 overflow-hidden rounded-full">
      <button
        type="button"
        onClick={handleFileUpload}
        className="absolute left-0 top-0 z-10 block h-full w-full bg-transparent"
      ></button>
      {preview && (
        <img
          src={preview}
          alt="프로필 이미지"
          className="absolute z-[5] h-full w-full object-cover"
        />
      )}
    </div>
  );
}

export function UploadProfile({ handleFileUpload, fileRef }: IUploadProfile) {
  const [preview, setPreview] = useState<string>();

  return (
    <>
      <PreviewWithAction
        handleFileUpload={handleFileUpload}
        preview={preview}
      />
      <FileInput
        name="profile"
        ref={fileRef}
        onChange={(e) => {
          if (e.target.files) {
            for (const file of e.target.files) {
              if (imageMaxSize(file)) return;
              setPreview(URL.createObjectURL(file));
            }
          }
        }}
      />
    </>
  );
}
