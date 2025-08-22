<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "mensaje" => "Metodo no permitido"]);
    exit;
}

$datos = json_decode(file_get_contents("php://input"), true);

// Procesar los datos...
echo json_encode([
    "status" => "ok",
    "mensaje" => "Logs recibidos"
]);