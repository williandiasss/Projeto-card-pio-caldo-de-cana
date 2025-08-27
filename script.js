
// Sistema de carrinho
let carrinho = [];
let totalCarrinho = 0;

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

// Função para atualizar o carrinho flutuante
function atualizarCarrinho() {
  const itensCount = document.getElementById('itens-count');
  const totalCount = document.getElementById('total-count');
  
  let totalItens = 0;
  let valorTotal = 0;
  
  carrinho.forEach(item => {
    totalItens += item.quantidade;
    valorTotal += item.subtotal;
  });
  
  itensCount.textContent = totalItens;
  totalCount.textContent = valorTotal.toFixed(2);
  
  // Mostrar/esconder o carrinho baseado no conteúdo
  const carrinhoFlutuante = document.getElementById('carrinho-flutuante');
  if (totalItens > 0) {
    carrinhoFlutuante.style.display = 'flex';
  } else {
    carrinhoFlutuante.style.display = 'none';
  }
}

// Função para adicionar/remover item do carrinho
function gerenciarItem(nome, preco, quantidade) {
  const itemExistente = carrinho.find(item => item.nome === nome);
  
  if (quantidade === 0) {
    // Remove o item se a quantidade for 0
    carrinho = carrinho.filter(item => item.nome !== nome);
  } else {
    if (itemExistente) {
      // Atualiza item existente
      itemExistente.quantidade = quantidade;
      itemExistente.subtotal = preco * quantidade;
    } else {
      // Adiciona novo item
      carrinho.push({
        nome: nome,
        preco: preco,
        quantidade: quantidade,
        subtotal: preco * quantidade
      });
    }
  }
  
  atualizarCarrinho();
}

// Função para sincronizar bordas com pizzas
function sincronizarBorda(tamanho) {
  const bordaInputs = document.querySelectorAll('input[data-name*="Borda"]');
  let temPizzaDesseTamanho = false;
  
  // Verifica se há alguma pizza desse tamanho no carrinho
  carrinho.forEach(item => {
    if (item.nome.includes('Pizza') || item.nome.includes('P') || item.nome.includes('M') || item.nome.includes('G')) {
      if ((tamanho === 'P' && item.nome.includes(' P')) ||
          (tamanho === 'M' && item.nome.includes(' M')) ||
          (tamanho === 'G' && item.nome.includes(' G'))) {
        temPizzaDesseTamanho = true;
      }
    }
  });
  
  // Se não tem pizza desse tamanho, zera a borda correspondente
  if (!temPizzaDesseTamanho) {
    bordaInputs.forEach(input => {
      if (input.getAttribute('data-name').includes(`Borda ${tamanho}`)) {
        input.value = 0;
        gerenciarItem(input.getAttribute('data-name'), parseFloat(input.getAttribute('data-price')), 0);
      }
    });
  }
}

// Função para validar bordas ao adicionar pizzas
function validarBordaPizza(inputElement) {
  const nomePizza = inputElement.getAttribute('data-name');
  const quantidade = parseInt(inputElement.value);
  
  if (nomePizza && (nomePizza.includes(' P') || nomePizza.includes(' M') || nomePizza.includes(' G'))) {
    let tamanho = '';
    if (nomePizza.includes(' P')) tamanho = 'P';
    else if (nomePizza.includes(' M')) tamanho = 'M';
    else if (nomePizza.includes(' G')) tamanho = 'G';
    
    if (quantidade === 0) {
      sincronizarBorda(tamanho);
    }
  }
}

