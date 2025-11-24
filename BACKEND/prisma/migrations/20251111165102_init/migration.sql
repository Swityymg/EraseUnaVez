-- CreateTable
CREATE TABLE `avatars` (
    `idAvatar` INTEGER NOT NULL AUTO_INCREMENT,
    `nombreAvatar` VARCHAR(100) NOT NULL,
    `urlAvatar` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `urlAvatar`(`urlAvatar`),
    PRIMARY KEY (`idAvatar`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categoriascuentos` (
    `idCategoria` INTEGER NOT NULL AUTO_INCREMENT,
    `nombreCategoria` VARCHAR(50) NOT NULL,
    `descripcion` TEXT NULL,

    UNIQUE INDEX `nombreCategoria`(`nombreCategoria`),
    PRIMARY KEY (`idCategoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cuentocategoria` (
    `idCategoria` INTEGER NOT NULL,
    `idCuento` INTEGER NOT NULL,

    INDEX `idCuento`(`idCuento`),
    PRIMARY KEY (`idCategoria`, `idCuento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cuentos` (
    `idCuento` INTEGER NOT NULL AUTO_INCREMENT,
    `tituloCuento` VARCHAR(255) NOT NULL,
    `descripcion` TEXT NULL,
    `urlPortada` VARCHAR(255) NULL,
    `edadRecomentada` INTEGER NULL,
    `fechaPublicacion` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `idUsuario` INTEGER NULL,

    INDEX `fk_cuentos_usuario`(`idUsuario`),
    PRIMARY KEY (`idCuento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `favoritos` (
    `idUsuario` INTEGER NOT NULL,
    `idCuento` INTEGER NOT NULL,
    `fechaAgregado` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idCuento`(`idCuento`),
    PRIMARY KEY (`idUsuario`, `idCuento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logros` (
    `idLogro` INTEGER NOT NULL AUTO_INCREMENT,
    `nombreLogro` VARCHAR(100) NOT NULL,
    `descripcion` TEXT NULL,
    `urlIcono` VARCHAR(255) NULL,

    PRIMARY KEY (`idLogro`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paginas` (
    `idPagina` INTEGER NOT NULL AUTO_INCREMENT,
    `idCuento` INTEGER NOT NULL,
    `numeroPagina` INTEGER NOT NULL,
    `texto` TEXT NULL,
    `urlImagen` VARCHAR(255) NULL,
    `urlAudio` VARCHAR(255) NULL,

    UNIQUE INDEX `idCuento`(`idCuento`, `numeroPagina`),
    PRIMARY KEY (`idPagina`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `progresolectura` (
    `idProgreso` INTEGER NOT NULL AUTO_INCREMENT,
    `idUsuario` INTEGER NOT NULL,
    `idCuento` INTEGER NOT NULL,
    `ultimaPaginaLeida` INTEGER NULL DEFAULT 0,
    `completado` BOOLEAN NOT NULL DEFAULT false,
    `fechaActualizacion` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idCuento`(`idCuento`),
    UNIQUE INDEX `idUsuario`(`idUsuario`, `idCuento`),
    PRIMARY KEY (`idProgreso`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuariologros` (
    `idUsuarioLogo` INTEGER NOT NULL AUTO_INCREMENT,
    `idUsuario` INTEGER NOT NULL,
    `idLogro` INTEGER NOT NULL,
    `fechaObtenido` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idLogro`(`idLogro`),
    UNIQUE INDEX `idUsuario`(`idUsuario`, `idLogro`),
    PRIMARY KEY (`idUsuarioLogo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `idUsuario` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `contraseña` VARCHAR(255) NOT NULL,
    `nombreTutor` VARCHAR(100) NULL,
    `nombreInfante` VARCHAR(100) NOT NULL,
    `FechaNacimientoInfante` DATE NULL,
    `idAvatar` INTEGER NULL,
    `fechaRegistro` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    INDEX `idAvatar`(`idAvatar`),
    PRIMARY KEY (`idUsuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `paginas` ADD CONSTRAINT `paginas_idCuento_fkey` FOREIGN KEY (`idCuento`) REFERENCES `cuentos`(`idCuento`) ON DELETE RESTRICT ON UPDATE CASCADE;
