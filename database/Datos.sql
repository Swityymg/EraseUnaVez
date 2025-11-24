USE eraseUnaVez;

INSERT INTO avatars (nombreAvatar, urlAvatar) VALUES
('Zorro Feliz', 'img/avatares/zorro.png'),
('Robot Explorador', 'img/avatares/robot.png'),
('Luna Sonriente', 'img/avatares/luna.png'),
('Tortuga Sabia', 'img/avatares/tortuga.png');


INSERT INTO categoriasCuentos (nombreCategoria, descripcion) VALUES
('Aventura', 'Cuentos llenos de acción y descubrimientos.'),
('Animales', 'Historias protagonizadas por amigos del bosque y la granja.'),
('Para Dormir', 'Cuentos relajantes y tranquilos para la noche.');


INSERT INTO logros (nombreLogro, descripcion, urlIcono) VALUES
('Primer Cuento', 'Completaste tu primer cuento. ¡Felicidades!', 'img/iconos/logro_primer_cuento.png'),
('Lector Nocturno', 'Leíste 3 cuentos para dormir.', 'img/iconos/logro_luna.png'),
('Aventurero', 'Completaste 3 cuentos de aventura.', 'img/iconos/logro_mapa.png');

INSERT INTO cuentos (tituloCuento, descripcion, urlPortada, edadRecomentada) VALUES
('El Zorro Valiente', 'Un pequeño zorro aprende a ser valiente.', 'img/portadas/portada_zorro.png', 3),
('La Luna Dormilona', 'La luna no quiere salir y las estrellas la ayudan.', 'img/portadas/portada_luna.png', 2),
('El Robot Perdido', 'Bip-Bop el robot busca su camino a casa.', 'img/portadas/portada_robot.png', 5),
('La Tortuga Veloz', 'Tita la tortuga quiere ganar una carrera.', 'img/portadas/portada_tortuga.png', 4),
('El Misterio del Jardín', 'Tres amigos descubren un secreto en el jardín.', 'img/portadas/portada_jardin.png', 6);


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



INSERT INTO usuarios (email, contraseña, nombreTutor, nombreInfante, FechaNacimientoInfante, idAvatar) VALUES
('garcia.ana@mail.com', 'pass123', 'Ana García', 'Leo', '2018-05-10', 1), 
('perez.luis@mail.com', 'hash_pass123', 'Luis Pérez', 'Mía', '2019-01-15', 3),
('martinez.sofia@mail.com', 'hash_pass123', 'Sofía Martínez', 'Hugo', '2017-08-20', 2), 
('llagos@mail.com', 'Camacho22', 'Luis Camacho', 'Freyja', '2020-11-24', 2),
('lopez.mateo@mail.com', 'hash_pass123', 'Mateo López', 'Valeria', '2020-03-01', 4); 



INSERT INTO paginas (idCuento, numeroPagina, texto, urlImagen, urlAudio) VALUES
(1, 1, 'Había una vez un zorro llamado Flinky...', 'img/paginas/zorro_p1.png', 'audio/zorro_p1.mp3'),
(1, 2, 'Una noche, su amigo el búho se perdió...', 'img/paginas/zorro_p2.png', 'audio/zorro_p2.mp3'),
(2, 1, 'La luna bostezó y no quería salir...', 'img/paginas/luna_p1.png', 'audio/luna_p1.mp3'),
(3, 1, 'Bip-Bop despertó en un lugar desconocido...', 'img/paginas/robot_p1.png', 'audio/robot_p1.mp3');


INSERT INTO cuentoCategoria (idCuento, idCategoria) VALUES
(1, 1), (1, 2), 
(2, 3),        
(3, 1),         
(4, 2),         
(5, 1);         


INSERT INTO progresoLectura (idUsuario, idCuento, ultimaPaginaLeida, completado) VALUES
(1, 1, 2, TRUE),  
(1, 2, 1, FALSE),
(2, 3, 1, TRUE);  


INSERT INTO favoritos (idUsuario, idCuento) VALUES
(1, 1), 
(2, 3), 
(3, 1); 

-- Asignamos logros
INSERT INTO usuarioLogros (idUsuario, idLogro) VALUES
(1, 1), 
(2, 1); 




