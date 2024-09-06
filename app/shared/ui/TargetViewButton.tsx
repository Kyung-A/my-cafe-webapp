import { memo } from "react";
import targetView from "~/assets/target.svg";

interface ITargetView {
  onClick: () => void;
}

export const TargetViewButton = memo(function TargetViewButton({
  onClick,
}: ITargetView) {
  return (
    <button
      onClick={onClick}
      className="fixed right-4 top-4 flex h-8 w-8 flex-col items-center justify-center rounded bg-white shadow-[0px_0px_7px_0px_#0006]"
    >
      <img src={targetView} alt="현재 내위치" className="block w-6" />
    </button>
  );
});
