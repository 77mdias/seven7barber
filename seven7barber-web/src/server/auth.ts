"use server";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function signIn(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/sign-in/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erro ao fazer login" }));
    throw new Error(error.message || "Erro ao fazer login");
  }
  return response.json();
}

export async function signUp(email: string, password: string, name: string) {
  const response = await fetch(`${API_URL}/auth/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erro ao registrar" }));
    throw new Error(error.message || "Erro ao registrar");
  }
  return response.json();
}

export async function signOut() {
  const response = await fetch(`${API_URL}/auth/sign-out`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Erro ao sair");
  }
  return response.json();
}

export async function getSession() {
  const response = await fetch(`${API_URL}/auth/get-session`, {
    credentials: "include",
  });
  if (!response.ok) {
    return null;
  }
  return response.json();
}

export async function refreshTokens(refreshToken: string) {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erro ao atualizar sessao" }));
    throw new Error(error.message || "Erro ao atualizar sessao");
  }
  return response.json();
}
