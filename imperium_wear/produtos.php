<?php
require "config.php";

header('Content-Type: application/json; charset=utf-8');

$sql = "SELECT id_produto, nome, preco, imagem_url as url_imagem FROM PRODUTOS";
$resultado = $conexao->query($sql);

$produtos = [];

if ($resultado) {
    while ($p = $resultado->fetch_assoc()) {
        $produtos[] = $p;
    }
    
    echo json_encode($produtos, JSON_UNESCAPED_UNICODE);

    $resultado->free(); 
} else {
    http_response_code(500); 
    echo json_encode(["erro" => "Erro ao executar consulta: " . $conexao->error]);
}

$conexao->close();
?>