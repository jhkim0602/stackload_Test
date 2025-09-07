"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-4">
      <p className="text-red-600 font-medium">문제가 발생했어요.</p>
      <pre className="text-xs text-muted-foreground whitespace-pre-wrap">{error.message}</pre>
      <button className="text-sm underline" onClick={() => reset()}>다시 시도</button>
    </div>
  );
}


