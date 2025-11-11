-- Base de Datos para aplicación de cuentos infantiles - Érase una vez
DROP DATABASE IF EXISTS eraseUnaVez;
-- Creación de la base de datos con soporte para emojis y acentos
CREATE DATABASE IF NOT EXISTS eraseUnaVez CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE eraseUnaVez;

-- Tabla para registrar el catálogo de todos los avatares preseleccionados
CREATE TABLE IF NOT EXISTS avatars (
    idAvatar INT AUTO_INCREMENT PRIMARY KEY,
    nombreAvatar VARCHAR(100) NOT NULL, 
    urlAvatar VARCHAR(255) NOT NULL UNIQUE 
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS usuarios (
    idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    
    -- --- Datos del Tutor ---
    email VARCHAR(255) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    nombreTutor VARCHAR(100),
    
    -- --- Datos del Infante ---
    nombreInfante VARCHAR(100) NOT NULL,
    FechaNacimientoInfante DATE,
    idAvatar INT, 

    fechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idAvatar) REFERENCES avatars(idAvatar) 
) ENGINE=InnoDB;


-- Tabla para registrar la información principal de los cuentos
CREATE TABLE IF NOT EXISTS cuentos (
    idCuento INT AUTO_INCREMENT PRIMARY KEY,
    tituloCuento VARCHAR(255) NOT NULL, 
    descripcion TEXT, 
    urlPortada VARCHAR(255),
    edadRecomentada INT,
    fechaPublicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
) ENGINE=InnoDB;

-- Tabla para registrar el texto de las páginas de cada cuento
CREATE TABLE IF NOT EXISTS paginas (
    idPagina INT AUTO_INCREMENT PRIMARY KEY,
    idCuento INT NOT NULL, 
    numeroPagina INT NOT NULL, 
    texto TEXT, 
    urlImagen VARCHAR(255),
    urlAudio VARCHAR(255),
    FOREIGN KEY (idCuento) REFERENCES cuentos(idCuento),
    UNIQUE (idCuento, numeroPagina) -- Evita que un cuento tenga dos "página 5"
) ENGINE=InnoDB;

-- Tabla para clasificar los cuentos
CREATE TABLE IF NOT EXISTS categoriasCuentos (
    idCategoria INT AUTO_INCREMENT PRIMARY KEY,
    nombreCategoria VARCHAR(50) NOT NULL UNIQUE, 
    descripcion TEXT 
) ENGINE=InnoDB;

-- Tabla para registrar las relaciones entre los cuentos y categorias
CREATE TABLE IF NOT EXISTS cuentoCategoria (
    idCategoria INT NOT NULL,
    idCuento INT NOT NULL,
    PRIMARY KEY (idCategoria, idCuento), 
    FOREIGN KEY (idCategoria) REFERENCES categoriasCuentos(idCategoria),
    FOREIGN KEY (idCuento) REFERENCES cuentos(idCuento)
) ENGINE=InnoDB;


-- Tabla para registrar dónde se quedó cada usuario en cada cuento
CREATE TABLE IF NOT EXISTS progresoLectura (
    idProgreso INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT NOT NULL,
    idCuento INT NOT NULL,
    ultimaPaginaLeida INT DEFAULT 0,
    completado BOOLEAN NOT NULL DEFAULT FALSE, 
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario),
    FOREIGN KEY (idCuento) REFERENCES cuentos(idCuento),
    UNIQUE (idUsuario, idCuento) -- Solo un progreso por usuario/cuento
) ENGINE=InnoDB;

-- Tabla para registrar los cuentos marcados como favoritos por cada usuario
CREATE TABLE IF NOT EXISTS favoritos (
    idUsuario INT NOT NULL,
    idCuento INT NOT NULL,
    fechaAgregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    PRIMARY KEY (idUsuario, idCuento), -- Evita favoritos duplicados
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario),
    FOREIGN KEY (idCuento) REFERENCES cuentos(idCuento)
) ENGINE=InnoDB;

-- Tabla para registrar todos los logros posibles en la app
CREATE TABLE IF NOT EXISTS logros (
    idLogro INT AUTO_INCREMENT PRIMARY KEY,
    nombreLogro VARCHAR(100) NOT NULL, 
    descripcion TEXT, 
    urlIcono VARCHAR(255) 
) ENGINE=InnoDB;

-- Tabla para registra los logros que cada usuario ha desbloqueado.
CREATE TABLE IF NOT EXISTS usuarioLogros (
    idUsuarioLogo INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT NOT NULL,
    idLogro INT NOT NULL, 
    fechaObtenido TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario),
    FOREIGN KEY (idLogro) REFERENCES logros(idLogro), 
    UNIQUE (idUsuario, idLogro) -- Evita que un usuario gane el mismo logro dos veces
) ENGINE=InnoDB;

