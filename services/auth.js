import { api } from "./api";

export function register(name, email, password) {
  return api("/auth/register", "POST", { name, email, password });
}

export function login(email, password) {
  return api("/auth/login", "POST", { email, password });
}

export function logout() {
  localStorage.removeItem("token");
}
