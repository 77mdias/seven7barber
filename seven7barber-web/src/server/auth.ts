"use server";

const API_URL = "http://localhost:3000";

export async function signIn(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/sign-in/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  return response.json();
}

export async function signUp(email: string, password: string, name: string) {
  const response = await fetch(`${API_URL}/auth/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
    credentials: "include",
  });
  return response.json();
}

export async function signOut() {
  const response = await fetch(`${API_URL}/auth/sign-out`, {
    method: "POST",
    credentials: "include",
  });
  return response.json();
}

export async function getSession() {
  const response = await fetch(`${API_URL}/auth/session`, {
    credentials: "include",
  });
  return response.json();
}
