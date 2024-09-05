export function Textarea(
  props: React.InputHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className="h-full w-full resize-none rounded border border-neutral-300 px-3 py-2 outline-none placeholder:text-neutral-300"
    ></textarea>
  );
}
