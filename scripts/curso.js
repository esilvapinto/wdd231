// Cursos do certificado de Programação de Computadores e Web
// Altere "completed" para true quando concluir um curso.
const courses = [
  {
    subject: "CSE",
    number: 110,
    title: "Introdução à Programação",
    credits: 2,
    certificate: "Programação de Computadores e Web",
    description:
      "Introdução à programação de computadores: variáveis, decisões, laços, listas e funções, usando Python.",
    technology: ["Python"],
    completed: true
  },
  {
    subject: "WDD",
    number: 130,
    title: "Fundamentos da Web",
    credits: 2,
    certificate: "Programação de Computadores e Web",
    description:
      "Introdução à criação de sites com HTML e CSS e à publicação na web.",
    technology: ["HTML", "CSS"],
    completed: true
  },
  {
    subject: "CSE",
    number: 111,
    title: "Programação com Funções",
    credits: 2,
    certificate: "Programação de Computadores e Web",
    description:
      "Escrever, chamar, depurar e testar funções próprias, além de tratar exceções, usando Python.",
    technology: ["Python"],
    completed: true
  },
  {
    subject: "CSE",
    number: 210,
    title: "Programação com Classes",
    credits: 2,
    certificate: "Programação de Computadores e Web",
    description:
      "Programação orientada a objetos: classes, encapsulamento, herança e polimorfismo, usando C#.",
    technology: ["C#"],
    completed: false
  },
  {
    subject: "WDD",
    number: 131,
    title: "Desenvolvimento Web Dinâmico",
    credits: 2,
    certificate: "Programação de Computadores e Web",
    description:
      "Criação de páginas dinâmicas e responsivas com HTML, CSS e JavaScript.",
    technology: ["HTML", "CSS", "JavaScript"],
    completed: true
  },
  {
    subject: "WDD",
    number: 231,
    title: "Desenvolvimento Web Frontend I",
    credits: 2,
    certificate: "Programação de Computadores e Web",
    description:
      "Aprofundamento em desenvolvimento frontend: acessibilidade, desempenho, APIs e boas práticas.",
    technology: ["HTML", "CSS", "JavaScript"],
    completed: false
  }
];

const containerCursos = document.querySelector("#cursos");
const totalCreditos = document.querySelector("#totalCreditos");
const creditosConcluidos = document.querySelector("#creditosConcluidos");
const botoesFiltro = document.querySelectorAll(".filtro");

function exibirCursos(lista) {
  containerCursos.innerHTML = "";

  lista.forEach((curso) => {
    const cartao = document.createElement("p");
    cartao.classList.add("curso");
    if (curso.completed) {
      cartao.classList.add("concluido");
    }
    cartao.textContent = `${curso.subject} ${curso.number}`;
    cartao.title = curso.completed
      ? `${curso.title} – concluído`
      : curso.title;
    containerCursos.appendChild(cartao);
  });

  // Soma dos créditos apenas dos cursos exibidos
  const creditos = lista.reduce((soma, curso) => soma + curso.credits, 0);
  totalCreditos.textContent = creditos;

  // Soma dos créditos apenas dos cursos concluídos exibidos
  const concluidos = lista
    .filter((curso) => curso.completed)
    .reduce((soma, curso) => soma + curso.credits, 0);
  creditosConcluidos.textContent = concluidos;
}

botoesFiltro.forEach((botao) => {
  botao.addEventListener("click", () => {
    const filtro = botao.dataset.filtro;

    botoesFiltro.forEach((b) => {
      b.classList.remove("ativo");
      b.setAttribute("aria-pressed", "false");
    });
    botao.classList.add("ativo");
    botao.setAttribute("aria-pressed", "true");

    const filtrados =
      filtro === "todos"
        ? courses
        : courses.filter((curso) => curso.subject === filtro);

    exibirCursos(filtrados);
  });
});

exibirCursos(courses);
