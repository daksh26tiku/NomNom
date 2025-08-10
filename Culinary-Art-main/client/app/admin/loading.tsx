import { Loader2 } from "lucide-react";

function Loading() {
  return (
    <div className="mt-32 flex items-center justify-center">
      <Loader2 className="w-16 h-16 animate-spin text-primary" />
    </div>
  );
}

export default Loading;
