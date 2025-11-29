<?php

require 'config.php';

$nome = $_POST['nome'];
$email = $_POST['email'];
$senha = password_hash($_POST['senha'], PASSWORD_DEFAULT);
$rua = $_POST['rua'];
$numero = $_POST['numero'];
$bairro = $_POST['bairro'];
$cidade = $_POST['cidade'];
$estado = $_POST['estado'];
$cep = $_POST['cep'];

$sql = "INSERT INTO CLIENTES (nome, email, senha, rua, numero, bairro, cidade, estado, cep) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conexao->prepare($sql);

if ($stmt === false) {
    header("Location: login.php?erro_db=preparacao");
    exit();
}

$stmt->bind_param("sssssssss", $nome, $email, $senha, $rua, $numero, $bairro, $cidade, $estado, $cep);

if ($stmt->execute()) {
    header("Location: loja.html"); 
    exit(); 
} else {
}
$stmt->close();
$conexao->close();
?>