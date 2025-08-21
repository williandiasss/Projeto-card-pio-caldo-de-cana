
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










//--document.addEventListener('DOMContentLoaded', () => {
  // ----------------------
  // Código existente: abrir categoria
  // ----------------------
  //const allSections = document.querySelectorAll('.categoria');
  //allSections.forEach(section => {
      //section.style.display = 'none'; // esconde todas ao carregar
 //});

//  window.openCategory = function(categoryName) {
    //  allSections.forEach(section => {
       //   section.style.display = 'none'; // esconde todas
    //  });
   //  const targetSection = document.querySelector(`.categoria.${categoryName}`);
    //  if (targetSection) {
      //    targetSection.style.display = 'block'; // mostra a clicada
   //   }
//  }

  // ----------------------
  // Código do carrinho
  // ----------------------
 // const carrinho = [];
//  const tamanhosContainers = document.querySelectorAll('.tamanhos');
//  const botaoWhatsapp = document.getElementById('enviar-whatsapp');
//  const numeroLoja = '5511999999999'; // coloque o número da sua loja

//  function atualizarCarrinho() {
    //  let carrinhoHTML = '';
    //  let totalGeral = 0;
    //  carrinho.forEach(item => {
   //       carrinhoHTML += `<li>${item.nome} x${item.quantidade} = R$ ${item.total.toFixed(2)}</li>`;
   //       totalGeral += item.total;
  //    });

   //   let carrinhoLista = document.getElementById('carrinho-lista');
   //   if (!carrinhoLista) {
    //      carrinhoLista = document.createElement('ul');
    //      carrinhoLista.id = 'carrinho-lista';
   //       document.body.appendChild(carrinhoLista);
   //   }

  //    carrinhoLista.innerHTML = carrinhoHTML + `<li><strong>Total: R$ ${totalGeral.toFixed(2)}</strong></li>`;
//  }

//  function adicionarAoCarrinho(nome, preco, quantidade) {
    //  if (quantidade <= 0) return;
   //   const itemExistente = carrinho.find(item => item.nome === nome);
   //   if (itemExistente) {
    //      itemExistente.quantidade += quantidade;
    //      itemExistente.total = itemExistente.preco * itemExistente.quantidade;
   //   } else {
      //    carrinho.push({ nome, preco, quantidade, total: preco * quantidade });
   //   }
  //    atualizarCarrinho();
//  }

  // Eventos nos inputs de quantidade
//  tamanhosContainers.forEach(container => {
   //  const inputs = container.querySelectorAll('input');
    //  inputs.forEach(input => {
      //    input.addEventListener('change', e => {
       //       const quantidade = parseInt(e.target.value);
       //       const nome = e.target.dataset.name;
       //       const preco = parseFloat(e.target.dataset.price);
       //       adicionarAoCarrinho(nome, preco, quantidade);
      //    });
    //  });
//  });

  // Enviar pedido pelo WhatsApp
//  botaoWhatsapp.addEventListener('click', () => {
    //  if (carrinho.length === 0) {
     ///     alert('O carrinho está vazio!');
    //      return;
  //    }

   //   let mensagem = 'Olá! Gostaria de fazer o pedido:\n';
   //   carrinho.forEach(item => {
  //        mensagem += `- ${item.nome} x${item.quantidade} = R$ ${item.total.toFixed(2)}\n`;
  //    });

   //   const totalGeral = carrinho.reduce((acc, item) => acc + item.total, 0);
   //   mensagem += `Total: R$ ${totalGeral.toFixed(2)}`;

    //  const url = `https://api.whatsapp.com/send?phone=${numeroLoja}&text=${encodeURIComponent(mensagem)}`;
     // window.open(url, '_blank');
//  });
//});


