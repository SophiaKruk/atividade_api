
const URL = "https://jsonplaceholder.typicode.com/posts?_limit=6";

let publicacoes = [];

const botao = document.querySelector("#btn-carregar");
const filtro = document.querySelector("#filtro");
const mensagem = document.querySelector("#mensagem");

const contador = document.querySelector("#contador");
const botaoOrdenar = document.querySelector("#btn-ordenar");
const botaoAtualizar = document.querySelector("#btn-atualizar");
const botaoConsultar = document.querySelector("#btn-consultar");

const consultaId = document.querySelector("#consulta-id");
const detalhes = document.querySelector("#detalhes");

function renderizarPublicacoes(lista) {
    const painel = document.querySelector("#lista-posts");
    painel.replaceChildren();

    lista.forEach((publicacao) => {
        const cartao = document.createElement("article");
        cartao.classList.add("cartao");

        const id = document.createElement("span");
        id.textContent = `ID: ${publicacao.id}`;

        const titulo = document.createElement("h2");
        titulo.textContent = publicacao.title;

        const conteudo = document.createElement("p");
        conteudo.textContent = publicacao.body;

        cartao.append(id, titulo, conteudo);
        painel.append(cartao);
    });

    contador.textContent = `Publicações visíveis: ${lista.length}`;
}
function carregarPublicacoes() {
    mensagem.textContent = "Carregando publicações...";
    botao.disabled = true;
    botaoAtualizar.disabled = true;

    fetch(URL)
        .then((resposta) => {
            if (!resposta.ok) {
                throw new Error(`Erro HTTP: ${resposta.status}`);
            }

            return resposta.json();
        })
        .then((dados) => {
            publicacoes = dados;

            filtro.value = "";
            renderizarPublicacoes(publicacoes);

            mensagem.textContent = "Publicações carregadas!";
        })
        .catch((erro) => {
            console.error(erro);

            mensagem.textContent =
                "Não foi possível carregar as publicações.";

            publicacoes = [];
            renderizarPublicacoes([]);
        })
        .finally(() => {
            botao.disabled = false;
            botaoAtualizar.disabled = false;
        });
}
botao.addEventListener("click", () => {
    carregarPublicacoes();
});
filtro.addEventListener("input", () => {
    const termo = filtro.value.trim().toLowerCase();

    const encontradas = publicacoes.filter((item) => {
        return item.title.toLowerCase().includes(termo);
    });

    renderizarPublicacoes(encontradas);

    if (encontradas.length === 0) {
        mensagem.textContent = "Nenhuma publicação encontrada.";
    } else {
        mensagem.textContent = "";
    }
});
botaoOrdenar.addEventListener("click", () => {
    const ordenadas = [...publicacoes].sort((a, b) => {
        return a.title.localeCompare(b.title);
    });

    const termo = filtro.value.trim().toLowerCase();

    const encontradas = ordenadas.filter((item) => {
        return item.title.toLowerCase().includes(termo);
    });

    renderizarPublicacoes(encontradas);

    mensagem.textContent = "Publicações ordenadas por título!";
});
botaoConsultar.addEventListener("click", () => {
    const id = Number(consultaId.value);

    detalhes.replaceChildren();

    if (!Number.isInteger(id) || id < 1) {
        mensagem.textContent = "Digite um ID válido.";
        return;
    }

    mensagem.textContent = "Consultando publicação...";

    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
        .then((resposta) => {
            if (!resposta.ok) {
                throw new Error(`Erro HTTP: ${resposta.status}`);
            }

            return resposta.json();
        })
        .then((dados) => {
            if (!dados.id) {
                throw new Error("Publicação não encontrada.");
            }

            const titulo = document.createElement("h3");
            titulo.textContent = dados.title;

            const conteudo = document.createElement("p");
            conteudo.textContent = dados.body;

            const identificacao = document.createElement("span");
            identificacao.textContent = `ID: ${dados.id}`;

            detalhes.append(identificacao, titulo, conteudo);

            mensagem.textContent = "Publicação encontrada!";
        })
        .catch((erro) => {
            console.error(erro);
            mensagem.textContent = "Publicação não encontrada. Confira o ID.";
            detalhes.replaceChildren();
        });
});

botaoAtualizar.addEventListener("click", () => {
    carregarPublicacoes();
});
carregarPublicacoes();
