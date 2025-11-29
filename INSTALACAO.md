# 🛠️ Guia de Instalação - Imperium Wear

Este guia irá ajudá-lo a configurar e executar o projeto Imperium Wear em seu ambiente local. Siga os passos cuidadosamente.

---

## 📋 Índice

1. [Requisitos do Sistema](#requisitos-do-sistema)
2. [Instalação do XAMPP](#instalação-do-xampp)
3. [Configuração do Projeto](#configuração-do-projeto)
4. [Criação do Banco de Dados](#criação-do-banco-de-dados)
5. [Configuração das Credenciais](#configuração-das-credenciais)
6. [Executando o Projeto](#executando-o-projeto)
7. [Checklist de Verificação](#checklist-de-verificação)
8. [Solução de Problemas](#solução-de-problemas)

---

## 🖥️ Requisitos do Sistema

Antes de começar, verifique se você possui:

- **Sistema Operacional**: Windows 10/11, macOS ou Linux
- **PHP**: Versão 7.4 ou superior
- **MySQL/MariaDB**: Versão 5.7 ou superior
- **Servidor Web**: Apache (incluído no XAMPP)
- **Navegador Web**: Chrome, Firefox, Edge ou Safari (versões recentes)

### Software Necessário

| Software | Versão Mínima | Download |
|----------|--------------|----------|
| XAMPP | 8.0+ | [Download](https://www.apachefriends.org/download.html) |
| Git | 2.0+ | [Download](https://git-scm.com/downloads) |
| Editor de código | - | VS Code recomendado |

---

## 📥 Instalação do XAMPP

### Windows

1. **Baixe o XAMPP**
   - Acesse: https://www.apachefriends.org/download.html
   - Escolha a versão para Windows (PHP 8.x)

2. **Execute o instalador**
   ```
   xampp-windows-x64-8.x.x-installer.exe
   ```

3. **Escolha os componentes**
   - ✅ Apache
   - ✅ MySQL
   - ✅ PHP
   - ✅ phpMyAdmin

4. **Diretório de instalação**
   - Padrão: `C:\xampp`
   - Anote este caminho!

5. **Inicie os serviços**
   - Abra o XAMPP Control Panel
   - Clique em "Start" para Apache
   - Clique em "Start" para MySQL

### macOS

1. **Baixe o XAMPP**
   - Acesse: https://www.apachefriends.org/download.html
   - Escolha a versão para macOS

2. **Instale o pacote**
   - Arraste para a pasta Aplicativos

3. **Inicie o XAMPP**
   - Abra XAMPP na pasta Aplicativos
   - Inicie Apache e MySQL

### Linux (Ubuntu/Debian)

```bash
# Acesse o site oficial e baixe a versão mais recente:
# https://www.apachefriends.org/download.html

# Exemplo de instalação (substitua a versão pela mais recente disponível):
# wget https://sourceforge.net/projects/xampp/files/XAMPP%20Linux/X.X.X/xampp-linux-x64-X.X.X-0-installer.run

# Dê permissão de execução
chmod +x xampp-linux-x64-*-installer.run

# Execute como root
sudo ./xampp-linux-x64-*-installer.run

# Inicie os serviços
sudo /opt/lampp/lampp start
```

---

## 📁 Configuração do Projeto

### Passo 1: Clone o Repositório

```bash
# Navegue até a pasta htdocs do XAMPP
# Windows:
cd C:\xampp\htdocs

# macOS:
cd /Applications/XAMPP/htdocs

# Linux:
cd /opt/lampp/htdocs

# Clone o projeto
git clone https://github.com/Cassionk/imperium.git

# Entre na pasta do projeto
cd imperium
```

### Passo 2: Estrutura de Pastas

Após o clone, você terá a seguinte estrutura:

```
imperium/
├── imperium_wear/          # Pasta principal do projeto
│   ├── img/                # Imagens dos produtos
│   ├── config.php          # Configuração do banco de dados
│   ├── produtos.php        # API de produtos
│   ├── login.php           # Sistema de login
│   ├── cadastrar_cliente.php
│   ├── criar_compra.php
│   ├── logout.php
│   ├── index.html          # Página de login
│   ├── loja.html           # Página da loja
│   ├── cadastro_cliente.html
│   ├── cadastro_produto.html
│   ├── finalizacao.html
│   ├── script.js
│   ├── finalizacao.js
│   └── style.css
├── database.sql            # Script do banco de dados
├── .env.example            # Exemplo de variáveis de ambiente
├── README.md
└── INSTALACAO.md           # Este arquivo
```

---

## 🗄️ Criação do Banco de Dados

### Método 1: Via phpMyAdmin (Recomendado para Iniciantes)

1. **Acesse o phpMyAdmin**
   - Abra o navegador
   - Acesse: http://localhost/phpmyadmin

2. **Importe o script SQL**
   - Clique na aba "Importar"
   - Clique em "Escolher arquivo"
   - Selecione o arquivo `database.sql` na raiz do projeto
   - Clique em "Executar"

3. **Verifique a criação**
   - No painel esquerdo, você verá o banco `imperium`
   - Clique para expandir e ver as tabelas:
     - CLIENTES
     - PRODUTOS
     - COMPRAS
     - ITENS_COMPRA

### Método 2: Via Linha de Comando

```bash
# Windows (CMD como administrador)
C:\xampp\mysql\bin\mysql -u root -p < database.sql

# macOS/Linux
mysql -u root -p < database.sql
```

Quando solicitado, pressione Enter (senha vazia por padrão).

### Método 3: Via MySQL Console

```bash
# Acesse o MySQL
mysql -u root -p

# Execute o script
source /caminho/para/database.sql

# Verifique
SHOW DATABASES;
USE imperium;
SHOW TABLES;
```

---

## 🔐 Configuração das Credenciais

### Opção 1: Usar Variáveis de Ambiente (Recomendado)

1. **Copie o arquivo de exemplo**
   ```bash
   cp .env.example .env
   ```

2. **Edite o arquivo .env**
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=imperium
   ```

### Opção 2: Configuração Padrão

Se você não criar o arquivo `.env`, o sistema usará as credenciais padrão:

| Variável | Valor Padrão |
|----------|--------------|
| DB_HOST | localhost |
| DB_USER | root |
| DB_PASSWORD | (vazio) |
| DB_NAME | imperium |

> ⚠️ **Atenção**: Em ambiente de produção, SEMPRE use senhas fortes!

---

## ▶️ Executando o Projeto

### Passo 1: Verifique os Serviços

1. Abra o XAMPP Control Panel
2. Certifique-se que **Apache** está rodando (verde)
3. Certifique-se que **MySQL** está rodando (verde)

### Passo 2: Acesse o Sistema

Abra seu navegador e acesse:

```
http://localhost/imperium/imperium_wear/
```

Ou diretamente a página de login:

```
http://localhost/imperium/imperium_wear/index.html
```

### Passo 3: Teste o Sistema

1. **Página de Login**
   - URL: http://localhost/imperium/imperium_wear/index.html

2. **Cadastro de Cliente**
   - Clique em "Cadastrar-se"
   - Preencha os dados e cadastre

3. **Acesse a Loja**
   - Faça login com suas credenciais
   - URL: http://localhost/imperium/imperium_wear/loja.html

4. **Usuário de Teste**
   - Email: `teste@imperium.com`
   - Senha: `123456`

---

## ✅ Checklist de Verificação

Use esta lista para verificar se tudo está configurado corretamente:

### Ambiente

- [ ] XAMPP instalado
- [ ] Apache rodando (porta 80)
- [ ] MySQL rodando (porta 3306)
- [ ] Projeto clonado em `htdocs/imperium/`

### Banco de Dados

- [ ] Banco `imperium` criado
- [ ] Tabela `CLIENTES` existe
- [ ] Tabela `PRODUTOS` existe
- [ ] Tabela `COMPRAS` existe
- [ ] Tabela `ITENS_COMPRA` existe
- [ ] Dados de exemplo inseridos

### Configuração

- [ ] Arquivo `.env` criado (opcional)
- [ ] Credenciais do banco configuradas

### Funcionamento

- [ ] Página de login carrega
- [ ] Cadastro de cliente funciona
- [ ] Login funciona
- [ ] Produtos são exibidos na loja
- [ ] Carrinho de compras funciona

---

## 🔧 Solução de Problemas

### Erro: "Erro ao carregar produtos. Verifique o arquivo 'produtos.php'"

**Causa**: O banco de dados não está configurado corretamente ou a tabela PRODUTOS não existe.

**Solução**:
1. Verifique se o MySQL está rodando
2. Importe o arquivo `database.sql` novamente
3. Verifique as credenciais no arquivo `.env` ou `config.php`
4. Teste a conexão acessando: http://localhost/imperium/imperium_wear/produtos.php

### Erro: "Connection refused" ou "Access denied"

**Causa**: Credenciais incorretas ou MySQL não está rodando.

**Solução**:
1. Abra o XAMPP Control Panel
2. Inicie o MySQL se estiver parado
3. Verifique se a senha está correta (padrão é vazia)
4. Tente acessar: http://localhost/phpmyadmin

### Erro: "Page not found" ou "404"

**Causa**: O projeto não está na pasta correta.

**Solução**:
1. Verifique se o projeto está em `htdocs/imperium/`
2. Verifique se a URL está correta
3. Reinicie o Apache

### Página em branco ou erro 500

**Causa**: Erro de PHP.

**Solução**:
1. Verifique o log de erros do Apache:
   - Windows: `C:\xampp\apache\logs\error.log`
   - macOS: `/Applications/XAMPP/logs/error_log`
   - Linux: `/opt/lampp/logs/error_log`
2. Ative a exibição de erros temporariamente:
   - Edite `php.ini` e defina `display_errors = On`
   - Reinicie o Apache

### Produtos não aparecem

**Causa**: Tabela PRODUTOS vazia ou erro na consulta.

**Solução**:
1. Acesse phpMyAdmin
2. Selecione o banco `imperium`
3. Clique na tabela `PRODUTOS`
4. Verifique se existem registros
5. Se estiver vazia, importe novamente o `database.sql`

### Login não funciona

**Causa**: Tabela CLIENTES vazia ou erro na validação.

**Solução**:
1. Cadastre um novo usuário pelo formulário
2. Ou use o usuário de teste:
   - Email: `teste@imperium.com`
   - Senha: `123456`

### Imagens não carregam

**Causa**: Caminho das imagens incorreto.

**Solução**:
1. Verifique se a pasta `img/` existe dentro de `imperium_wear/`
2. Verifique se as imagens estão na pasta
3. As URLs no banco devem ser relativas: `img/nome-imagem.jpg`

---

## 📞 Suporte

Se você encontrar problemas não listados aqui:

1. Verifique os logs de erro do Apache e PHP
2. Teste cada componente separadamente
3. Crie uma issue no repositório GitHub

---

## 🎉 Próximos Passos

Após a instalação bem-sucedida, você pode:

1. **Explorar o sistema** - Navegue pelas páginas e teste as funcionalidades
2. **Cadastrar produtos** - Adicione seus próprios produtos
3. **Personalizar** - Modifique o CSS e adicione novas funcionalidades
4. **Estudar o código** - Analise os arquivos PHP e JavaScript

---

**Bom desenvolvimento!** 🚀
