import Spinner from "@/components/Spinner";
import UserInfo from "@/components/UserInfo";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="max-w-6xl">
      <Suspense fallback={<Spinner />}>
        <UserInfo />
      </Suspense>
    </div>
  );
}
