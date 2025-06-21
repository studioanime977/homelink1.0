const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const registrarUsuario = require('./regUsuario');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Servir archivos estáticos (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta de registro
app.post('/registro', (req, res) => {
  registrarUsuario(req.body, res);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
