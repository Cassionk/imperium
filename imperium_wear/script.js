let produtos = [];
let carrinho = [];

// Função debounce para otimizar inputs
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

document.addEventListener("DOMContentLoaded", () => {
    carregarProdutos();

    const cepFreteElement = document.getElementById("cepFrete");
    const numeroCasaElement = document.getElementById("numeroCasa");

    if (cepFreteElement) {
        cepFreteElement.addEventListener("blur", () => {
            if (cepFreteElement.value.replace(/\D/g, '').length === 8) {
                atualizarCarrinho();
            }
        });
        cepFreteElement.addEventListener("input", () => {
            if (cepFreteElement.value.replace(/\D/g, '').length === 0) {
                atualizarCarrinho();
            }
        });
    }

    if (numeroCasaElement) {
        numeroCasaElement.addEventListener("input", debounce(atualizarCarrinho, 500));
    }
    
    const modal = new bootstrap.Modal(document.getElementById("carrinhoModal"));
    document.getElementById("verCarrinho")?.addEventListener("click", () => {
        atualizarCarrinho();
        modal.show();
    });
});

async function carregarProdutos() {
    try {
        const response = await fetch('produtos.php');
        
        if (!response.ok) {
            throw new Error('Falha ao carregar produtos do servidor.');
        }

        produtos = await response.json(); 
        
        produtos = produtos.map((p, index) => ({...p, id: p.id_produto || index}));
        
        renderizarProdutos();
        
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        mostrarNotificacao("Erro ao carregar produtos. Verifique o arquivo 'produtos.php'.", "erro");
    }
}

function renderizarProdutos() {
    const produtosDiv = document.getElementById("produtos");
    if (!produtosDiv) return;

    const html = produtos.map((p, i) => `
        <div class="produto">
            <div class="card p-2 text-center">
                <img src="${p.url_imagem}" class="card-img-top" alt="${p.nome}">
                <div class="card-body">
                    <h5 class="card-title">${p.nome}</h5>
                    <p>R$ ${parseFloat(p.preco).toFixed(2)}</p>
                    <button class="btn btn-warning" onclick="adicionarCarrinho(${i})">Adicionar</button>
                </div>
            </div>
        </div>
    `).join('');
    
    produtosDiv.innerHTML = html; // Uma única atribuição
}

async function atualizarCarrinho() {
    const lista = document.getElementById("listaCarrinho");
    if (!lista) return;
    lista.innerHTML = "";

    let subtotal = 0;
    carrinho.forEach((p, i) => {
      lista.innerHTML += `
        <div class="d-flex justify-content-between align-items-center border-bottom py-2">
          <span>${p.nome}</span>
          <span>R$ ${p.preco.toFixed(2)}</span>
          <button class="btn btn-sm btn-danger" onclick="removerCarrinho(${i})">x</button>
        </div>
      `;
      subtotal += p.preco * (p.quantidade || 1);
    });

    let valorFrete = 0;
    const cepElement = document.getElementById("cepFrete");
    let freteTexto = "A calcular";

    if (cepElement && cepElement.value) {
      valorFrete = await window.calcularFrete(false);
      freteTexto = `R$ ${valorFrete.toFixed(2)}`;
    }

    const totalComFrete = subtotal + valorFrete;

    lista.innerHTML += `
      <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
        <h6 class="text-muted">Subtotal:</h6>
        <h6>R$ ${subtotal.toFixed(2)}</h6>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <h6 class="text-muted">Frete:</h6>
        <h6>${freteTexto}</h6>
      </div>
      <div class="text-center mt-3">
        <h5>Total: R$ ${totalComFrete.toFixed(2)}</h5>
        <button class="btn btn-success mt-2" onclick="finalizarCompra()">Finalizar Compra</button>
      </div>
    `;
}

function mostrarNotificacao(mensagem, tipo = "info") {
    const notificacao = document.createElement("div");
    notificacao.className = `notificacao ${tipo}`;
    notificacao.innerHTML = mensagem;
    document.body.appendChild(notificacao);

    setTimeout(() => notificacao.classList.add("mostrar"), 100);
    setTimeout(() => {
        notificacao.classList.remove("mostrar");
        setTimeout(() => notificacao.remove(), 300);
    }, 3000);
}

