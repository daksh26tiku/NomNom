import React, { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Spinner from "@/components/Spinner";
import UserEditInfoWrapper from "@/components/UserEditInfoWrapper";
import UserEditPasswordForm from "@/components/UserEditPasswordForm";

export default function Page() {
  return (
    <div className="max-w-3xl">
      <Tabs defaultValue="account">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Suspense fallback={<Spinner />}>
            <UserEditInfoWrapper />
          </Suspense>
        </TabsContent>
        <TabsContent value="password">
          <UserEditPasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
