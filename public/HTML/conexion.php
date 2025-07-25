<?php
$host = "localhost";
$usuario = "root";
$contrasena = "";
$basededatos = "homelink";

$conexion = new mysqli($host, $usuario, $contrasena, $basededatos);

// Establecer charset a UTF-8
$conexion->set_charset("utf8");

if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}
// else {
//     echo "Conexión exitosa";
// }
?>