window.adicionarCarrinho = function (i) {
    const produto = produtos[i];
    
    // Verificar se produto já existe no carrinho
    const itemExistente = carrinho.find(item => item.id === produto.id);
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
        mostrarNotificacao(`Quantidade de ${produto.nome} atualizada!`, "carrinho");
    } else {
        carrinho.push({...produto, quantidade: 1});
        mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`, "carrinho");
    }
    
    atualizarCarrinho();
};

window.removerCarrinho = function (i) {
    carrinho.splice(i, 1);
    atualizarCarrinho();
    mostrarNotificacao("Item removido do carrinho!", "aviso");
};

window.calcularValorFretePorEstado = function (estado) {
    const fretes = {
        'SP': 33.00, 'RJ': 28.50, 'MG': 22.00, 'ES': 19.50,
        'PR': 25.00, 'SC': 29.50, 'MT': 24.50, 'GO': 23.50,
        'MA': 10.50, 'PA': 9.99, 'default': 35.00
    };
    return fretes[estado] || fretes.default;
};

window.calcularFrete = async function (showAlert = true) {
    const cep = document.getElementById("cepFrete").value;
    if (!cep) {
        if (showAlert) mostrarNotificacao("Informe o CEP!", "erro");
        return 0;
    }

    try {
        const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
            signal: AbortSignal.timeout(5000) // Timeout de 5s
        });
        
        if (!r.ok) {
            throw new Error('Erro na resposta da API');
        }
        
        const d = await r.json();

        if (d.erro) {
            document.getElementById("bairroFrete").value = "CEP Inválido";
            if (showAlert) mostrarNotificacao("CEP inválido!", "erro");
            return 0;
        }

        const estado = d.uf;
        const valorFrete = window.calcularValorFretePorEstado(estado);
        document.getElementById("bairroFrete").value = d.bairro || "Não encontrado";

        if (showAlert) {
            const freteFormatado = valorFrete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            mostrarNotificacao(`Frete para ${d.bairro || "bairro não encontrado"}: ${freteFormatado}`, "info");
        }
        return valorFrete;
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        if (showAlert) mostrarNotificacao("Erro ao buscar CEP. Tente novamente.", "erro");
        return 0;
    }
};

window.finalizarCompra = function () {
    if (carrinho.length === 0) {
        mostrarNotificacao("Seu carrinho está vazio!", "erro");
        return;
    }
    const modalPagamento = new bootstrap.Modal(document.getElementById("pagamentoModal"));
    modalPagamento.show();
};

window.confirmarMetodo = async function (metodo) {
    const modalCarrinho = bootstrap.Modal.getInstance(document.getElementById("carrinhoModal"));
    modalCarrinho.hide();
    let valorFrete = 0;
    let dadosFrete = {};
    const cepFreteElement = document.getElementById("cepFrete");
    const numeroCasa = document.getElementById("numeroCasa").value;

    if (cepFreteElement && cepFreteElement.value) {
        valorFrete = await window.calcularFrete(false);
        const r = await fetch(`https://viacep.com.br/ws/${cepFreteElement.value}/json/`);
        dadosFrete = await r.json();
    }

    const subtotal = carrinho.reduce((acc, p) => acc + (p.preco * p.quantidade), 0);
    const totalFinal = subtotal + valorFrete;

    const dadosCompra = {
        itens: carrinho,
        metodoPagamento: metodo,
        valorFrete: valorFrete,
        subtotal: subtotal,
        total: totalFinal,
        endereco: {
            cep: cepFreteElement.value,
            rua: dadosFrete.logradouro || '',
            bairro: dadosFrete.bairro || '',
            cidade: dadosFrete.localidade || '',
            uf: dadosFrete.uf || '',
            numero: numeroCasa
        }
    };
    sessionStorage.setItem('dadosCompra', JSON.stringify(dadosCompra));
    window.location.href = "finalizacao.html";
};
