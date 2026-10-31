// Ano atual no rodapé
document.getElementById("anoAtual").textContent = new Date().getFullYear();

// Data da última modificação do documento
document.getElementById("ultimaModificacao").innerHTML =
  `Última modificação: ${document.lastModified}`;
