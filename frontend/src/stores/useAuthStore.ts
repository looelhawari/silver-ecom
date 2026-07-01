"use client";

import { create } from "zustand";

import { apiFetch } from "@/lib/api";
import { clearToken, getToken, setToken } from "@/lib/auth-token";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  whatsapp?: string | null;
};

type AuthResponse = { data: { token: string; user: AuthUser } };

type RegisterPayload = {
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  password: string;
  password_confirmation: string;
};

type AuthState = {
  user: AuthUser | null;
  hydrated: boolean;
  setUser: (user: AuthUser | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  loadMe: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  hydrated: false,
  setUser: (user) => set({ user }),
  login: async (email, password) => {
    const res = await apiFetch<AuthResponse>("/auth/login", { method: "POST", body: { email, password } });
    setToken(res.data.token);
    set({ user: res.data.user });
  },
  register: async (payload) => {
    const res = await apiFetch<AuthResponse>("/auth/register", { method: "POST", body: payload });
    setToken(res.data.token);
    set({ user: res.data.user });
  },
  logout: async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // token may already be invalid — clear locally regardless
    }
    clearToken();
    set({ user: null });
  },
  loadMe: async () => {
    if (!getToken()) {
      set({ hydrated: true });
      return;
    }
    try {
      const res = await apiFetch<{ data: AuthUser }>("/auth/me");
      set({ user: res.data, hydrated: true });
    } catch {
      clearToken();
      set({ user: null, hydrated: true });
    }
  },
}));
