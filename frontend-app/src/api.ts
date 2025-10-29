// Cliente mínimo para llamadas a la API del backend
export const getApiBaseUrl = (): string => {
  try {
    // @ts-ignore
    if (process && process.env && process.env.API_BASE_URL) return process.env.API_BASE_URL;
  } catch (e) {
    // ignorar
  }
  return 'http://localhost:3001';
};

export async function obtenerCuentos() {
  const url = `${getApiBaseUrl()}/api/cuentos`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error fetching cuentos: ${res.status}`);
  return res.json();
}

export async function generarCuento(prompt: string, usuarioId?: string) {
  const url = `${getApiBaseUrl()}/api/ia/generar-cuento`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, usuarioId }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Error ${res.status}`);
  }
  return res.json();
}
