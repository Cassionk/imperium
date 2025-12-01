# 👑 Imperium Wear

[![PHP Version](https://img.shields.io/badge/PHP-7.4%2B-blue.svg)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-5.7%2B-orange.svg)](https://www.mysql.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple.svg)](https://getbootstrap.com/)

Sistema de e-commerce para loja de roupas masculinas desenvolvido em PHP com MySQL.

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Requisitos](#requisitos)
- [Instalação Rápida](#instalação-rápida)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
- [Credenciais Padrão](#credenciais-padrão)
- [Uso do Sistema](#uso-do-sistema)
- [Troubleshooting](#troubleshooting)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## 📖 Sobre o Projeto

**Imperium Wear** é um sistema de e-commerce completo para uma loja de roupas masculinas. O sistema permite:

- Cadastro e autenticação de clientes
- Catálogo de produtos com imagens
- Carrinho de compras interativo
- Cálculo de frete por CEP (integração com ViaCEP)
- Finalização de pedidos com múltiplas formas de pagamento
- Geração de QR Code para pagamentos via Pix

---

## ✨ Funcionalidades

### 👤 Gestão de Clientes
- Cadastro com validação de e-mail
- Login seguro com senha criptografada (bcrypt)
- Gerenciamento de endereço

### 🛍️ Catálogo de Produtos
- Listagem dinâmica de produtos
- Imagens de produtos
- Preços formatados em Real (R$)

### 🛒 Carrinho de Compras
- Adicionar/remover produtos
- Calcular subtotal automaticamente
- Persistência via sessionStorage

### 📦 Cálculo de Frete
- Integração com API ViaCEP
- Valores diferenciados por estado
- Busca automática de endereço

### 💳 Checkout
- Múltiplas formas de pagamento (Pix, Cartão, Boleto)
- Geração de QR Code para Pix
- Registro completo da compra no banco de dados

---

## 🛠️ Tecnologias

| Categoria | Tecnologia |
|-----------|------------|
| **Backend** | PHP 7.4+ |
| **Banco de Dados** | MySQL / MariaDB |
| **Frontend** | HTML5, CSS3, JavaScript |
| **Framework CSS** | Bootstrap 5.3 |
| **APIs Externas** | ViaCEP, QR Server |

---

## 📋 Requisitos

- PHP 7.4 ou superior
- MySQL 5.7 ou MariaDB 10.3 ou superior
- Servidor web Apache (XAMPP, WAMP, ou similar)
- Navegador web moderno

---

## 🚀 Instalação Rápida

### 1. Clone o repositório

\`\`\`bash
cd /caminho/para/htdocs
git clone https://github.com/Cassionk/imperium.git
cd imperium
\`\`\`

### 2. Configure o banco de dados

\`\`\`bash
# Via linha de comando
mysql -u root -p < database.sql

# Ou importe via phpMyAdmin
# Acesse http://localhost/phpmyadmin > Importar > database.sql
\`\`\`

### 3. Configure as credenciais (opcional)

\`\`\`bash
# Linux/macOS:
cp .env.example .env

# Windows (PowerShell):
Copy-Item .env.example .env

# Windows (CMD):
copy .env.example .env

# Edite o arquivo .env com suas credenciais se necessário
\`\`\`

### 4. Acesse o sistema

\`\`\`
http://localhost/imperium/imperium_wear/
\`\`\`

> 📚 Para instruções detalhadas, consulte o [Guia de Instalação](INSTALACAO.md)

---

## 📁 Estrutura do Projeto

\`\`\`
imperium/
├── imperium_wear/              # Aplicação principal
│   ├── img/                    # Imagens dos produtos
│   │   ├── bone-preto.jpg
│   │   ├── c-jeans.jpg
│   │   ├── calca-social.jpg
│   │   ├── camisa-preta.jpg
│   │   ├── couro.jpg
│   │   ├── jaq-couro.jpg
│   │   ├── jaq-jeans.jpg
│   │   ├── oculos.jpg
│   │   ├── relogio.jpg
│   │   ├── social.jpg
│   │   ├── sport.jpg
│   │   └── tenis-bnc.jpg
│   │
│   ├── config.php              # Configuração do banco de dados
│   ├── produtos.php            # API REST - listar produtos
│   ├── login.php               # Autenticação de usuários
│   ├── logout.php              # Encerrar sessão
│   ├── cadastrar_cliente.php   # Registro de novos clientes
│   ├── criar_compra.php        # Processar compras
│   │
│   ├── index.html              # Página de login
│   ├── loja.html               # Catálogo de produtos
│   ├── cadastro_cliente.html   # Formulário de cadastro
│   ├── cadastro_produto.html   # Formulário de produtos
│   ├── finalizacao.html        # Checkout
│   │
│   ├── script.js               # JavaScript principal
│   ├── finalizacao.js          # JavaScript do checkout
│   └── style.css               # Estilos customizados
│
├── database.sql                # Script de criação do banco
├── .env.example                # Exemplo de variáveis de ambiente
├── .gitignore                  # Arquivos ignorados pelo Git
├── INSTALACAO.md               # Guia detalhado de instalação
└── README.md                   # Este arquivo
\`\`\`

---

## 🗄️ Configuração do Banco de Dados

### Estrutura das Tabelas

O sistema utiliza 4 tabelas principais:

#### CLIENTES
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id_cliente | INT | Chave primária |
| nome | VARCHAR(100) | Nome completo |
| email | VARCHAR(100) | E-mail (único) |
| senha | VARCHAR(255) | Hash da senha |
| rua | VARCHAR(150) | Endereço |
| numero | VARCHAR(20) | Número |
| bairro | VARCHAR(100) | Bairro |
| cidade | VARCHAR(100) | Cidade |
| estado | VARCHAR(2) | UF |
| cep | VARCHAR(10) | CEP |

#### PRODUTOS
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id_produto | INT | Chave primária |
| nome | VARCHAR(150) | Nome do produto |
| preco | DECIMAL(10,2) | Preço |
| imagem_url | VARCHAR(500) | URL da imagem |

#### COMPRAS
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id_compra | INT | Chave primária |
| id_cliente | INT | FK para CLIENTES |
| valor_total | DECIMAL(10,2) | Valor total |
| valor_frete | DECIMAL(10,2) | Valor do frete |
| data_compra | TIMESTAMP | Data da compra |

#### ITENS_COMPRA
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id_item | INT | Chave primária |
| id_compra | INT | FK para COMPRAS |
| id_produto | INT | FK para PRODUTOS |
| quantidade | INT | Quantidade |
| preco_unitario | DECIMAL(10,2) | Preço no momento |

---

## 🔑 Credenciais Padrão

### Banco de Dados (XAMPP/WAMP)

| Parâmetro | Valor |
|-----------|-------|
| Host | localhost |
| Usuário | root |
| Senha | (vazio) |
| Database | imperium |

### Usuário de Teste

| Campo | Valor |
|-------|-------|
| E-mail | teste@imperium.com |
| Senha | 123456 |

---

## 💻 Uso do Sistema

### 1. Acessar a Loja

1. Abra: \`http://localhost/imperium/imperium_wear/\`
2. Faça login ou cadastre-se
3. Navegue pelos produtos

### 2. Fazer uma Compra

1. Adicione produtos ao carrinho
2. Clique em "Ver Carrinho"
3. Informe o CEP para calcular frete
4. Clique em "Finalizar Compra"
5. Escolha a forma de pagamento
6. Confirme a compra

### 3. Cadastrar Produtos

1. Acesse: \`http://localhost/imperium/imperium_wear/cadastro_produto.html\`
2. Preencha nome, preço e URL da imagem
3. Clique em "Salvar Produto"

---

## 🔧 Troubleshooting

### ❌ "Erro ao carregar produtos. Verifique o arquivo 'produtos.php'"

**Causas possíveis:**
1. Banco de dados não existe
2. Tabela PRODUTOS vazia
3. Erro de conexão com MySQL

**Soluções:**
1. Verifique se o MySQL está rodando
2. Importe o arquivo \`database.sql\`
3. Verifique as credenciais em \`config.php\` ou \`.env\`
4. Teste: \`http://localhost/imperium/imperium_wear/produtos.php\`

### ❌ Erro de conexão com banco de dados

\`\`\`
Erro: Connection refused
\`\`\`

**Soluções:**
1. Inicie o MySQL no XAMPP Control Panel
2. Verifique se a porta 3306 está disponível
3. Confira as credenciais

### ❌ Página não encontrada (404)

**Soluções:**
1. Verifique se o projeto está em \`htdocs/imperium/\`
2. Verifique se o Apache está rodando
3. Confira a URL digitada

### ❌ Login não funciona

**Soluções:**
1. Verifique se o usuário existe na tabela CLIENTES
2. A senha deve ter sido criada com \`password_hash()\`
3. Use o usuário de teste: \`teste@imperium.com\` / \`123456\`

### ❌ Imagens não aparecem

**Soluções:**
1. Verifique se a pasta \`img/\` existe
2. Confira se as imagens estão dentro de \`imperium_wear/img/\`
3. Os caminhos no banco devem ser relativos: \`img/nome.jpg\`

> 📚 Para mais soluções, consulte o [Guia de Instalação](INSTALACAO.md#solução-de-problemas)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (\`git checkout -b feature/NovaFeature\`)
3. Commit suas mudanças (\`git commit -m 'Adiciona NovaFeature'\`)
4. Push para a branch (\`git push origin feature/NovaFeature\`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido por **Cassionk**

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!