// Função para gerar mensagem do pedido
function gerarMensagemPedido() {
  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio! Adicione alguns itens antes de finalizar o pedido.');
    return '';
  }
  
  let mensagem = '*🍽️ NOVO PEDIDO - CARDOSO CALDO DE CANA*\n\n';
  mensagem += '📋 *ITENS DO PEDIDO:*\n\n';
  
  let totalGeral = 0;
  let numeroItem = 1;
  
  // Organiza itens por categoria
  const categorias = {
    'Lanches': [],
    'Especiais': [],
    'Tábuas': [],
    'Torre': [],
    'Porções': [],
    'Pizzas Tradicionais': [],
    'Pizzas Especiais': [],
    'Pizzas Doces': [],
    'Bordas': [],
    'Cervejas': [],
    'Bebidas': [],
    'Caipirinhas': [],
    'Açaí': [],
    'Adicionais': []
  };
  
  carrinho.forEach(item => {
    let categoria = 'Outros';
    
    if (item.nome.includes('Misto') || item.nome.includes('X ') || item.nome.includes('Hamburguer')) {
      categoria = item.nome.includes('Hamburguer') ? 'Especiais' : 'Lanches';
    } else if (item.nome.includes('Tábua')) {
      categoria = 'Tábuas';
    } else if (item.nome.includes('Torre')) {
      categoria = 'Torre';
    } else if (item.nome.includes('Batata') || item.nome.includes('Aipim') || item.nome.includes('Calabresa') || 
               item.nome.includes('Carne') || item.nome.includes('Camarão') || item.nome.includes('Casquinha') ||
               item.nome.includes('Cebola') || item.nome.includes('Coração') || item.nome.includes('Coxinha') ||
               item.nome.includes('Frango') || item.nome.includes('Filezinho') || item.nome.includes('Isca') ||
               item.nome.includes('Polenta') || item.nome.includes('Frios') || item.nome.includes('Pãozinho') ||
               item.nome.includes('Ovo de Codorna')) {
      categoria = 'Porções';
    } else if (item.nome.includes('Borda')) {
      categoria = 'Bordas';
    } else if ((item.nome.includes('Quatro Queijos') || item.nome.includes('Bacon') || item.nome.includes('Calabresa') ||
                item.nome.includes('Brócolis') || item.nome.includes('Frango com Catupiry') || item.nome.includes('Mista') ||
                item.nome.includes('Pasqualina') || item.nome.includes('Portuguesa') || item.nome.includes('Marguerita') ||
                item.nome.includes('Lombo Defumado') || item.nome.includes('Alho e Óleo') || item.nome.includes('Tomate Seco') ||
                item.nome.includes('Peperoni') || item.nome.includes('Baiana') || item.nome.includes('Agridoce')) && 
               !item.nome.includes('Especial')) {
      categoria = 'Pizzas Tradicionais';
    } else if (item.nome.includes('Especial') || item.nome.includes('Palmito') || item.nome.includes('Strogonoff') ||
               item.nome.includes('Americana') || item.nome.includes('Alcatra') || item.nome.includes('Coração Acebolado') ||
               item.nome.includes('Camarão')) {
      categoria = 'Pizzas Especiais';
    } else if (item.nome.includes('Chocolate') || item.nome.includes('Charge') || item.nome.includes('Confete') ||
               item.nome.includes('Brigadeiro') || item.nome.includes('Prestígio') || item.nome.includes('Paçoquita') ||
               item.nome.includes('Banana') || item.nome.includes('Abacaxi') || item.nome.includes('Nevada')) {
      categoria = 'Pizzas Doces';
    } else if (item.nome.includes('Antártica') || item.nome.includes('Brahma') || item.nome.includes('Original') ||
               item.nome.includes('Corona') || item.nome.includes('Budweizer') || item.nome.includes('Heineken')) {
      categoria = 'Cervejas';
    } else if (item.nome.includes('Refri') || item.nome.includes('H2O') || item.nome.includes('Água') ||
               item.nome.includes('Red Bull') || item.nome.includes('Bally') || item.nome.includes('Suco') ||
               item.nome.includes('Caldo de Cana')) {
      categoria = 'Bebidas';
    } else if (item.nome.includes('Caipirinha') || item.nome.includes('Nevada') || item.nome.includes('Piña Colada')) {
      categoria = 'Caipirinhas';
    } else if (item.nome.includes('Partido') || item.nome.includes('Gostinho') || item.nome.includes('+ Carne') ||
               item.nome.includes('+ Frango') || item.nome.includes('Grãos') || item.nome.includes('Salada') ||
               item.nome.includes('Queijo') && !item.nome.includes('Quatro') || item.nome.includes('Ovo') && !item.nome.includes('Codorna')) {
      categoria = 'Adicionais';
    }
    
    if (!categorias[categoria]) categorias[categoria] = [];
    categorias[categoria].push(item);
  });
  
  // Adiciona itens por categoria
  Object.keys(categorias).forEach(categoria => {
    if (categorias[categoria].length > 0) {
      mensagem += `*${categoria.toUpperCase()}:*\n`;
      categorias[categoria].forEach(item => {
        mensagem += `${numeroItem}. ${item.nome}\n`;
        mensagem += `   Qtd: ${item.quantidade} | Valor: R$ ${item.subtotal.toFixed(2)}\n\n`;
        totalGeral += item.subtotal;
        numeroItem++;
      });
    }
  });
  
  mensagem += '━━━━━━━━━━━━━━━━━━━━━━━━\n';
  mensagem += `💰 *TOTAL DO PEDIDO: R$ ${totalGeral.toFixed(2)}*\n\n`;
  mensagem += '📱 _Pedido enviado pelo site_\n';
  mensagem += '🕐 _Aguardando confirmação..._';
  
  return mensagem;
}

