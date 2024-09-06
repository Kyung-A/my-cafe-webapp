import { Form } from "@remix-run/react";

interface IDirectionsForm {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  startValue: string;
  endValue: string;
}

export function DirectionsForm({
  onSubmit,
  startValue,
  endValue,
}: IDirectionsForm) {
  return (
    <Form method="post" onSubmit={onSubmit}>
      <input name="origin" value={startValue} hidden readOnly />
      <input name="destination" value={endValue} hidden readOnly />
      <button
        type="submit"
        className="bg-interaction mt-4 rounded-full px-5 py-1 text-white"
      >
        길찾기
      </button>
    </Form>
  );
}
