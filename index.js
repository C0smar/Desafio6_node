import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

 
app.get('/', (req, res) => {
  res.send('¡Bienvenido al servidor!');
});


app.post('/usuarios', async (req, res) => {
  const { email, password, rol, lenguage } = req.body;

  if (!email || !password || !rol || !lenguage) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, hashedPassword, rol, lenguage]
    );

    res.status(201).json({ message: 'Usuario registrado con éxito.', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el usuario.' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y password son obligatorios.' });
  }

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al iniciar sesión.' });
  }
});

app.get('/usuarios', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [decoded.email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token inválido o expirado.' });
  }
});

const verifyCredentials = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y password son obligatorios.' });
  }

  next();
};

app.post('/login', verifyCredentials, async (req, res) => {
 
});

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

app.get('/usuarios', verifyToken, async (req, res) => {
 
});

const logRequests = (req, res, next) => {
  console.log(`Consulta recibida: ${req.method} ${req.url}`);
  next();
};

app.use(logRequests);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});