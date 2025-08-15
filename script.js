
// Função principal que abre a categoria desejada
function openCategory(categoryName) {
    const allSections = document.querySelectorAll('.categoria');

    // Oculta todas as categorias
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