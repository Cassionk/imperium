<?php

require 'config.php';

// Validar e sanitizar inputs
$nome = filter_input(INPUT_POST, 'nome', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$senha = $_POST['senha'] ?? '';
$rua = filter_input(INPUT_POST, 'rua', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$numero = filter_input(INPUT_POST, 'numero', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$bairro = filter_input(INPUT_POST, 'bairro', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$cidade = filter_input(INPUT_POST, 'cidade', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$estado = filter_input(INPUT_POST, 'estado', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$cep = filter_input(INPUT_POST, 'cep', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

// Validações
if (!$email) {
    header("Location: cadastro_cliente.html?erro=email_invalido");
    exit();
}

if (empty($nome) || empty($senha)) {
    header("Location: cadastro_cliente.html?erro=campos_vazios");
    exit();
}

$senha_hash = password_hash($senha, PASSWORD_DEFAULT);

$sql = "INSERT INTO CLIENTES (nome, email, senha, rua, numero, bairro, cidade, estado, cep) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conexao->prepare($sql);

if ($stmt === false) {
    header("Location: cadastro_cliente.html?erro=db");
    exit();
}

$stmt->bind_param("sssssssss", $nome, $email, $senha_hash, $rua, $numero, $bairro, $cidade, $estado, $cep);

if ($stmt->execute()) {
    header("Location: loja.html?sucesso=1"); 
    exit(); 
} else {
    header("Location: cadastro_cliente.html?erro=cadastro");
    exit();
}
$stmt->close();
$conexao->close();
?>