// Nome do arquivo JSON da loja no GitHub
const ARQUIVO_PRODUTOS = "nossoAtacarejoQuixada.json";

// Pesquisa produto
async function localizarProduto() {
    const pesquisaInput = document.getElementById("pesquisa");
    if (!pesquisaInput) return;

    const pesquisa = pesquisaInput.value.trim().toLowerCase();

    if (pesquisa === "") {
        alert("Digite o nome de um produto.");
        return;
    }

    try {
        const resposta = await fetch(ARQUIVO_PRODUTOS);
        
        if (!resposta.ok) {
            throw new Error(`Não foi possível carregar ${ARQUIVO_PRODUTOS}`);
        }

        const produtos = await resposta.json();

        // Busca por nome do produto
        let resultados = produtos.filter(produto =>
            produto.nome.toLowerCase().includes(pesquisa)
        );

        // Se não encontrou por nome, busca por marca
        if (resultados.length === 0) {
            resultados = produtos.filter(produto =>
                produto.marcas?.some(marca =>
                    marca.nome.toLowerCase().includes(pesquisa)
                )
            );
        }

        if (resultados.length === 0) {
            alert("Produto não encontrado.");
            return;
        }

        resultados.sort((a, b) => a.nome.localeCompare(b.nome));

        if (resultados.length === 1) {
            mostrarLocalizacao(resultados[0]);
            return;
        }

        document.getElementById("telaBoasVindas").style.display = "none";
        document.getElementById("telaProdutos").style.display = "block";

        renderizarListaProdutos(resultados);

    } catch (erro) {
        console.error(erro);
        alert("Erro ao carregar o arquivo de produtos.");
    }
}

// Lista todos os produtos
async function listarProdutos() {
    try {
        const resposta = await fetch(ARQUIVO_PRODUTOS);

        if (!resposta.ok) {
            throw new Error(`Não foi possível carregar ${ARQUIVO_PRODUTOS}`);
        }

        const produtos = await resposta.json();

        document.getElementById("telaBoasVindas").style.display = "none";
        document.getElementById("telaProdutos").style.display = "block";

        produtos.sort((a, b) => a.nome.localeCompare(b.nome));

        renderizarListaProdutos(produtos);

    } catch (erro) {
        console.error(erro);
        alert("Erro ao carregar o arquivo de produtos.");
    }
}

// Auxiliar para desenhar os botões na telaProdutos
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

// Mostra localização
function mostrarLocalizacao(produto) {
    document.getElementById("telaProdutos").style.display = "none";
    document.getElementById("telaBoasVindas").style.display = "none";
    document.getElementById("telaLocalizacao").style.display = "block";

    document.getElementById("nomeProduto").textContent = produto.nome;

    if (typeof atualizarMapa === "function") {
        atualizarMapa(produto);
    }

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

// NAVEGAÇÃO
function voltarProdutos() {
    document.getElementById("telaProdutos").style.display = "none";
    document.getElementById("telaBoasVindas").style.display = "block";
}

function voltarLocalizacao() {
    document.getElementById("telaLocalizacao").style.display = "none";
    document.getElementById("telaBoasVindas").style.display = "block";
}
