// Recupera os dados enviados pelo formulário
const parametros = new URLSearchParams(window.location.search);

// Exibe os dados na página
function mostrar(id, chave) {
  const elemento = document.querySelector(`#${id}`);

  if (elemento) {
    elemento.textContent = parametros.get(chave) || "Não informado";
  }
}

mostrar("resultado-nome", "nome");
mostrar("resultado-sobrenome", "sobrenome");
mostrar("resultado-email", "email");
mostrar("resultado-telefone", "telefone");
mostrar("resultado-empresa", "empresa");

// Formata a data e hora do envio
const data = parametros.get("timestamp");
const campoData = document.querySelector("#resultado-data");

if (campoData) {
  const dataValida = data ? new Date(data) : null;

  campoData.textContent =
    dataValida && !Number.isNaN(dataValida.getTime())
      ? dataValida.toLocaleString("pt-BR")
      : "Não informado";
}
