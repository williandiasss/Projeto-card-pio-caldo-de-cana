
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


 // ===============
// MAPEAMENTO
// ===============
  const carrinhoTotal = document.querySelector('#carrinho-flutuante'); // aparece QTD itens e vai somando os preços//
  const inputQtd = document.querySelectorAll('.tamanhos input'); // Pega todos os inputs de quantidade dentro de .tamanhos
  const carrinhoLista = document.getElementById("carrinho-itens");
  const totalSpan = document.getElementById("carrinho-total");
   const itensCount = document.querySelector('#itens-count');      // span total de itens
  const totalCount = document.querySelector('#total-count');      // span total em R$
