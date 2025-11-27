


const IP_DEL_BACKEND = process.env.REACT_NATIVE_BACKEND_IP || '192.168.68.109';
const PORT = process.env.REACT_NATIVE_BACKEND_PORT || '3001';
const BASE_URL = `http://${IP_DEL_BACKEND}:${PORT}/api`;


//Tipos de datos

export type CuentoSimple = {
  id: number; 
  titulo: string;
  descripcion: string;
  urlPortada: string; 
  edadRecomendada: number;
  fechaPublicacion: string | null;
  idUsuario: number | null;
};

export type PaginaCuento = {
  idPagina: number;
  idCuento: number;
  numeroPagina: number;
  texto: string;
  urlImagen: string; // La URL COMPLETA de la imagen de la página
  urlAudio: string; // La URL COMPLETA del audio de la página
};


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
 * Llama a: GET /api/cuentos/:idCuento/paginas
 * Obtiene todas las páginas de un cuento específico, ordenadas por númeroPagina.
 */

export const obtenerPaginasCuento = async (idCuento: string | number): Promise<PaginaCuento[]> => {
    try {
        const url = `${BASE_URL}/cuentos/${idCuento}/paginas`;
        
        console.log("1. Intentando conectar a URL:", url); 

        const response = await fetch(url);
        
        // Antes de convertir a JSON, leemos el texto crudo para ver si es HTML
        const textResponse = await response.text();
        console.log("2. Respuesta cruda del servidor:", textResponse); 

        // Intentamos convertir ese texto a JSON manualmente
        try {
            const data = JSON.parse(textResponse);
            
            // Si llegamos aquí, es que sí era JSON
            if (Array.isArray(data)) {
                 return data.sort((a: any, b: any) => a.numeroPagina - b.numeroPagina);
            }
            // Si es un objeto de error del backend
            if (data.error) {
                throw new Error(data.error);
            }
            
            return data; // Por si devuelve otro formato
            
        } catch (jsonError) {
            // Si falla el parseo, lanzamos el error mostrando el HTML recibido
            console.error("No es JSON válido. Recibimos HTML probablemente.");
            throw new Error(`El servidor devolvió HTML en lugar de JSON. Revisa la consola.`);
        }
        
    } catch (error) {
        console.error(`Error en obtenerPaginasCuento para id ${idCuento}:`, error);
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




