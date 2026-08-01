// Nome do arquivo JSON contendo o catálogo do Nosso Atacarejo Quixadá
const ARQUIVO_PRODUTOS = "nossoAtacarejoQuixada.json";

// Pesquisa produto por nome ou marcas
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

        // Nenhum resultado encontrado
        if (resultados.length === 0) {
            alert("Produto não encontrado.");
            return;
        }

        resultados.sort((a, b) => a.nome.localeCompare(b.nome));

        // Apenas um resultado: abre direto a localização
        if (resultados.length === 1) {
            mostrarLocalizacao(resultados[0]);
            return;
        }

        // Vários resultados: exibe lista para escolha
        document.getElementById("telaBoasVindas").style.display = "none";
        document.getElementById("telaProdutos").style.display = "block";

        renderizarListaProdutos(resultados);

    } catch (erro) {
        console.error(erro);
        alert("Erro ao carregar o arquivo " + ARQUIVO_PRODUTOS);
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
        alert("Erro ao carregar o arquivo " + ARQUIVO_PRODUTOS);
    }
}

// Renderiza a lista de botões de produtos
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

    // Desenha o mapa (se a função existir no mapa.js)
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
