const url = 'data/membros.json';
const containerMembros = document.querySelector('#membros');
const botaoGrade = document.querySelector('#botao-grade');
const botaoLista = document.querySelector('#botao-lista');

const niveis = {
  1: 'Sem fins lucrativos',
  2: 'Prata',
  3: 'Ouro'
};

async function obterMembros() {
  try {
    const resposta = await fetch(url);
    if (!resposta.ok) {
      throw new Error(`Erro ${resposta.status}`);
    }
    const dados = await resposta.json();
    exibirMembros(dados.membros);
  } catch (erro) {
    containerMembros.textContent = 'Não foi possível carregar o diretório de membros.';
    console.error('Erro ao buscar membros:', erro);
  }
}

const exibirMembros = (membros) => {
  containerMembros.innerHTML = '';

  membros.forEach((membro) => {
    const cartao = document.createElement('section');
    cartao.classList.add('membro');

    const logo = document.createElement('img');
    logo.setAttribute('src', `imagens/${membro.imagem}`);
    logo.setAttribute('alt', `Logotipo de ${membro.nome}`);
    logo.setAttribute('loading', 'lazy');
    logo.setAttribute('width', '100');
    logo.setAttribute('height', '100');

    const nome = document.createElement('h2');
    nome.textContent = membro.nome;

    const nivel = document.createElement('p');
    nivel.classList.add('nivel', `nivel-${membro.nivel}`);
    nivel.textContent = niveis[membro.nivel];

    const endereco = document.createElement('p');
    endereco.textContent = membro.endereco;

    const telefone = document.createElement('p');
    const linkTelefone = document.createElement('a');
    linkTelefone.href = `tel:+55${membro.telefone.replace(/\D/g, '')}`;
    linkTelefone.textContent = membro.telefone;
    telefone.appendChild(linkTelefone);

    const site = document.createElement('p');
    const linkSite = document.createElement('a');
    linkSite.href = membro.site;
    linkSite.textContent = membro.site.replace('https://', '');
    site.appendChild(linkSite);

    cartao.appendChild(logo);
    cartao.appendChild(nome);
    cartao.appendChild(nivel);
    cartao.appendChild(endereco);
    cartao.appendChild(telefone);
    cartao.appendChild(site);

    containerMembros.appendChild(cartao);
  });
};

// Alternância entre grade e lista
const mudarExibicao = (modo) => {
  const emGrade = modo === 'grade';
  containerMembros.classList.toggle('grade', emGrade);
  containerMembros.classList.toggle('lista', !emGrade);
  botaoGrade.classList.toggle('ativo', emGrade);
  botaoLista.classList.toggle('ativo', !emGrade);
  botaoGrade.setAttribute('aria-pressed', emGrade);
  botaoLista.setAttribute('aria-pressed', !emGrade);
};

botaoGrade.addEventListener('click', () => mudarExibicao('grade'));
botaoLista.addEventListener('click', () => mudarExibicao('lista'));

obterMembros();
