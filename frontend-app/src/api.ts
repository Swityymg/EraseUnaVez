


const IP_DEL_BACKEND = process.env.REACT_NATIVE_BACKEND_IP || '192.168.0.73';
const PORT = process.env.REACT_NATIVE_BACKEND_PORT || '3001';
const BASE_URL = `http://${IP_DEL_BACKEND}:${PORT}/api`;

/**
 * Función genérica para manejar errores de fetch
 */
const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Error del servidor: ${response.status}`);
  }
  return data;
};

export const obtenerCuentos = async () => {
  try {
    const url = `${BASE_URL}/cuentos`;
    const response = await fetch(url);
    return await handleResponse(response);
  } catch (error) {
    console.error("Error en obtenerCuentos:", error);
    throw error;
  }
};

export const obtenerCuentoPorId = async (id: number) => {
  try {
    const url = `${BASE_URL}/cuentos/${id}`;
    const response = await fetch(url);
    return await handleResponse(response);
  } catch (error) {
    console.error("Error en obtenerCuentoPorId:", error);
    throw error;
  }
};


/**
 * Llama a: POST /api/auth/login
 */
export const iniciarSesion = async (email: string, contrasena: string) => {
  try {
    const url = `${BASE_URL}/auth/login`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, contrasena }),
    });
    return await handleResponse(response); // Devuelve { message, usuario }
  } catch (error) {
    console.error("Error en iniciarSesion:", error);
    throw error;
  }
};

/**
 * Llama a: POST /api/auth/register
 */
export const registrarUsuario = async (datosUsuario: {
  email: string,
  nombre: string,
  contrasena: string,
  nombreInfante: string
}) => {
  try {
    const url = `${BASE_URL}/auth/register`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosUsuario),
    });
    return await handleResponse(response); // Devuelve el usuario creado
  } catch (error) {
    console.error("Error en registrarUsuario:", error);
    throw error;
  }
};


/**
 * Llama a: POST /api/ia/generar-cuento
 */
export const generarCuento = async (prompt: string, usuarioId?: number | string) => {
  const url = `${BASE_URL}/ia/generar-cuento`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      usuarioId: usuarioId ? Number(usuarioId) : null,
    }),
  });

  return await handleResponse(response);
};


