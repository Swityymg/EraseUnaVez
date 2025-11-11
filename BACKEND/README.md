# ⚙️ Backend | EraseUnaVez
Este servicio contiene la lógica del proyecto, gestiona la persistencia de datos y se comunica con la API de generación de historias de Gemini.

## Requisitos previos
Tener insatalado 
* Node.js (Entorno de ejecución)
* npm (Gestor de paquetes)
* Prisma ( Cliente de BBDD)
* MySQL (Base de datos)

## Configuración e instalación 
1. Asegúrate de estar en la carpeta raíz del backend (`ERASEUNAVEZ/BACKEND/`)

2. Instalar dependencias 
  Instala todas las dependencias del proyecto definidas en `package.json`:
    ```
    npm install
    ```
2. Genera el cliente de Prisma
    ```
    npx prisma generate
    ```
3. Configurar las variables de entorno
    Crea un archivo llamado `.env` en la raíz de la carpeta `BACKEND` (es decir, en `tu_repositorio/BACKEND/.env`).
    Dentro de este archivo, añade las siguientes líneas con tus credenciales:

    ```dotenv
    # Configuración de la Base de Datos
    DATABASE_URL="mysql://root:tu_contraseña@localhost:3306/eraseUnaVez"

    # API KEY GEMINI (para desarrollo o producción)
    GEMINI_API_KEY="AQUI_PEGAS_LA_CLAVE_QUE_ACABAS_DE_GENERAR"
    ```

    **Importante:**
    * Reemplaza `tu_contraseña` con la contraseña de tu usuario `root` de MySQL.
    * Obtén tu `GEMINI_API_KEY` de la plataforma de Google AI Studio o Gemini.

4. Ejecuta el servidor 
    ```
    npm run dev
    ```





