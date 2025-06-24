<?php
// filepath: api/crear_pedido.php

// Si recibes datos por JSON (fetch con application/json):
$data = json_decode(file_get_contents("php://input"), true);
$cliente = $data['cliente'] ?? '';
$fecha = $data['fecha'] ?? '';
$total = $data['total'] ?? 0;
$estado = $data['estado'] ?? 'pendiente';

// Si recibes datos por POST tradicional, usa esto en vez de lo anterior:
// $cliente = $_POST['cliente'] ?? '';
// $fecha = $_POST['fecha'] ?? '';
// $total = $_POST['total'] ?? 0;
// $estado = $_POST['estado'] ?? 'pendiente';

// ...conexión a la base de datos...

$query = "INSERT INTO pedidos (cliente, fecha, total, estado) VALUES ('$cliente', '$fecha', '$total', '$estado')";

// ...ejecutar la consulta y devolver respuesta...