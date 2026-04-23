const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  token?: string | null;
  headers?: Record<string, string>;
};

function extractErrorMessage(data: unknown, status: number): string {
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>;
    if (typeof d.detail === 'string') return d.detail;
    if (Array.isArray(d.detail)) {
      const first = d.detail[0] as { msg?: unknown } | undefined;
      if (first && typeof first.msg === 'string') return first.msg;
    }
    if (typeof d.message === 'string') return d.message;
  }
  return `Request failed (${status})`;
}

export async function request<T>(
  path: string,
  { method = 'GET', body, token, headers }: RequestOptions = {},
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (res.status === 204) return null as T;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(extractErrorMessage(data, res.status), res.status, data);
  }

  return data as T;
}
