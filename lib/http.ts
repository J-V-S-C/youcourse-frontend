/*/lib (ou /services): Destinado a clientes HTTP e funções utilitárias. 
É onde você deve armazenar as funções que executam as requisições (fetch, axios)
para consumir os dados do usuário.

/api: Destinado à criação de endpoints de backend dentro do próprio Next.js (Route Handlers). 
Serve para receber requisições, não para armazenar as funções que fazem as requisições à sua API (NestJS).
*/

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { refreshAccessToken } from '@/lib/auth/auth.service';
import { getSession } from 'next-auth/react';

async function getAccessToken() {
  if (typeof window === "undefined") {
    const session = await getServerSession(authOptions);
    return session?.accessToken;
  } else {
    const session = await getSession();
    return session?.accessToken;
  }
}

async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  let accessToken = await getAccessToken()

  if (!accessToken) {
    throw new Error('No token');
  }

  const createHeaders = (token: string) => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  })

  let res = await fetch(url, {
    ...options,
    headers: createHeaders(accessToken)
  });

  if (res.status === 401) {
    const currentSession = typeof window === 'undefined'
      ? await getServerSession(authOptions)
      : await getSession();

    const refreshed = await refreshAccessToken(currentSession as any);

    if (refreshed.error) {
      throw new Error('Refresh failed');
    }

    accessToken = refreshed.accessToken;

    res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        ...(options.headers || {}),
      },
    });
  }

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

export function get<T>(url: string) {
  return request<T>(url, { method: 'GET' });
}

export function post<T>(url: string, body?: unknown) {
  return request<T>(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function patch<T>(url: string, body?: unknown) {
  return request<T>(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function put<T>(url: string, body?: unknown) {
  return request<T>(url, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export function del<T>(url: string) {
  return request<T>(url, { method: 'DELETE' });
}