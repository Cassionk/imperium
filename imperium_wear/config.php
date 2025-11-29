<?php
// Carregar variáveis de ambiente
$host = getenv('DB_HOST') ?: 'localhost';
$usuario = getenv('DB_USER') ?: 'root';
$senha = getenv('DB_PASSWORD') ?: '';
$banco = getenv('DB_NAME') ?: 'imperium';

$conexao = new mysqli($host, $usuario, $senha, $banco);

if ($conexao->connect_error) {
    die("Erro: " . $conexao->connect_error);
}

$conexao->set_charset("utf8");
?>