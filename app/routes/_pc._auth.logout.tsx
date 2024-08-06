import { ActionFunctionArgs } from "@remix-run/node";
import { logout } from "~/.server/storage";

export async function action({ request }: ActionFunctionArgs) {
  return logout(request);
}
