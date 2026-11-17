// Página inicial da Câmara de Comércio de Sombrio
const membrosUrl = 'dados/membros.json';
const membrosContainer = document.querySelector('#membros-destaque');
const climaAtualContainer = document.querySelector('#clima-atual');
const previsaoContainer = document.querySelector('#previsao');
const climaAtualizado = document.querySelector('#clima-atualizado');

// Coordenadas aproximadas de Sombrio, Santa Catarina.
const localidade = { latitude: -29.1081, longitude: -49.6167 };


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


function descricaoClima(codigo) {
  const descricoes = {
    0: "Céu limpo",
    1: "Predominantemente limpo",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Nevoeiro",
    48: "Nevoeiro com geada",
    51: "Garoa leve",
    53: "Garoa moderada",
    55: "Garoa intensa",
    56: "Garoa congelante",
    57: "Garoa congelante intensa",
    61: "Chuva leve",
    63: "Chuva moderada",
    65: "Chuva intensa",
    66: "Chuva congelante",
    67: "Chuva congelante intensa",
    71: "Neve leve",
    73: "Neve moderada",
    75: "Neve intensa",
    77: "Grãos de neve",
    80: "Pancadas de chuva leves",
    81: "Pancadas de chuva moderadas",
    82: "Pancadas de chuva intensas",
    85: "Pancadas de neve leves",
    86: "Pancadas de neve intensas",
    95: "Trovoadas",
    96: "Trovoadas com granizo",
    99: "Trovoadas fortes com granizo"
  };

  return descricoes[codigo] || "Condição não identificada";
}

function iconeClima(codigo) {
  if (codigo === 0) return "☀️";
  if ([1, 2].includes(codigo)) return "🌤️";
  if ([3, 45, 48].includes(codigo)) return "☁️";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(codigo)) return "🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(codigo)) return "❄️";
  if ([95, 96, 99].includes(codigo)) return "⛈️";
  return "🌡️";
}


async function carregarClima() {
  const url = "https://api.open-meteo.com/v1/forecast"
    + `?latitude=${localidade.latitude}`
    + `&longitude=${localidade.longitude}`
    + "&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m"
    + "&daily=weather_code,temperature_2m_max,temperature_2m_min"
    + "&timezone=America%2FSao_Paulo&forecast_days=4&wind_speed_unit=kmh";

  try {
    climaAtualContainer.textContent = "Carregando condições meteorológicas...";
    previsaoContainer.textContent = "Carregando previsão...";

    const resposta = await fetch(url);
    if (!resposta.ok) throw new Error("Falha na consulta meteorológica.");

    const dados = await resposta.json();
    const atual = dados.current;

    climaAtualContainer.innerHTML = `
      <div class="temperatura-principal">
        <span aria-hidden="true" style="font-size:3.5rem">${iconeClima(atual.weather_code)}</span>
        <strong>${Math.round(atual.temperature_2m)}°C</strong>
      </div>
      <div>
        <h3>Condições atuais</h3>
        <p class="descricao-clima">${descricaoClima(atual.weather_code)}</p>
        <p>Sensação térmica: ${Math.round(atual.apparent_temperature)}°C</p>
        <p>Umidade: ${atual.relative_humidity_2m}%</p>
        <p>Vento: ${Math.round(atual.wind_speed_10m)} km/h</p>
      </div>`;

    previsaoContainer.innerHTML = "";

    for (let i = 1; i <= 3; i++) {
      const cartao = document.createElement("article");
      cartao.className = "dia-previsao";

      const dia = document.createElement("h4");
      dia.textContent = formatarData(new Date(`${dados.daily.time[i]}T12:00:00`));

      const icone = document.createElement("span");
      icone.textContent = iconeClima(dados.daily.weather_code[i]);
      icone.setAttribute("aria-hidden", "true");
      icone.style.fontSize = "2rem";

      const temperatura = document.createElement("strong");
      temperatura.textContent =
        `${Math.round(dados.daily.temperature_2m_max[i])}°C / ${Math.round(dados.daily.temperature_2m_min[i])}°C`;

      const descricao = document.createElement("p");
      descricao.textContent = descricaoClima(dados.daily.weather_code[i]);

      cartao.append(dia, icone, temperatura, descricao);
      previsaoContainer.append(cartao);
    }

    climaAtualizado.textContent =
      `Atualizado às ${new Date().toLocaleTimeString("pt-BR", {hour:"2-digit", minute:"2-digit"})} · Fonte: Open-Meteo`;

  } catch (erro) {
    climaAtualContainer.textContent = "As condições atuais estão temporariamente indisponíveis.";
    previsaoContainer.textContent = "Não foi possível carregar a previsão. Tente novamente mais tarde.";
    climaAtualizado.textContent = "Dados indisponíveis";
    console.error("Erro ao carregar clima:", erro);
  }
}

carregarMembrosDestaque();
carregarClima();
