import { Loader2 } from "lucide-react";
import React from "react";

export default function Spinner() {
  return (
    <div className=" flex items-center flex-col justify-center gap-2 my-20">
      <Loader2 className="w-16 h-16 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">
        Loading data. Please wait...
      </p>
    </div>
  );
}
