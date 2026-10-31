// Menu responsivo (hambúrguer)
const botaoMenu = document.querySelector("#menu");
const navegacao = document.querySelector("#navegacao");

botaoMenu.addEventListener("click", () => {
  const aberto = navegacao.classList.toggle("aberto");
  botaoMenu.classList.toggle("aberto", aberto);
  botaoMenu.setAttribute("aria-expanded", aberto);
  botaoMenu.setAttribute(
    "aria-label",
    aberto ? "Fechar menu de navegação" : "Abrir menu de navegação"
  );
});
