# Desafío - Soft Jobs

Este repositorio contiene el código fuente del servidor y la aplicación cliente para el desafío **Soft Jobs**, que consiste en crear un sistema de autenticación y autorización de usuarios utilizando JWT (JSON Web Tokens). El servidor está desarrollado con Node.js, Express y PostgreSQL, mientras que la aplicación cliente está construida con React.

## Descripción del Proyecto

La empresa **Soft Jobs** está desarrollando una plataforma para ayudar a los desarrolladores juniors a encontrar trabajos cortos y sencillos, permitiéndoles acumular experiencia laboral y mejorar sus oportunidades. En este desafío, se ha implementado un servidor que permite:

- Registrar nuevos usuarios.
- Iniciar sesión y generar un token JWT.
- Obtener información del usuario autenticado.

## Requisitos

- Node.js 
- PostgreSQL
- React 

## Configuración del Proyecto

### 1. Clonar el Repositorio

Primero, clona este repositorio en tu máquina local:

git clone https://github.com/C0smar/Desafio6_node.git
cd soft-jobs

2. Configurar la Base de Datos
Crea una base de datos en PostgreSQL llamada softjobs:


CREATE DATABASE softjobs;
Conéctate a la base de datos y ejecuta el siguiente script para crear la tabla usuarios:


\c softjobs;

CREATE TABLE usuarios (
  id        SERIAL        NOT NULL,
  email     VARCHAR(50)   NOT NULL  UNIQUE,
  password  VARCHAR(60)   NOT NULL,
  rol       VARCHAR(25)   NOT NULL,
  lenguage  VARCHAR(20)   NOT NULL,
  PRIMARY KEY (id)
);


3. Configurar Variables de Entorno
4. 
Crea un archivo .env en la raíz del proyecto con las siguientes variables:

DB_USER=tu_usuario_postgres
DB_HOST=localhost
DB_NAME=softjobs
DB_PASSWORD=tu_contraseña_postgres
DB_PORT=5432
JWT_SECRET=tu_clave_secreta_jwt
PORT=3000

4. Instalar Dependencias
Instala las dependencias necesarias para el servidor y la aplicación cliente:

# Instalar dependencias del servidor

cd server
npm install

# Instalar dependencias del cliente

cd ../client
npm install


Ejecutar el Proyecto

1. Iniciar el Servidor

Desde la carpeta server, ejecuta:


npm start

El servidor estará disponible en http://localhost:3000.

2. Iniciar la Aplicación Cliente
   
Desde la carpeta client, ejecuta:

npm start
La aplicación cliente estará disponible en http://localhost:3001.

Rutas del Servidor
POST /usuarios: Registra un nuevo usuario.

POST /login: Inicia sesión y devuelve un token JWT.

GET /usuarios: Devuelve los datos del usuario autenticado.
