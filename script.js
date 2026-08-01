// Arquivo de dados fixo para a loja
const ARQUIVO_PRODUTOS = "nossoAtacarejoQuixada.json";

// Inicializa a tela ao carregar o script
document.addEventListener("DOMContentLoaded", () => {
    // Configura a mensagem de boas-vindas
    document.getElementById("mensagem").textContent = "Bem-vindo ao Nosso Atacarejo Quixadá";
    
    // Garante que a tela de boas-vindas (com busca e listagem) esteja visível
    document.getElementById("telaBoasVindas").style.display = "block";
    
    // Esconde a tela antiga de seleção se ela ainda existir no HTML
    const telaLista = document.getElementById("telaLista");
    if (telaLista) telaLista.style.display = "none";
});

// Pesquisa produto
async function localizarProduto() {
    const pesquisa = document
        .getElementById("pesquisa")
        .value
        .trim()
        .toLowerCase();

    if (pesquisa === "") {
        alert("Digite o nome de um produto.");
        return;
    }

    try {
        const resposta = await fetch(ARQUIVO_PRODUTOS);
        const produtos = await resposta.json();

        // Procura por nome do produto
        let resultados = produtos.filter(produto =>
            produto.nome.toLowerCase().includes(pesquisa)
        );

        // Se não encontrou pelo nome, procura pelas marcas
        if (resultados.length === 0) {
            resultados = produtos.filter(produto =>
                produto.marcas?.some(marca =>
                    marca.nome.toLowerCase().includes(pesquisa)
                )
            );
        }

        // Nenhum resultado
        if (resultados.length === 0) {
            alert("Produto não encontrado.");
            return;
        }

        resultados.sort((a, b) => a.nome.localeCompare(b.nome));

        // Apenas um resultado
        if (resultados.length === 1) {
            mostrarLocalizacao(resultados[0]);
            return;
        }

        // Vários resultados
        document.getElementById("telaBoasVindas").style.display = "none";
        document.getElementById("telaProdutos").style.display = "block";

        renderizarListaProdutos(resultados);

    } catch (erro) {
        console.error(erro);
        alert("Erro ao carregar o catálogo do Nosso Atacarejo.");
    }
}

// Lista todos os produtos
async function listarProdutos() {
    try {
        const resposta = await fetch(ARQUIVO_PRODUTOS);
        const produtos = await resposta.json();

        document.getElementById("telaBoasVindas").style.display = "none";
        document.getElementById("telaProdutos").style.display = "block";

        produtos.sort((a, b) => a.nome.localeCompare(b.nome));

        renderizarListaProdutos(produtos);

    } catch (erro) {
        console.error(erro);
        alert("Erro ao carregar o catálogo do Nosso Atacarejo.");
    }
}

// Renderiza os botões de produtos na telaProdutos
function renderizarListaProdutos(listaArray) {
    const listaProdutos = document.getElementById("listaProdutos");
    listaProdutos.innerHTML = "";

    listaArray.forEach(produto => {
        const botao = document.createElement("button");
        botao.textContent = produto.nome;

        botao.onclick = () => {
            mostrarLocalizacao(produto);
        };

        listaProdutos.appendChild(botao);
        listaProdutos.appendChild(document.createElement("br"));
    });
}

// Mostra localização do produto
function mostrarLocalizacao(produto) {
    document.getElementById("telaProdutos").style.display = "none";
    document.getElementById("telaBoasVindas").style.display = "none";
    document.getElementById("telaLocalizacao").style.display = "block";

    // Nome do produto
    document.getElementById("nomeProduto").textContent = produto.nome;

    // Desenha o mapa
    if (typeof atualizarMapa === "function") {
        atualizarMapa(produto);
    }

    // Lista de marcas
    const listaMarcas = document.getElementById("listaMarcas");
    listaMarcas.innerHTML = "";

    (produto.marcas || []).forEach(marca => {
        const item = document.createElement("div");
        item.className = "marca";

        const tamanhos = marca.tamanhos ? marca.tamanhos.join(" • ") : "";

        item.innerHTML = `
            <strong>${marca.nome}</strong><br>
            <small>${tamanhos}</small>
        `;

        listaMarcas.appendChild(item);
    });
}

// --- Funções de Navegação (Voltar) ---

function voltarProdutos() {
    document.getElementById("telaProdutos").style.display = "none";
    document.getElementById("telaBoasVindas").style.display = "block";
}

function voltarLocalizacao() {
    document.getElementById("telaLocalizacao").style.display = "none";
    document.getElementById("telaBoasVindas").style.display = "block";
}
