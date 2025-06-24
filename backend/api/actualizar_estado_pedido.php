<?php
// filepath: api/actualizar_estado_pedido.php

include 'conexion.php'; // tu archivo de conexión

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? 0;
$estado = $data['estado'] ?? '';

if ($id && $estado) {
    $query = "UPDATE pedidos SET estado='$estado' WHERE id=$id";
    $result = mysqli_query($conn, $query);
    echo json_encode(['success' => $result]);
} else {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
}
?>