import axios from "axios";

export const TOKEN_KEY = "hj-admin-token";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      if (!window.location.pathname.includes("/sign-in")) {
        window.location.href = "/sign-in";
      }
    }
    return Promise.reject(err);
  }
);

/**
 * Turn a failed upload into something the operator can act on.
 *
 * 503 means the server has no storage configured — no amount of retrying or
 * picking a smaller file will help, so say that plainly rather than the
 * generic failure. 413 is the platform rejecting the body before the API sees
 * it, which on Vercel happens above 4.5 MB.
 */
export function uploadErrorMessage(err: unknown): string {
  const res = axios.isAxiosError(err) ? err.response : undefined;

  if (res?.status === 503) {
    return "Uploads are switched off — no image storage is configured on the server.";
  }
  if (res?.status === 413) {
    return "That file is too large for the server to accept (limit is 4.5 MB).";
  }
  if (res?.status === 401) return "Your session expired — sign in again.";

  const message = (res?.data as { message?: string } | undefined)?.message;
  return message ? `Upload failed — ${message}` : "Upload failed — please try again.";
}
