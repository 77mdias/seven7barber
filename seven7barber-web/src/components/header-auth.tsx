"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export function HeaderAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-white text-sm">...</div>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-white font-heading tracking-wide text-sm hidden md:inline">Olá, {session.user?.name}</span>
        <button onClick={() => signOut()} className="text-sm font-medium text-[#732F3B] hover:text-white uppercase tracking-wide transition-colors">
          Sair
        </button>
        <Link href="/dashboard" className="relative group">
          <div className="absolute inset-0 bg-[#732F3B] translate-x-1 translate-y-1 clip-slant-right z-0" />
          <div className="relative bg-[#111] text-white px-6 py-2 clip-slant-right border-2 border-white font-heading font-bold uppercase tracking-wider text-sm hover:bg-[#732F3B] hover:text-white transition-colors z-10">
            Painel
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/login" className="text-sm font-medium text-white hover:text-[#732F3B] uppercase tracking-wide transition-colors">
        Login
      </Link>
      <Link href="/login" className="relative group">
        <div className="absolute inset-0 bg-[#732F3B] translate-x-1 translate-y-1 clip-slant-right z-0" />
        <div className="relative bg-[#111] text-white px-6 py-2 clip-slant-right border-2 border-white font-heading font-bold uppercase tracking-wider text-sm hover:bg-[#732F3B] hover:text-white transition-colors z-10">
          Agendar
        </div>
      </Link>
    </div>
  );
}
