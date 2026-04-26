"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Credenciais inválidas");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9]">
      <div className="w-full max-w-md p-8 bg-white shadow-xl border-4 border-[#111]">
        <h1 className="font-heading text-4xl font-bold mb-6 text-center">Login</h1>
        {error && <div className="bg-red-100 text-red-700 p-3 mb-4 text-sm font-semibold border-2 border-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="border-2 border-[#111] focus-visible:ring-[#732F3B]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="border-2 border-[#111] focus-visible:ring-[#732F3B]" />
          </div>
          <Button type="submit" className="w-full bg-[#732F3B] hover:bg-[#111] text-white font-heading uppercase tracking-wider text-lg py-6 border-2 border-[#111]">
            Entrar
          </Button>
        </form>
        <div className="mt-6 text-center">
          <a href="/register" className="text-sm font-semibold text-[#732F3B] hover:underline">Não tem conta? Registre-se</a>
        </div>
      </div>
    </div>
  );
}
