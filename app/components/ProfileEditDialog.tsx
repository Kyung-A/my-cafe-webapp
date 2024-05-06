import { Form, useSubmit } from "@remix-run/react";
import { useCallback, useRef, useState } from "react";

import userImg from "~/assets/user.svg";
import { IRegister } from "~/shared/types";

interface IDialog {
  user: IRegister;
  isOpen: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ProfileEditDialog({ user, isOpen, setOpened }: IDialog) {
  const submit = useSubmit();

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string>(user.profile ?? userImg);
  const [username, setUsername] = useState<string>(user.name);

  const handleFileUpload = useCallback(() => {
    if (fileRef?.current) {
      fileRef.current.click();
    }
  }, [fileRef]);

  return (
    <dialog
      open={isOpen}
      className="fixed left-0 top-0 z-40 h-screen w-screen bg-transparent"
    >
      <div className="fixed left-1/2 top-1/2 z-50 -ml-[160px] -mt-[150px]">
        <div className=" w-80 rounded-md bg-white p-6">
          <h3 className="text-xl font-semibold">프로필 수정</h3>
          <div className="mt-6">
            <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full">
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
          </div>
          <div className="mt-2">
            <p className="text-center">{user.email}</p>
            <input
              defaultValue={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-trueGray-300 outline-primary mx-auto mt-2 block w-60 rounded-full border px-3 py-1"
            />
          </div>
          <div className="mt-8 flex items-center justify-center gap-2">
            <Form
              action="profileUpdate"
              method="post"
              encType="multipart/form-data"
              onSubmit={(e) => {
                submit(e.currentTarget);
                setOpened(false);
              }}
            >
              <input
                name="profile"
                ref={fileRef}
                onChange={(e) => {
                  if (e.target.files) {
                    for (const file of e.target.files) {
                      setPreview(URL.createObjectURL(file));
                    }
                  }
                }}
                type="file"
                accept=".jpg, .jpeg, .png"
                size={3145728}
                hidden
              />
              <input
                type="text"
                name="id"
                value={user.id || ""}
                hidden
                readOnly
              />
              <input
                type="text"
                name="name"
                value={username || ""}
                hidden
                readOnly
              />
              <button
                type="submit"
                className="bg-interaction rounded px-4 py-1 text-sm font-semibold text-white"
              >
                수정
              </button>
            </Form>
            <Form action="/logout" method="post">
              <button
                type="submit"
                className="bg-trueGray-200 text-trueGray-500 rounded px-4 py-1 text-sm font-semibold"
              >
                로그아웃
              </button>
            </Form>
          </div>
        </div>
      </div>
      <div
        onClick={() => setOpened(false)}
        aria-hidden="true"
        className="absolute left-0 top-0 h-full w-full bg-black bg-opacity-30"
      ></div>
    </dialog>
  );
}
