import type { ApiResponse } from "@/types/commerce";

/**
 * Base URL of the Laravel REST API, e.g. http://localhost:8000/api/v1.
 * Configure via NEXT_PUBLIC_API_URL (see .env.example).
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

/**
 * Thin fetch wrapper for the storefront API.
 * Sends/receives JSON and includes credentials so Sanctum's stateful (cookie)
 * auth works for the SPA. Token-based auth can layer on via the `headers` option.
 */
export async function apiFetch<T>(
  path: string,
  { body, headers, ...init }: RequestOptions = {},
): Promise<T> {
  const url = path.startsWith("http")
    ? path
    : `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const response = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      (isJson && (payload as { message?: string })?.message) ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}

/** Convenience helper for endpoints that wrap data in `{ data, meta }`. */
export async function apiFetchData<T>(
  path: string,
  options?: RequestOptions,
): Promise<T> {
  const result = await apiFetch<ApiResponse<T>>(path, options);
  return result.data;
}
