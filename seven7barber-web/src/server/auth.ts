import { createBetterAuth, BetterAuthOptions } from "better-auth/react";
import { createClient } from "@/lib/api-client";

const apiClient = createClient(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
);

export const authClient = createBetterAuth({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  fetchOptions: {
    headers: {
      "Content-Type": "application/json",
    },
  },
});

export async function signIn(email: string, password: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  return response.json();
}

export async function signUp(email: string, password: string, name: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sign-up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
    credentials: "include",
  });
  return response.json();
}

export async function signOut() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sign-out`, {
    method: "POST",
    credentials: "include",
  });
  return response.json();
}

export async function getSession() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/session`, {
    credentials: "include",
  });
  return response.json();
}
