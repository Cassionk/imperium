<?php
require "config.php"; 

$conexao->begin_transaction();

try {
    $id_cliente = $_POST["id_cliente"] ?? 0;
    $valor_total = $_POST["total_pedido"] ?? 0.00;
    $valor_frete = $_POST["valor_frete"] ?? 0.00;
    
    $itens_json = $_POST["itens"] ?? '[]';
    $itens = json_decode($itens_json, true);

    $sql_compra = "INSERT INTO COMPRAS (id_cliente, valor_total, valor_frete) VALUES (?, ?, ?)";
    $stmt = $conexao->prepare($sql_compra);
    
    $stmt->bind_param("idd", $id_cliente, $valor_total, $valor_frete);
    
    if (!$stmt->execute()) {
        throw new Exception("Erro ao inserir na tabela COMPRAS: " . $stmt->error);
    }

    $id_compra = $conexao->insert_id;
    $stmt->close();

    foreach ($itens as $item) {
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