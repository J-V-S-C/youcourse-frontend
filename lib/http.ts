/*/lib (ou /services): Destinado a clientes HTTP e funções utilitárias. 
É onde você deve armazenar as funções que executam as requisições (fetch, axios)
para consumir os dados do usuário.

/api: Destinado à criação de endpoints de backend dentro do próprio Next.js (Route Handlers). 
Serve para receber requisições, não para armazenar as funções que fazem as requisições à sua API (NestJS).
*/

export async function post<T>(
  url: string,
  body?: unknown,
  headers?: HeadersInit,
): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function get<T>(url: string, headers?: HeadersInit): Promise<T> {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}
