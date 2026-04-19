async function publicRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

    if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text);
}

export function publicPost<T>(url: string, body?: unknown) {
  return publicRequest<T>(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function publicGet<T>(url: string) {
  return publicRequest<T>(url, { method: 'GET' });
}