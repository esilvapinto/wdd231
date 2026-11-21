// Preenche a data e hora do formulário
const campoData = document.querySelector("#timestamp");

if (campoData) {
  campoData.value = new Date().toISOString();
}

// Abre os modais de benefícios
document.querySelectorAll(".abrir-modal").forEach((link) => {
  link.addEventListener("click", (evento) => {
    evento.preventDefault();

    const modalId = link.getAttribute("href");
    const modal = document.querySelector(modalId);

    if (modal) {
      modal.showModal();
    }
  });
});

// Fecha os modais
document.querySelectorAll(".fechar-modal").forEach((botao) => {
  botao.addEventListener("click", () => {
    botao.closest("dialog").close();
  });
});
