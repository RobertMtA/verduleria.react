<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$mysqli = new mysqli("localhost", "root", "", "verduleria");
if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión"]);
    exit();
}

$cliente = $mysqli->real_escape_string($data['cliente']);
$fecha = $mysqli->real_escape_string($data['fecha']);
$total = floatval($data['total']);
$estado = $mysqli->real_escape_string($data['estado']);

$query = "INSERT INTO pedidos (cliente, fecha, total, estado) VALUES ('$cliente', '$fecha', $total, '$estado')";
if ($mysqli->query($query)) {
    echo json_encode(["success" => true, "id" => $mysqli->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "No se pudo insertar el pedido"]);
}
?>