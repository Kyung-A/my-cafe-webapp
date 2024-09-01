interface IMenu {
  name: string;
  onClick?: () => void;
}

export function Menu({ onClick, name }: IMenu) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-primary w-full rounded border px-4 py-2 text-left"
    >
      {name}
    </button>
  );
}
