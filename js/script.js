
// 1. Seleciona os elementos que vamos usar
const botaoMenu = document.querySelector("#btn-menu");
const menu = document.querySelector(".main-nav");

// 2. Escuta o evento de clique no botão
botaoMenu.addEventListener("click", function () {
  // 3. Alterna (liga/desliga) a classe "active" no menu
  menu.classList.toggle("active");
});

let a = 20;
let b = 30;

function somar(a, b) {
    const resultado = a + b;
    return resultado;
}

a = 40;
