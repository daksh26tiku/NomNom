import { getSession } from "@/lib/actions";
import { JWTPayload } from "jose";
import Navbar from "./Navbar";

export default async function NavWrapper() {
  const session = await getSession();
  return <Navbar userInfo={session as JWTPayload} />;
}
