import { Loader2 } from "lucide-react";

interface LoadingProps {
  message: string;
}

export default function Loading({ message }: LoadingProps) {
  return (
    <div className="min-h-[400px] w-full flex flex-col items-center justify-center bg-transparent text-white p-4">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-2xl font-semibold">{message}</h2>
      </div>
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-purple-500/20 blur-xl" />
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    </div>
  );
}
