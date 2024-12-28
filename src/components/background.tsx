export function Background() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d1117] via-[#1b1f23] to-[#0d1117]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#7042f88b] opacity-30 blur-[80px] rounded-full" />
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-[#2f74c0] opacity-20 blur-[80px] rounded-full" />
      <div className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-[#2f74c0] opacity-20 blur-[80px] rounded-full" />
    </div>
  );
}
