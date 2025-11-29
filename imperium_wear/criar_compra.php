<?php
session_start();
require "config.php"; 

// Verificar autenticação
if (!isset($_SESSION['id_cliente'])) {
    http_response_code(401);
    echo json_encode(['erro' => 'Não autenticado']);
    exit();
}

$conexao->begin_transaction();

try {
    $id_cliente = $_SESSION['id_cliente']; // Usar ID da sessão
    $valor_total = filter_var($_POST["total_pedido"] ?? 0.00, FILTER_VALIDATE_FLOAT);
    $valor_frete = filter_var($_POST["valor_frete"] ?? 0.00, FILTER_VALIDATE_FLOAT);
    
    // Validar valores
    if ($valor_total <= 0) {
        throw new Exception("Valor total inválido");
    }
    
    $itens_json = $_POST["itens"] ?? '[]';
    $itens = json_decode($itens_json, true);
    
    if (empty($itens)) {
        throw new Exception("Nenhum item no carrinho");
    }

    $sql_compra = "INSERT INTO COMPRAS (id_cliente, valor_total, valor_frete) VALUES (?, ?, ?)";
    $stmt = $conexao->prepare($sql_compra);
    
    $stmt->bind_param("idd", $id_cliente, $valor_total, $valor_frete);
    
    if (!$stmt->execute()) {
        throw new Exception("Erro ao inserir na tabela COMPRAS: " . $stmt->error);
    }

    $id_compra = $conexao->insert_id;
    $stmt->close();

    foreach ($itens as $item) {
        // Validar item
        if (!isset($item["id_produto"]) || !isset($item["quantidade"]) || !isset($item["preco_unitario"])) {
            throw new Exception("Dados do item inválidos");
        }
        
        $sql_item = "INSERT INTO ITENS_COMPRA (id_compra, id_produto, quantidade, preco_unitario) VALUES (?, ?, ?, ?)";
        $stmt2 = $conexao->prepare($sql_item);
        
        $stmt2->bind_param("iiid", $id_compra, $item["id_produto"], $item["quantidade"], $item["preco_unitario"]);
        
        if (!$stmt2->execute()) {
            throw new Exception("Erro ao inserir ITENS_COMPRA (ID Prod: " . $item["id_produto"] . "): " . $stmt2->error);
        }
        $stmt2->close();
    }

    $conexao->commit();
    echo "ok";

} catch (Exception $e) {
    $conexao->rollback();
    
    http_response_code(500);
    echo "Erro na transação: " . $e->getMessage();
    
} finally {
    $conexao->close();
}
?>