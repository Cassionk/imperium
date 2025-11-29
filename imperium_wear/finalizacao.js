let dadosCompra = {};

document.addEventListener('DOMContentLoaded', () => {
    const dadosCompraJSON = sessionStorage.getItem('dadosCompra');

    if (!dadosCompraJSON) {
        alert("Carrinho vazio ou dados incompletos. Retornando à loja.");
        window.location.href = "loja.html";
        return;
    }

    dadosCompra = JSON.parse(dadosCompraJSON);
    preencherFormulario(dadosCompra);
    exibirResumo(dadosCompra);

    configurarEventoPagamento();

    document.getElementById('cep').addEventListener('blur', buscarEndereco);
    
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', confirmarCompra);
    }
    
    if (dadosCompra.metodoPagamento === 'Pix') {
        adicionarBlocoPix(dadosCompra);
    }
});

function preencherFormulario(dados) {
    const { endereco = {}, metodoPagamento } = dados;

    document.getElementById('cep').value = endereco.cep || '';
    document.getElementById('rua').value = endereco.rua || '';
    document.getElementById('bairro').value = endereco.bairro || '';
    document.getElementById('numero').value = endereco.numero || '';
    document.getElementById('cidade').value = endereco.cidade || '';
    document.getElementById('uf').value = endereco.uf || '';

    const selectPagamento = document.getElementById('pagamento');
    if (selectPagamento) {
        selectPagamento.value = metodoPagamento || 'Pix';
    }
}

function exibirResumo(dados) {
    const resumoDiv = document.getElementById('resumoCompra');
    const htmlItens = dados.itens.map(item => 
        `<div class="item"><span>${item.nome}</span><span>R$ ${item.preco.toFixed(2)}</span></div>`
    ).join('');
    resumoDiv.innerHTML = `
        ${htmlItens}
        <div class="item"><span>Subtotal</span><span>R$ ${dados.subtotal.toFixed(2)}</span></div>
        <div class="item"><span>Frete</span><span>R$ ${dados.valorFrete.toFixed(2)}</span></div>
    `;

    document.getElementById('totalFinal').textContent = `R$ ${dados.total.toFixed(2)}`;
}

function configurarEventoPagamento() {
    document.getElementById('pagamento').addEventListener('change', (event) => {
        const metodo = event.target.value;
        let pixBlock = document.getElementById('pixInfo');

        if (metodo === 'Pix' && !pixBlock) {
            adicionarBlocoPix(dadosCompra);
        } else if (metodo !== 'Pix' && pixBlock) {
            pixBlock.remove();
        }
    });
}

async function buscarEndereco() {
    const cepInput = document.getElementById('cep');
    const cep = cepInput.value.replace(/\D/g, '');

    if (cep.length !== 8) {
        return;
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            alert('CEP não encontrado.');
            return;
        }

        document.getElementById('rua').value = data.logradouro || '';
        document.getElementById('bairro').value = data.bairro || '';
        document.getElementById('cidade').value = data.localidade || '';
        document.getElementById('uf').value = data.uf || '';
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert('Erro ao buscar o endereço.');
    }
}

function adicionarBlocoPix(dados) {
    const pixCode = gerarCodigoAleatorio(30);
    const pagamentoSection = document.getElementById('pagamentoBox');

    let pixBlock = document.getElementById('pixInfo');
    if (pixBlock) pixBlock.remove();

    pixBlock = document.createElement('div');
    pixBlock.id = 'pixInfo';
    pixBlock.className = 'mt-3 p-3 bg-light text-dark rounded';
    pixBlock.innerHTML = `
        <h5 class="text-center">Pagamento via Pix</h5>
        <p class="text-center">Escaneie o QR Code ou copie o código abaixo.</p>
        <div class="text-center mb-3">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PIX_CODE_${pixCode}" alt="QR Code Pix" style="max-width: 150px;">
        </div>
        <div class="input-group mb-3">
            <input type="text" class="form-control" value="${pixCode}" id="pixCodigo" readonly>
            <button class="btn btn-outline-secondary" type="button" onclick="copiarCodigoPix()">Copiar</button>
        </div>
        <p class="small text-danger">Valor: R$ ${dados.total.toFixed(2)}</p>
    `;
    pagamentoSection.appendChild(pixBlock);
}

function gerarCodigoAleatorio(tamanho) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: tamanho }, () => 
        caracteres.charAt(Math.floor(Math.random() * caracteres.length))
    ).join('');
}

window.copiarCodigoPix = async function() {
    const codigoInput = document.getElementById('pixCodigo');
    // Clipboard API requires HTTPS, check if available
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(codigoInput.value);
            alert('Código Pix copiado!');
            return;
        } catch (err) {
            // Fall through to fallback
        }
    }
    // Fallback para navegadores antigos ou conexão HTTP
    codigoInput.select();
    document.execCommand('copy');
    alert('Código Pix copiado!');
}

async function confirmarCompra(event) {
    event.preventDefault(); 
    
    const form = event.target;
    
    const dadosPessoais = {
        nome_completo: form.querySelector('[name="nome_completo"]')?.value,
        cpf_cnpj: form.querySelector('[name="cpf_cnpj"]')?.value,
        email: form.querySelector('[name="email"]')?.value,
        telefone: form.querySelector('[name="telefone"]')?.value,
        
        cep: form.querySelector('[name="cep"]')?.value,
        rua: form.querySelector('[name="rua"]')?.value,
        numero: form.querySelector('[name="numero"]')?.value,
        bairro: form.querySelector('[name="bairro"]')?.value,
        cidade: form.querySelector('[name="cidade"]')?.value,
        uf: form.querySelector('[name="uf"]')?.value,
    };

    const formData = new FormData();
    
    for (const key in dadosPessoais) {
        formData.append(key, dadosPessoais[key] || '');
    }

    // ID do cliente será obtido da sessão no backend
    formData.append('total_pedido', dadosCompra.total.toFixed(2));
    formData.append('valor_frete', dadosCompra.valorFrete.toFixed(2));
    formData.append('forma_pagamento', form.querySelector('[name="forma_pagamento"]')?.value);
    
    const itensParaPHP = dadosCompra.itens.map(item => ({
        id_produto: item.id, 
        quantidade: item.quantidade,
        preco_unitario: item.preco,
    }));
    formData.append('itens', JSON.stringify(itensParaPHP));

    try {
        const response = await fetch('criar_compra.php', {
            method: 'POST',
            body: formData,
        });

        const resultado = await response.text(); 
        
        if (response.ok && resultado.trim() === 'ok') {
            alert(`Sucesso! Compra de R$ ${dadosCompra.total.toFixed(2)} finalizada e cadastrada!`);
            sessionStorage.removeItem('dadosCompra');
            window.location.href = "loja.html";
        } else {
            alert("ERRO NO CADASTRO: " + resultado); 
        }
    } catch (error) {
        alert("Falha de conexão com o servidor: " + error);
        console.error('Erro no Fetch:', error);
    }
}
