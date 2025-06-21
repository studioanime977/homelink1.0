const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const conexion = require("../config/conexion");
const link = require("../config/link");

// Definimos la ruta del login legacy /codlogin
router.post("/codlogin", async (req, res) => {
  const campoUsu = req.body.campoUsu;
  const campoPas = req.body.campoPas;
  if (!campoUsu || !campoPas) {
    return res.status(400).json({ ok: false, error: "Datos incompletos" });
  }
  const sql = "SELECT id_usuario AS cod_usu, nombre, contrasena FROM usuarios WHERE correo = ?";
  conexion.query(sql, [campoUsu], async (err, results) => {
    if (err) {
      console.error("Error en DB:", err);
      return res.status(500).json({ ok: false, error: "Error del servidor" });
    }
    if (results.length === 0) {
      return res.status(401).json({ ok: false, error: "Usuario no encontrado" });
    }
    const user = results[0];
    const match = await bcrypt.compare(campoPas, user.contrasena);
    if (!match) {
      return res.status(401).json({ ok: false, error: "Contraseña incorrecta" });
    }
    // Set session fields
    req.session.login = true;
    req.session.codusu = user.cod_usu;
    req.session.userName = user.nombre;
    console.log(req.session);
    res.render("inicio", { datos: req.session, link });
  });
});

module.exports = router;