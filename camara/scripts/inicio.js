// Página inicial da Câmara de Comércio de Sombrio
const membrosUrl = 'dados/membros.json';
const membrosContainer = document.querySelector('#membros-destaque');
const climaAtualContainer = document.querySelector('#clima-atual');
const previsaoContainer = document.querySelector('#previsao');
const climaAtualizado = document.querySelector('#clima-atualizado');

// Coordenadas aproximadas de Sombrio, Santa Catarina.
const localidade = { latitude: -29.1081, longitude: -49.6167 };

// Insira sua chave gratuita do OpenWeatherMap neste campo.
// Restrinja a chave ao domínio do seu site nas configurações da sua conta.
const chaveOpenWeather = 'SUA_CHAVE_OPENWEATHERMAP';

const nomeNivel = (nivel) => ({
  2: 'Prata',
  3: 'Ouro'
}[nivel] || 'Associado');

async function carregarMembrosDestaque() {
  try {
    const resposta = await fetch(membrosUrl);
    if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);

    const dados = await resposta.json();
    const elegiveis = dados.membros.filter((membro) => membro.nivel === 2 || membro.nivel === 3);

    // Embaralha os associados elegíveis e seleciona até três sem repetição.
    const embaralhados = [...elegiveis].sort(() => Math.random() - 0.5);
    const selecionados = embaralhados.slice(0, 3);

    membrosContainer.innerHTML = '';

    selecionados.forEach((membro) => {
      const cartao = document.createElement('article');
      cartao.className = 'cartao-destaque';

      const imagem = document.createElement('img');
      imagem.src = `imagens/${membro.imagem}`;
      imagem.alt = `Logotipo de ${membro.nome}`;
      imagem.width = 110;
      imagem.height = 110;
      imagem.loading = 'lazy';

      const conteudo = document.createElement('div');
      const nome = document.createElement('h3');
      nome.textContent = membro.nome;

      const nivel = document.createElement('span');
      nivel.className = `nivel nivel-${membro.nivel}`;
      nivel.textContent = `Nível ${nomeNivel(membro.nivel)}`;

      const endereco = document.createElement('p');
      endereco.textContent = membro.endereco;

      const telefone = document.createElement('p');
      const linkTelefone = document.createElement('a');
      linkTelefone.href = `tel:+55${membro.telefone.replace(/\\D/g, '')}`;
      linkTelefone.textContent = membro.telefone;
      telefone.append(linkTelefone);

      const site = document.createElement('p');
      const linkSite = document.createElement('a');
      linkSite.href = membro.site;
      linkSite.target = '_blank';
      linkSite.rel = 'noopener noreferrer';
      linkSite.textContent = 'Visitar site';
      site.append(linkSite);

      conteudo.append(nome, nivel, endereco, telefone, site);
      cartao.append(imagem, conteudo);
      membrosContainer.append(cartao);
    });
  } catch (erro) {
    membrosContainer.textContent = 'Não foi possível carregar os associados em destaque.';
    console.error('Erro ao carregar associados:', erro);
  }
}

function formatarData(data) {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short'
  }).format(data);
}

function urlIconeClima(codigo) {
  return `https://openweathermap.org/img/wn/${codigo}@2x.png`;
}

async function carregarClima() {
  if (chaveOpenWeather === 'SUA_CHAVE_OPENWEATHERMAP') {
    climaAtualContainer.innerHTML = '<p>Adicione sua chave do OpenWeatherMap em <code>scripts/inicio.js</code> para exibir os dados meteorológicos.</p>';
    previsaoContainer.textContent = 'A previsão será exibida após configurar a chave da API.';
    climaAtualizado.textContent = 'Configuração pendente';
    return;
  }

  const parametros = `lat=${localidade.latitude}&lon=${localidade.longitude}&units=metric&lang=pt_br&appid=${chaveOpenWeather}`;

  try {
    const [respostaAtual, respostaPrevisao] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?${parametros}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?${parametros}`)
    ]);

    if (!respostaAtual.ok || !respostaPrevisao.ok) {
      throw new Error('Não foi possível consultar os dados meteorológicos.');
    }

    const atual = await respostaAtual.json();
    const previsao = await respostaPrevisao.json();

    const temperatura = Math.round(atual.main.temp);
    const sensacao = Math.round(atual.main.feels_like);
    const descricao = atual.weather[0].description;
    const icone = atual.weather[0].icon;

    climaAtualContainer.innerHTML = `
      <div class="temperatura-principal">
        <img src="${urlIconeClima(icone)}" alt="" width="90" height="90">
        <strong>${temperatura}°C</strong>
      </div>
      <div>
        <h3>Condições atuais</h3>
        <p class="descricao-clima">${descricao}</p>
        <p>Sensação térmica: ${sensacao}°C</p>
        <p>Umidade: ${atual.main.humidity}%</p>
        <p>Vento: ${Math.round(atual.wind.speed * 3.6)} km/h</p>
      </div>
    `;

    // Seleciona uma previsão próxima do meio-dia para cada um dos três dias seguintes.
    const dias = new Map();
    previsao.list.forEach((item) => {
      const data = new Date(item.dt * 1000);
      const chaveDia = data.toLocaleDateString('en-CA');
      if (chaveDia === new Date().toLocaleDateString('en-CA')) return;

      const hora = data.getHours();
      const distanciaMeioDia = Math.abs(hora - 12);
      const registro = dias.get(chaveDia);

      if (!registro || distanciaMeioDia < registro.distancia) {
        dias.set(chaveDia, { item, distancia: distanciaMeioDia });
      }
    });

    const proximosDias = [...dias.values()].slice(0, 3);
    previsaoContainer.innerHTML = '';

    proximosDias.forEach(({ item }) => {
      const data = new Date(item.dt * 1000);
      const cartao = document.createElement('article');
      cartao.className = 'dia-previsao';

      const dia = document.createElement('h4');
      dia.textContent = formatarData(data);

      const imagem = document.createElement('img');
      imagem.src = urlIconeClima(item.weather[0].icon);
      imagem.alt = item.weather[0].description;
      imagem.width = 60;
      imagem.height = 60;

      const temperaturaDia = document.createElement('strong');
      temperaturaDia.textContent = `${Math.round(item.main.temp)}°C`;

      const descricaoDia = document.createElement('p');
      descricaoDia.textContent = item.weather[0].description;

      cartao.append(dia, imagem, temperaturaDia, descricaoDia);
      previsaoContainer.append(cartao);
    });

    climaAtualizado.textContent = `Atualizado às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  } catch (erro) {
    climaAtualContainer.textContent = 'As condições atuais estão temporariamente indisponíveis.';
    previsaoContainer.textContent = 'Não foi possível carregar a previsão. Tente novamente mais tarde.';
    climaAtualizado.textContent = 'Dados indisponíveis';
    console.error('Erro ao carregar clima:', erro);
  }
}

carregarMembrosDestaque();
carregarClima();
