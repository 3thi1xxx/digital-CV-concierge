'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-950 text-zinc-100">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <button
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
          onClick={() => reset()}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
