const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// rutas existentes
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/registro'));
app.use('/api', require('./routes/compras'));

// ruta de administración
app.use('/api', require('./routes/admin'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