// Função para enviar pedido pelo WhatsApp
function enviarPedido() {
  const mensagem = gerarMensagemPedido();
  
  if (mensagem) {
    const numeroWhatsApp = '5548996430781';
    const mensagemCodificada = encodeURIComponent(mensagem);
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
    
    window.open(urlWhatsApp, '_blank');
  }
}

// Event listeners para todos os inputs
function adicionarEventListeners() {
  const inputs = document.querySelectorAll('input[type="number"]');
  
  inputs.forEach(input => {
    input.addEventListener('change', function() {
      const nome = this.getAttribute('data-name');
      const preco = parseFloat(this.getAttribute('data-price'));
      const quantidade = parseInt(this.value) || 0;
      
      if (nome && !isNaN(preco)) {
        gerenciarItem(nome, preco, quantidade);
        
        // Valida bordas se for uma pizza
        validarBordaPizza(this);
      }
    });
    
    // Event listener para input em tempo real (não só no change)
    input.addEventListener('input', function() {
      const nome = this.getAttribute('data-name');
      const preco = parseFloat(this.getAttribute('data-price'));
      const quantidade = parseInt(this.value) || 0;
      
      if (nome && !isNaN(preco)) {
        gerenciarItem(nome, preco, quantidade);
      }
    });
  });
}

// Função para validar bordas ao escolher pizzas
function validarBordas() {
  const pizzaInputs = document.querySelectorAll('input[data-name*="Pizza"], input[data-name$=" P"], input[data-name$=" M"], input[data-name$=" G"]');
  const bordaInputs = document.querySelectorAll('input[data-name*="Borda"]');
  
  pizzaInputs.forEach(pizzaInput => {
    pizzaInput.addEventListener('change', function() {
      const nomePizza = this.getAttribute('data-name');
      const quantidade = parseInt(this.value) || 0;
      
      // Detecta o tamanho da pizza
      let tamanho = '';
      if (nomePizza.endsWith(' P')) tamanho = 'P';
      else if (nomePizza.endsWith(' M')) tamanho = 'M';
      else if (nomePizza.endsWith(' G')) tamanho = 'G';
      
      if (tamanho) {
        // Se a quantidade da pizza for 0, remove a borda correspondente
        if (quantidade === 0) {
          const bordaCorrespondente = document.querySelector(`input[data-name="Borda ${tamanho}"]`);
          if (bordaCorrespondente && bordaCorrespondente.value > 0) {
            bordaCorrespondente.value = 0;
            const precoBorda = parseFloat(bordaCorrespondente.getAttribute('data-price'));
            gerenciarItem(`Borda ${tamanho}`, precoBorda, 0);
          }
        }
      }
    });
  });
  
  // Valida se pode adicionar borda
  bordaInputs.forEach(bordaInput => {
    bordaInput.addEventListener('change', function() {
      const nomeBorda = this.getAttribute('data-name');
      const quantidade = parseInt(this.value) || 0;
      
      if (quantidade > 0) {
        let tamanho = '';
        if (nomeBorda.includes('Borda P')) tamanho = 'P';
        else if (nomeBorda.includes('Borda M')) tamanho = 'M';
        else if (nomeBorda.includes('Borda G')) tamanho = 'G';
        
        // Verifica se tem pizza do mesmo tamanho
        let temPizzaDoTamanho = false;
        const pizzasDoTamanho = document.querySelectorAll(`input[data-name$=" ${tamanho}"]`);
        
        pizzasDoTamanho.forEach(pizzaInput => {
          if (parseInt(pizzaInput.value) > 0 && !pizzaInput.getAttribute('data-name').includes('Borda')) {
            temPizzaDoTamanho = true;
          }
        });
        
        if (!temPizzaDoTamanho) {
          alert(`Para adicionar borda ${tamanho}, você precisa ter pelo menos uma pizza tamanho ${tamanho} no seu pedido.`);
          this.value = 0;
          const precoBorda = parseFloat(this.getAttribute('data-price'));
          gerenciarItem(nomeBorda, precoBorda, 0);
        }
      }
    });
  });
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
  // Oculta todas as categorias ao carregar
  const allSections = document.querySelectorAll('.categoria');
  allSections.forEach(section => {
    section.style.display = 'none';
  });
  
  // Esconde o carrinho inicialmente
  const carrinhoFlutuante = document.getElementById('carrinho-flutuante');
  if (carrinhoFlutuante) {
    carrinhoFlutuante.style.display = 'none';
  }
  
  // Adiciona event listeners
  adicionarEventListeners();
  validarBordas();
  
  // Atualiza o carrinho na inicialização
  atualizarCarrinho();
  
  console.log('Sistema de pedidos inicializado com sucesso!');
});