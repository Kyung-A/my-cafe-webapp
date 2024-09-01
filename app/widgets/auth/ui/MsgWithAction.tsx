import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";

interface IMsgWithAction {
  link: string;
  buttonText: string;
  Msg: string;
}

export function MsgWithAction({ link, buttonText, Msg }: IMsgWithAction) {
  return (
    <>
      <p className="text-center text-sm font-semibold">{Msg}</p>
      <Link
        to={link}
        className="text-interaction mt-1 flex items-center justify-center gap-2 text-center font-semibold"
      >
        <span>{buttonText}</span>
        <ArrowLongRightIcon className="w-6" />
      </Link>
    </>
  );
}
