# EraseUnaVez
Desarrollar y lanzar una aplicación móvil que combine cuentos clásicos con tecnología de generación de historias por inteligencia artificial (Gemini) para aumentar el interés y la participación creativa en la lectura infantil en un entorno digital seguro y accesible.

## Requisitos previos
Tener insatalado 
* Node.js
* npm
* MySQL

## Configuración e instalación del Backend 
1. Clonar el repositorio
2. Instalar dependencias del backend
  Dentro de la carpeta "BACKEND"
```npm install ```
3. Generar el cliente de Prisma
  * npx prisma generate
4. Configurar las variables de entorno
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


