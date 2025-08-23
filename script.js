
// Função principal que abre a categoria desejada
function openCategory(categoryName) {
  const allSections = document.querySelectorAll('.categoria');

  //Oculta todas as categorias
  allSections.forEach(section => {
    section.style.display = 'none';
  });

  // Mostra apenas a categoria clicada
  const targetSection = document.querySelector(`.categoria.${categoryName}`);
  if (targetSection) {
    targetSection.style.display = 'block';
  }
}

// Oculta todas as categorias ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  const allSections = document.querySelectorAll('.categoria');
  allSections.forEach(section => {
    section.style.display = 'none';
  });
});


//Inicializa o carrinho
//  atualizarCarrinho();


//Seleciona inputs
 // const pizzaInputs = document.querySelectorAll('.com-input input');
//  const bordaInputs = document.querySelectorAll('.borda-info input');
//  const itensCount = document.getElementById('itens-count');
//  const totalCount = document.getElementById('total-count');

//Função para atualizar o carrinho
//  function atualizarCarrinho() {
//  let totalItens = 0;
//  let totalPreco = 0;

  //Guarda a quantidade de pizzas por tamanho
//  const pizzaQtd = { P: 0, M: 0, G: 0 };

//  pizzaInputs.forEach(input => {
//    const qtd = parseInt(input.value) || 0;
//    const preco = parseFloat(input.dataset.price) || 0;
  //  totalItens += qtd;
//    totalPreco += qtd * preco;

  //  if (input.dataset.name.endsWith("P")) pizzaQtd.P += qtd;
 //   if (input.dataset.name.endsWith("M")) pizzaQtd.M += qtd;
  //  if (input.dataset.name.endsWith("G")) pizzaQtd.G += qtd;
//  });

  //Atualiza inputs de borda
//  bordaInputs.forEach(input => {
//    const tamanho = input.dataset.name.split(' ')[1]; // P, M ou G
//    if (pizzaQtd[tamanho] === 0) {
  //    input.disabled = true;
  //    input.value = 0; // reseta valor
  //  } else {
  //    input.disabled = false;
   // }

  //  const qtd = parseInt(input.value) || 0;
  //  const preco = parseFloat(input.dataset.price) || 0;
   // totalItens += qtd;
     //totalPreco += qtd * preco;
   // });

  //Atualiza display do carrinho
 // itensCount.textContent = totalItens;
  // totalCount.textContent = totalPreco.toFixed(2);
// }

// Adiciona evento de input em todos os inputs
// pizzaInputs.forEach(input => input.addEventListener('input', atualizarCarrinho));
// bordaInputs.forEach(input => input.addEventListener('input', atualizarCarrinho));







