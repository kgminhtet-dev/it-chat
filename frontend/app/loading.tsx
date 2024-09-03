export default function Loading() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center">
      <div className="flex items-center space-x-2">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <span className="text-primary">Loading...</span>
      </div>
    </div>
  );
}