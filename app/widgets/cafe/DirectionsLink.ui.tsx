import { Link } from "@remix-run/react";

interface IDirectionsLink {
  text: string;
  state: {
    x: string;
    y: string;
    name: string;
    position: string;
  };
  onClick: () => void;
}

export function DirectionsLink({ text, state, onClick }: IDirectionsLink) {
  return (
    <Link
      to="/search/directions"
      state={state}
      onClick={onClick}
      className="border-interaction text-interaction mr-2 inline-block rounded-full border px-4 py-[2px] text-sm font-semibold"
    >
      {text}
    </Link>
  );
}
