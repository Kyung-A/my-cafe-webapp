import { redirect } from "@remix-run/react";

// TODO: 추후 호그인여부를 가리는 분기점으로 활용 예정
export const loader = async () => redirect("/search");
