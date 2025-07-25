const express = require('express');
const path    = require('path');
const router  = express.Router();

function protegido(req,res,next){
  if(req.session.usuario) return next();
  res.redirect('/HTML/login.html');
}

router.get('/perfil', protegido, (_,res)=> res.render('perfil'));
router.get('/carrito', protegido, (_,res)=> res.render('carrito'));
router.get('/monitoreo', protegido, (_,res)=> res.render('monitoreo'));
router.get('/config', protegido, (_,res)=> res.render('config'));

module.exports = router;
