import { logout } from "~/.server/storage";

export async function action({ request }: { request: Request }) {
  return logout(request);
}
