import { forwardRef } from "react";

interface IActionInput extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  onClickButton: () => void;
}

interface IFileInput extends React.InputHTMLAttributes<HTMLInputElement> {
  ref: React.MutableRefObject<HTMLInputElement | null>;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded border border-neutral-300 px-3 py-2 outline-none placeholder:text-neutral-300"
    />
  );
}

export function ActionInput({
  icon,
  onClickButton,
  ...otherProps
}: IActionInput) {
  return (
    <div className="flex items-center justify-between overflow-hidden rounded border border-neutral-300">
      <input
        {...otherProps}
        className="w-[90%] px-3 py-2 outline-none placeholder:text-neutral-300"
      />
      <button
        onClick={onClickButton}
        type="button"
        className="pr-2 text-neutral-400"
      >
        {icon}
      </button>
    </div>
  );
}

export const FileInput = forwardRef<HTMLInputElement, IFileInput>(
  (props, ref) => (
    <input {...props} ref={ref} type="file" accept=".jpg, .jpeg, .png" hidden />
  )
);

FileInput.displayName = "FileInput";
