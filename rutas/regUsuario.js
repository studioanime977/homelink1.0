const bcryptjs = require('bcryptjs');
const db = require('./db');

async function registrarUsuario(datos, res) {
  const { campoApe, campoNom, selectSex, campoFec, campoTel, campoDir, campoBar, campoMai, campoPas } = datos;
  const saltRounds = 10;

  try {
    const hashedPas = await bcryptjs.hash(campoPas, saltRounds);

    const sql = `INSERT INTO usuarios (ape, nom, sex, fec, tel, dir, bar, mai, pas)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [campoApe, campoNom, selectSex, campoFec, campoTel, campoDir, campoBar, campoMai, hashedPas], (err, result) => {
      if (err) {
        console.error('Error al registrar usuario:', err);
        res.status(500).send('Error en el servidor');
      } else {
        res.status(200).send('Usuario registrado correctamente');
      }
    });
  } catch (error) {
    console.error('Error al encriptar la contraseña:', error);
    res.status(500).send('Error interno');
  }
}

module.exports = registrarUsuario;
