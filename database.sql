-- =============================================================================
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS - IMPERIUM WEAR
-- =============================================================================
-- Este script cria o banco de dados e todas as tabelas necessárias para
-- o funcionamento do sistema Imperium Wear.
-- 
-- Uso: Importe este arquivo no phpMyAdmin ou execute via linha de comando MySQL
--      mysql -u root -p < database.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- CRIAÇÃO DO BANCO DE DADOS
-- -----------------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS imperium
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE imperium;

-- -----------------------------------------------------------------------------
-- TABELA: CLIENTES
-- Armazena informações dos clientes cadastrados no sistema
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS ITENS_COMPRA;
DROP TABLE IF EXISTS COMPRAS;
DROP TABLE IF EXISTS CLIENTES;
DROP TABLE IF EXISTS PRODUTOS;

CREATE TABLE CLIENTES (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL COMMENT 'Hash da senha usando password_hash()',
    rua VARCHAR(150),
    numero VARCHAR(20),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(10),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- TABELA: PRODUTOS
-- Armazena os produtos disponíveis na loja
-- -----------------------------------------------------------------------------
CREATE TABLE PRODUTOS (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    imagem_url VARCHAR(500) NOT NULL COMMENT 'URL ou caminho da imagem do produto',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- TABELA: COMPRAS
-- Armazena as compras realizadas pelos clientes
-- -----------------------------------------------------------------------------
CREATE TABLE COMPRAS (
    id_compra INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    valor_total DECIMAL(10, 2) NOT NULL,
    valor_frete DECIMAL(10, 2) DEFAULT 0.00,
    data_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES CLIENTES(id_cliente) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- TABELA: ITENS_COMPRA
-- Armazena os itens de cada compra (relacionamento N:N entre COMPRAS e PRODUTOS)
-- -----------------------------------------------------------------------------
CREATE TABLE ITENS_COMPRA (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    id_compra INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    preco_unitario DECIMAL(10, 2) NOT NULL COMMENT 'Preço no momento da compra',
    FOREIGN KEY (id_compra) REFERENCES COMPRAS(id_compra) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES PRODUTOS(id_produto) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- DADOS DE EXEMPLO
-- =============================================================================

-- -----------------------------------------------------------------------------
-- INSERIR PRODUTOS DE EXEMPLO
-- As URLs apontam para as imagens na pasta img/ do projeto
-- -----------------------------------------------------------------------------
INSERT INTO PRODUTOS (nome, preco, imagem_url) VALUES
    ('Boné Preto', 49.90, 'img/bone-preto.jpg'),
    ('Calça Jeans', 129.90, 'img/c-jeans.jpg'),
    ('Calça Social', 159.90, 'img/calca-social.jpg'),
    ('Camisa Preta', 79.90, 'img/camisa-preta.jpg'),
    ('Cinto de Couro', 89.90, 'img/couro.jpg'),
    ('Jaqueta de Couro', 299.90, 'img/jaq-couro.jpg'),
    ('Jaqueta Jeans', 189.90, 'img/jaq-jeans.jpg'),
    ('Óculos de Sol', 149.90, 'img/oculos.jpg'),
    ('Relógio', 249.90, 'img/relogio.jpg'),
    ('Camisa Social', 119.90, 'img/social.jpg'),
    ('Camiseta Sport', 59.90, 'img/sport.jpg'),
    ('Tênis Branco', 199.90, 'img/tenis-bnc.jpg');

-- -----------------------------------------------------------------------------
-- INSERIR CLIENTE DE TESTE
-- Senha: 123456 (hash gerado com password_hash())
-- -----------------------------------------------------------------------------
INSERT INTO CLIENTES (nome, email, senha, rua, numero, bairro, cidade, estado, cep) VALUES
    ('Cliente Teste', 'teste@imperium.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Rua Exemplo', '100', 'Centro', 'São Paulo', 'SP', '01310-100');

-- -----------------------------------------------------------------------------
-- INSERIR COMPRA DE EXEMPLO
-- -----------------------------------------------------------------------------
INSERT INTO COMPRAS (id_cliente, valor_total, valor_frete) VALUES
    (1, 329.70, 33.00);

INSERT INTO ITENS_COMPRA (id_compra, id_produto, quantidade, preco_unitario) VALUES
    (1, 1, 1, 49.90),
    (1, 4, 2, 79.90),
    (1, 11, 2, 59.90);

-- =============================================================================
-- ÍNDICES PARA OTIMIZAÇÃO
-- =============================================================================
CREATE INDEX idx_clientes_email ON CLIENTES(email);
CREATE INDEX idx_compras_cliente ON COMPRAS(id_cliente);
CREATE INDEX idx_itens_compra ON ITENS_COMPRA(id_compra);

-- =============================================================================
-- FIM DO SCRIPT
-- =============================================================================
