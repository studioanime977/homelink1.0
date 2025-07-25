require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ───────── config ───────── */
const pool  = require('./config/db');
const upload= require('./config/multer');

/* vistas */
app.set('view engine', 'ejs');

/* middlewares */
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret           : process.env.SESSION_SECRET || 'cambia‑esto',
  resave           : false,
  saveUninitialized: false,
  cookie           : { maxAge: 60*60*1000 }
}));

app.use((req,res,next)=>{
  res.locals.user = req.session.usuario || null;
  next();
});

/* rutas */
app.use(require('./rutas/registro'));
app.use(require('./rutas/codLogin'));
app.use(require('./rutas/destroy'));
app.use(require('./rutas/paginas'));

/* vistas simples */
app.get('/', (_,res)=> res.redirect('/HTML/servicio.html'));
app.get('/HTML/registro.html', (_,res)=> res.render('registro'));

/* server */
app.listen(PORT, ()=> console.log(`✅ Servidor en http://localhost:${PORT}`));
