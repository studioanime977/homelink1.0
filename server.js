require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// motor de vistas
app.set('view engine', 'ejs');

// middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret           : process.env.SESSION_SECRET || 'cambialo‑por‑favor',
  resave           : false,
  saveUninitialized: false,
  cookie           : { maxAge: 60 * 60 * 1000 }
}));

// sesión disponible en todas las vistas
app.use((req,res,next)=>{
  res.locals.user = req.session.usuario || null;
  next();
});

// log
app.use((req,_,next)=>{
  if(req.method!=='GET') console.log(`🔸 ${req.method} ${req.url}`, req.body);
  next();
});

// rutas modulares
app.use(require('./rutas/registro'));
app.use(require('./rutas/codLogin'));
app.use(require('./rutas/destroy'));

// rutas de compras
app.use(require('./routes/compras'));

// protección de páginas internas
function protegido(req,res,next){
  if(req.session.usuario) return next();
  res.redirect('/');
}

app.get('/HTML/perfil.html', protegido, (_,res)=>
  res.sendFile(path.join(__dirname,'public','HTML','perfil.html')));

// home -> servicio.html
app.get('/', (_,res)=> res.redirect('/HTML/servicio.html'));

// servidor
app.listen(PORT,()=> console.log(`Servidor escuchando en puerto ${PORT}`));
