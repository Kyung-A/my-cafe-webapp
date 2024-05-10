import { redirect } from "@remix-run/react";

export const loader = async () => redirect("/search");
