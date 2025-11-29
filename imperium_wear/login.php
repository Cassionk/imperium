<?php
session_start();

require "config.php";

$email = $_POST["email"] ?? '';
$senha = $_POST["senha"] ?? '';

$sql = "SELECT id_cliente, senha FROM CLIENTES WHERE email = ?";
$stmt = $conexao->prepare($sql);

if ($stmt === false) {
    echo "erro_db";
    $conexao->close();
    exit();
}

$stmt->bind_param("s", $email);
$stmt->execute();
$resultado = $stmt->get_result();
$stmt->close();

if ($resultado->num_rows === 1) {
    $usuario = $resultado->fetch_assoc();
    
    if (password_verify($senha, $usuario["senha"])) {
        
        $_SESSION["logado"] = true;
        $_SESSION["id_cliente"] = $usuario["id_cliente"];
        
        echo "ok";
    } else {
        echo "erro";
    }
} else {
    echo "erro";
}

$conexao->close();
?>