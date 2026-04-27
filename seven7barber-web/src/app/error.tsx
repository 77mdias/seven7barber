"use client";

import { useEffect } from "react";

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
    <div className="min-h-screen flex items-center justify-center bg-[#111]">
      <div className="text-center px-6">
        <h2 className="font-heading text-4xl text-white mb-4">
          Algo deu errado
        </h2>
        <p className="text-[#bababa] mb-8">
          Ocorreu um erro inesperado. Por favor, tente novamente.
        </p>
        <button
          onClick={reset}
          className="bg-[#732F3B] hover:bg-[#401021] text-white px-8 py-3 font-heading uppercase tracking-wider transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
