const url = 'https://byui-cse.github.io/cse-ww-program-pt/data/profetas-dos-ultimos-dias.json';
const cartoes = document.querySelector('#cartoes');

async function obterDadosDeProfetas() {
  const resposta = await fetch(url);
  const dados = await resposta.json();
  // console.table(dados.profetas); // teste temporário de resposta de dados
  exibirProfetas(dados.profetas); // envia o array "profetas", não o objeto inteiro
}

// Converte "1805-12-23" em "23/12/1805"
const formatarData = (data) => data.split('-').reverse().join('/');

const exibirProfetas = (profetas) => {
  profetas.forEach((profeta) => {
    // Crie elementos para adicionar ao elemento div#cartoes
    let cartao = document.createElement('section');
    let nomeCompleto = document.createElement('h2');
    let nascimento = document.createElement('p');
    let local = document.createElement('p');
    let retrato = document.createElement('img');

    // Conteúdo do h2 com o nome completo do profeta
    nomeCompleto.textContent = `${profeta.nome} ${profeta.sobrenome}`;

    // Data e local de nascimento
    nascimento.textContent = `Data de Nascimento: ${formatarData(profeta.nascimento)}`;
    local.textContent = `Local de Nascimento: ${profeta.localNascimento}`;

    // Atributos da imagem
    retrato.setAttribute('src', profeta.urlImagem);
    retrato.setAttribute('alt', `Retrato de ${profeta.nome} ${profeta.sobrenome}`);
    retrato.setAttribute('loading', 'lazy');
    retrato.setAttribute('width', '340');
    retrato.setAttribute('height', '440');

    // Acrescente os elementos ao cartão
    cartao.appendChild(nomeCompleto);
    cartao.appendChild(nascimento);
    cartao.appendChild(local);
    cartao.appendChild(retrato);

    cartoes.appendChild(cartao);
  }); // fim da arrow function e do loop forEach
};

obterDadosDeProfetas();
