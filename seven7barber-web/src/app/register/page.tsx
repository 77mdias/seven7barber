"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        throw new Error("Erro ao registrar. O email pode já estar em uso.");
      }

      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111]">
      <div className="w-full max-w-md p-8 bg-white shadow-xl border-4 border-[#732F3B]">
        <h1 className="font-heading text-4xl font-bold mb-6 text-center text-[#111]">Registrar</h1>
        {error && <div className="bg-red-100 text-red-700 p-3 mb-4 text-sm font-semibold border-2 border-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} required className="border-2 border-[#111] focus-visible:ring-[#732F3B]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="border-2 border-[#111] focus-visible:ring-[#732F3B]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="border-2 border-[#111] focus-visible:ring-[#732F3B]" />
          </div>
          <Button type="submit" className="w-full bg-[#111] hover:bg-[#732F3B] text-white font-heading uppercase tracking-wider text-lg py-6 border-2 border-[#111]">
            Criar Conta
          </Button>
        </form>
        <div className="mt-6 text-center">
          <a href="/login" className="text-sm font-semibold text-[#111] hover:underline">Já tem conta? Faça login</a>
        </div>
      </div>
    </div>
  );
}
