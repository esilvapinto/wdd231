// Menu responsivo (botão hambúrguer)
const botaoMenu = document.querySelector('#botao-menu');
const menu = document.querySelector('#menu');

botaoMenu.addEventListener('click', () => {
  const aberto = menu.classList.toggle('aberto');
  botaoMenu.classList.toggle('aberto', aberto);
  botaoMenu.setAttribute('aria-expanded', aberto);
  botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
});

// Ano atual e data da última modificação no rodapé
document.querySelector('#ano-atual').textContent = new Date().getFullYear();
document.querySelector('#ultima-modificacao').textContent = document.lastModified;
