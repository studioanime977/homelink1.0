require('dotenv').config();
import express from 'express';
import path from 'path';

const app = express();

/* ──────────────── Configuración ──────────────── */
const PORT     = process.env.PORT || 3000;

// Si usas ES Modules, define __dirname así:
const __dirname = path.resolve();

/* ──────────────── Middleware ──────────────── */
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret : process.env.SESSION_SECRET || 'cámbiame',
  resave : false,
  saveUninitialized : false,
  cookie : { maxAge : 60 * 60 * 1000 }          // 1 h
}));

// log global de cada petición (útil para depurar)
app.use((req,res,next)=>{
  console.log(`🔸 ${req.method} ${req.url}`, req.method==='POST'?req.body:'');
  next();
});

/* ──────────────── Rutas públicas ──────────────── */
app.get('/', (_,res)=> res.redirect('/HTML/servicio.html'));

/* ──────────────── Rutas protegidas ──────────────── */
function requiereLogin(req,res,next){
  if (req.session.usuario) return next();
  res.redirect('/HTML/login.html');
}

app.get('/HTML/carrito.html', requiereLogin ,(_,res)=>
  res.sendFile(path.join(__dirname,'public','HTML','carrito.html')));
app.get('/HTML/perfil.html' , requiereLogin ,(_,res)=>
  res.sendFile(path.join(__dirname,'public','HTML','perfil.html')));

/* ──────────────── REGISTRO ──────────────── */
app.post('/api/registro', async (req,res)=>{
  console.log('BODY RECIBIDO:',req.body);
  const { nombre, apellido, correo, contrasena, confirmarContrasena } = req.body;

  if(!nombre||!apellido||!correo||!contrasena||!confirmarContrasena)
    return res.status(400).json({ ok:false, error:'Faltan campos del formulario' });

  if(contrasena!==confirmarContrasena)
    return res.json({ ok:false, error:'Las contraseñas no coinciden' });

  try{
    /* 1️⃣ comprobar correo único */
    const [dup] = await pool.execute(
      'SELECT correo FROM usuarios WHERE correo=?',[correo.trim()]);
    if(dup.length) return res.json({ ok:false, error:'Correo ya registrado' });

    /* 2️⃣ insertar */
    const hash = await bcrypt.hash(contrasena,10);
    const nombreCompleto = `${nombre.trim()} ${apellido.trim()}`;

    await pool.execute(
      // id_usuario = UUID(), no existe columna 'id'
      'INSERT INTO usuarios (id_usuario,nombre,correo,contrasena) VALUES (UUID(),?,?,?)',
      [nombreCompleto, correo.trim(), hash]);

    res.json({ ok:true });
  }catch(e){
    console.error(e);
    res.status(500).json({ ok:false, error:'Error de servidor', detalle:e.message });
  }
});

/* ──────────────── LOGIN ──────────────── */
app.post('/api/codlogin', async (req,res)=>{
  const { campoUsu:email, campoPas:pass } = req.body;  // proviene del login.html
  try{
    const [rows] = await pool.execute(
      'SELECT id_usuario,nombre,correo,contrasena FROM usuarios WHERE correo=?',[email.trim()]);
    if(!rows.length) return res.json({ ok:false, error:'Usuario no encontrado' });

    const usuario = rows[0];
    const ok = await bcrypt.compare(pass, usuario.contrasena);
    if(!ok) return res.json({ ok:false, error:'Contraseña incorrecta' });

    req.session.usuario = {
      id     : usuario.id_usuario,
      nombre : usuario.nombre,
      correo : usuario.correo
    };
    res.json({ ok:true, usuario:req.session.usuario });
  }catch(e){
    console.error(e);
    res.status(500).json({ ok:false, error:'Error de servidor', detalle:e.message });
  }
});

/* ──────────────── API de sesión ──────────────── */
app.get('/api/sesion', (req,res)=>{
  const u = req.session.usuario;
  res.json({ logueado:!!u, usuario:u||null });
});
app.post('/api/logout', (req,res)=> req.session.destroy(()=>res.json({ok:true})));

/* ──────────────── Levantar servidor ──────────────── */
app.listen(PORT, ()=> console.log(`Servidor escuchando en puerto ${PORT}`));
