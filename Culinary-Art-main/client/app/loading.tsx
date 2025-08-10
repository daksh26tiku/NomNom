import { Loader2 } from "lucide-react";
import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col gap-2 items-center justify-center">
      <Loader2 className="w-16 h-16 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">
        Loading data. Please wait...
      </p>
    </div>
  );
}
