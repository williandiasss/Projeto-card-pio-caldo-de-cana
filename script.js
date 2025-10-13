// Sistema de carrinho universal - VERSÃO CORRIGIDA
let carrinho = [];
let totalCarrinho = 0;

// Estado centralizado do pedido
let estadoPedido = {
  ativo: false,
  categoria: null,
  produto: null,
  etapa: 0, // 0: produto, 1: adicionais/borda, 2: sabor borda
  dadosTemporarios: {}
};

// ========== FUNÇÕES PRINCIPAIS ==========

function openCategory(categoryName) {
  if (estadoPedido.ativo) {
    mostrarMensagemInline('Finalize o pedido atual antes de mudar de categoria');
    return;
  }

  const allSections = document.querySelectorAll('.categoria');
  allSections.forEach(section => section.style.display = 'none');

  const targetSection = document.querySelector(`.categoria.${categoryName}`);
  if (targetSection) targetSection.style.display = 'block';
}

// ========== PAINEL LATERAL DO CARRINHO ==========

function abrirCarrinho() {
  const carrinhoPanel = document.getElementById('carrinho-painel');
  const overlay = document.getElementById('overlay');
  
  if (carrinhoPanel) carrinhoPanel.classList.add('ativo');
  if (overlay) overlay.classList.add('ativo');
  
  document.body.style.overflow = 'hidden';
  atualizarListaCarrinhoPanel();
}

function fecharCarrinho() {
  const carrinhoPanel = document.getElementById('carrinho-painel');
  const overlay = document.getElementById('overlay');
  
  if (carrinhoPanel) carrinhoPanel.classList.remove('ativo');
  if (overlay) overlay.classList.remove('ativo');
  
  document.body.style.overflow = 'auto';
}

function atualizarListaCarrinhoPanel() {
  const listaCarrinho = document.getElementById('lista-carrinho');
  const totalSidebar = document.getElementById('total-sidebar');
  
  if (!listaCarrinho) return;
  
  listaCarrinho.innerHTML = '';
  
  if (carrinho.length === 0) {
    listaCarrinho.innerHTML = `
      <div class="carrinho-vazio">
        <div class="carrinho-vazio-icone">🛒</div>
        <p>Seu carrinho está vazio</p>
        <small>Adicione produtos para continuar</small>
      </div>
    `;
  } else {
    carrinho.forEach((item, index) => {
      const itemElement = document.createElement('li');
      itemElement.className = 'item-carrinho';
      
      let nomeExibicao = item.nome;
      
      // Formatação do nome para exibição
      if (isPizza(item.nome) && !nomeExibicao.toLowerCase().includes('pizza')) {
        nomeExibicao = `Pizza ${nomeExibicao}`;
      }
      
      itemElement.innerHTML = `
        <div class="item-info">
          <div class="item-detalhes">
            <div class="item-nome">${nomeExibicao}</div>
            <div class="item-preco">R$ ${item.subtotal.toFixed(2).replace('.', ',')}</div>
          </div>
          <div class="item-quantidade">
            <button class="btn-quantidade" onclick="alterarQuantidadeCarrinho(${index}, -1)">−</button>
            <span class="quantidade-numero">${item.quantidade}</span>
            <button class="btn-quantidade" onclick="alterarQuantidadeCarrinho(${index}, 1)">+</button>
          </div>
        </div>
      `;
      
      listaCarrinho.appendChild(itemElement);
    });
  }
  
  if (totalSidebar) {
    const valorTotal = carrinho.reduce((total, item) => total + item.subtotal, 0);
    totalSidebar.textContent = valorTotal.toFixed(2).replace('.', ',');
  }
}

function alterarQuantidadeCarrinho(index, mudanca) {
  if (carrinho[index]) {
    const novaQuantidade = carrinho[index].quantidade + mudanca;
    
    if (novaQuantidade <= 0) {
      carrinho.splice(index, 1);
    } else {
      carrinho[index].quantidade = novaQuantidade;
      carrinho[index].subtotal = carrinho[index].preco * novaQuantidade;
    }
    
    atualizarCarrinho();
    atualizarListaCarrinhoPanel();
  }
}

// ========== FUNÇÕES AUXILIARES ==========

function isPizza(nome) {
  const pizzasTracionais = [
    'Quatro Queijos', 'Bacon', 'Calabresa', 'Brócolis', 'Frango com Catupiry',
    'Mista', 'Pasqualina', 'Portuguesa', 'Marguerita', 'Lombo Defumado',
    'Alho e Óleo', 'Tomate Seco', 'Peperoni', 'Baiana', 'Agridoce'
  ];
  
  const pizzasEspeciais = [
    'Frango Especial', 'Brócolis Especial', 'Calabresa Especial', 'Palmito',
    'Strogonoff de Carne', 'Americana', 'Alcatra com Doritos', 'Coração Acebolado',
    'Camarão ao Molho', 'Camarão Especial'
  ];
  
  const pizzasDoces = [
    'Chocolate Preto com Morango', 'Chocolate Branco com Morango', 'Charge', 'Confete', 
    'Brigadeiro Especial', 'Prestígio', 'Paçoquita', 'Banana com Chocolate', 
    'Banana com Canela', 'Abacaxi', 'Banana Nevada'
  ];
  
  const todasPizzas = [...pizzasTracionais, ...pizzasEspeciais, ...pizzasDoces];
  
  return nome.toLowerCase().startsWith('pizza') || 
         todasPizzas.some(pizza => nome.trim() === pizza.trim());
}

function getTamanhoPizza(nome) {
  if (nome.includes(' P')) return 'P';
  if (nome.includes(' M')) return 'M';
  if (nome.includes(' G')) return 'G';
  return null;
}

function obterPrecoBorda(tamanho) {
  const precosBorda = { 'P': 8, 'M': 10, 'G': 12 };
  return precosBorda[tamanho] || 0;
}

// ========== SISTEMA CENTRALIZADO DE CONTROLE ==========

function iniciarPedido(input, categoria) {
  if (estadoPedido.ativo && estadoPedido.produto !== input.getAttribute('data-name')) {
    input.value = 0;
    mostrarMensagemInline('Finalize o pedido atual antes de iniciar outro');
    return false;
  }

  estadoPedido.ativo = true;
  estadoPedido.categoria = categoria;
  estadoPedido.produto = input.getAttribute('data-name');
  estadoPedido.etapa = 1;
  estadoPedido.dadosTemporarios = {};

  desabilitarOutrosInputs(categoria, input);
  desabilitarOutrasCategorias(categoria);
  
  return true;
}

function desabilitarOutrosInputs(categoria, inputAtivo) {
  const secaoElement = document.querySelector(`.categoria.${categoria}`);
  if (!secaoElement) return;

  const todosInputs = secaoElement.querySelectorAll('input[type="number"]:not([data-name*="Borda"])');
  todosInputs.forEach(input => {
    if (input !== inputAtivo) {
      input.disabled = true;
      input.value = 0;
    }
  });
}

function desabilitarOutrasCategorias(categoriaAtiva) {
  const botoesCategoria = document.querySelectorAll('button[onclick*="openCategory"]');
  botoesCategoria.forEach(botao => {
    const categoria = botao.onclick?.toString().match(/openCategory\('([^']+)'\)/)?.[1];
    if (categoria && categoria !== categoriaAtiva) {
      botao.disabled = true;
    }
  });
}

function resetarEstadoPedido() {
  estadoPedido.ativo = false;
  estadoPedido.categoria = null;
  estadoPedido.produto = null;
  estadoPedido.etapa = 0;
  estadoPedido.dadosTemporarios = {};

  // Reabilitar todos os inputs e botões
  const todosElementos = document.querySelectorAll('input[disabled], button[disabled]');
  todosElementos.forEach(elemento => {
    elemento.disabled = false;
  });

  // Zerar todos os inputs
  const inputsNumeros = document.querySelectorAll('input[type="number"]');
  inputsNumeros.forEach(input => {
    if (!input.closest('#carrinho-painel')) {
      input.value = 0;
    }
  });

  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    if (!checkbox.closest('#carrinho-painel')) {
      checkbox.checked = false;
    }
  });

  // Resetar sistema de adicionais para lanches
  resetarAdicionaisLanche();
  
  // Resetar sistema de bordas para pizzas
  resetarSistemaBordas();
}

// ========== SISTEMA PARA LANCHES ==========

function processarLanche(input) {
  const quantidade = parseInt(input.value) || 0;
  const categoria = 'lanches';
  
  if (quantidade > 0) {
    if (!iniciarPedido(input, categoria)) return;
    
    // Habilitar adicionais sequencialmente
    habilitarAdicionaisLanche(categoria);
    mostrarBotaoAdicionar(categoria);
  } else if (estadoPedido.ativo && estadoPedido.produto === input.getAttribute('data-name')) {
    resetarEstadoPedido();
    esconderBotaoAdicionar(categoria);
  }
}

function habilitarAdicionaisLanche(categoria) {
  const secaoElement = document.querySelector(`.categoria.${categoria}`);
  if (!secaoElement) return;

  const adicionais = secaoElement.querySelectorAll('input[type="checkbox"], input[data-adicional]');
  adicionais.forEach(adicional => {
    adicional.disabled = false;
  });
}

function resetarAdicionaisLanche() {
  const secaoElement = document.querySelector('.categoria.lanches');
  if (!secaoElement) return;

  const adicionais = secaoElement.querySelectorAll('input[type="checkbox"], input[data-adicional]');
  adicionais.forEach(adicional => {
    adicional.disabled = true;
    adicional.checked = false;
  });
}

// ========== SISTEMA PARA PIZZAS ==========

function processarPizza(input, categoria) {
  const quantidade = parseInt(input.value) || 0;
  
  if (quantidade > 0) {
    if (!iniciarPedido(input, categoria)) return;
    
    // Limitar quantidade a 1
    if (quantidade > 1) input.value = 1;
    
    // Habilitar sistema de borda
    habilitarCheckboxQuerBorda(categoria);
    mostrarBotaoAdicionar(categoria);
  } else if (estadoPedido.ativo && estadoPedido.produto === input.getAttribute('data-name')) {
    resetarEstadoPedido();
    esconderBotaoAdicionar(categoria);
  }
}

function habilitarCheckboxQuerBorda(categoria) {
  const secaoElement = document.querySelector(`.categoria.${categoria}`);
  if (!secaoElement) return;

  const checkboxQuerBorda = secaoElement.querySelector('#quer-borda');
  if (checkboxQuerBorda) {
    checkboxQuerBorda.disabled = false;
    
    // Remover listeners anteriores e adicionar novo
    const novoCheckbox = checkboxQuerBorda.cloneNode(true);
    checkboxQuerBorda.parentNode.replaceChild(novoCheckbox, checkboxQuerBorda);
    
    novoCheckbox.addEventListener('change', function() {
      if (this.checked) {
        habilitarTamanhosBorda(categoria);
      } else {
        resetarSistemaBordas(categoria);
      }
    });
  }
}

function habilitarTamanhosBorda(categoria) {
  const secaoElement = document.querySelector(`.categoria.${categoria}`);
  if (!secaoElement) return;

  const tamanhoPizza = getTamanhoPizzaSelecionada(categoria);
  if (!tamanhoPizza) return;

  const inputsBorda = secaoElement.querySelectorAll('input[data-name*="Borda"]');
  inputsBorda.forEach(input => {
    const nomeBorda = input.getAttribute('data-name');
    if (nomeBorda.includes(`Borda ${tamanhoPizza}`)) {
      input.disabled = false;
      input.style.opacity = '1';
      
      // Remover listeners anteriores
      const novoInput = input.cloneNode(true);
      input.parentNode.replaceChild(novoInput, input);
      
      novoInput.addEventListener('input', function() {
        const valor = parseInt(this.value) || 0;
        if (valor > 0) {
          if (valor > 1) this.value = 1;
          
          // Desabilitar outros tamanhos de borda
          inputsBorda.forEach(outro => {
            if (outro !== this && outro.getAttribute('data-name').includes('Borda')) {
              outro.value = 0;
              outro.disabled = true;
            }
          });
          
          habilitarSaboresBorda(categoria);
        } else {
          desabilitarSaboresBorda(categoria);
        }
      });
    } else {
      input.disabled = true;
      input.style.opacity = '0.5';
      input.value = 0;
    }
  });
}

function habilitarSaboresBorda(categoria) {
  const secaoElement = document.querySelector(`.categoria.${categoria}`);
  if (!secaoElement) return;

  const sabores = secaoElement.querySelectorAll('.sabor-borda input[type="checkbox"]');
  sabores.forEach(sabor => {
    sabor.disabled = false;
    sabor.style.opacity = '1';
    
    // Remover listeners anteriores
    const novoSabor = sabor.cloneNode(true);
    sabor.parentNode.replaceChild(novoSabor, sabor);
    
    novoSabor.addEventListener('change', function() {
      if (this.checked) {
        sabores.forEach(outro => {
          if (outro !== this) outro.checked = false;
        });
      }
    });
  });
}

function desabilitarSaboresBorda(categoria) {
  const secaoElement = document.querySelector(`.categoria.${categoria}`);
  if (!secaoElement) return;

  const sabores = secaoElement.querySelectorAll('.sabor-borda input[type="checkbox"]');
  sabores.forEach(sabor => {
    sabor.disabled = true;
    sabor.style.opacity = '0.5';
    sabor.checked = false;
  });
}

function resetarSistemaBordas(categoria = null) {
  const secoes = categoria ? [categoria] : ['pizzas-trad', 'pizzas-especiais', 'pizzas-doces'];
  
  secoes.forEach(secao => {
    const secaoElement = document.querySelector(`.categoria.${secao}`);
    if (!secaoElement) return;

    // Resetar checkbox quer borda
    const checkboxQuerBorda = secaoElement.querySelector('#quer-borda');
    if (checkboxQuerBorda) {
      checkboxQuerBorda.disabled = true;
      checkboxQuerBorda.checked = false;
    }

    // Resetar inputs de borda
    const inputsBorda = secaoElement.querySelectorAll('input[data-name*="Borda"]');
    inputsBorda.forEach(input => {
      input.disabled = true;
      input.style.opacity = '0.5';
      input.value = 0;
    });

    // Resetar sabores
    desabilitarSaboresBorda(secao);
  });
}

function getTamanhoPizzaSelecionada(categoria) {
  const secaoElement = document.querySelector(`.categoria.${categoria}`);
  if (!secaoElement) return null;
  
  const inputs = secaoElement.querySelectorAll('input[type="number"]:not([data-name*="Borda"])');
  
  for (let input of inputs) {
    const quantidade = parseInt(input.value) || 0;
    if (quantidade > 0) {
      return getTamanhoPizza(input.getAttribute('data-name'));
    }
  }
  
  return null;
}

// ========== SISTEMA DE ADICIONAR AO CARRINHO ==========

function criarBotaoAdicionarUniversal(categoria) {
  const secaoElement = document.querySelector(`.categoria.${categoria}`);
  if (!secaoElement) return;
  
  let botaoAdicionar = secaoElement.querySelector('.btn-adicionar-carrinho-universal');
  if (!botaoAdicionar) {
    botaoAdicionar = document.createElement('div');
    botaoAdicionar.className = 'btn-adicionar-carrinho-universal';
    botaoAdicionar.style.cssText = `
      background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
      color: white;
      border: none;
      padding: 15px 25px;
      border-radius: 25px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      margin: 20px 0;
      width: 100%;
      text-align: center;
      transition: all 0.3s ease;
      user-select: none;
      display: none;
    `;
    botaoAdicionar.textContent = '🛒 Adicionar ao Carrinho';
    
    botaoAdicionar.addEventListener('click', () => adicionarAoCarrinho(categoria));
    
    secaoElement.appendChild(botaoAdicionar);
  }
}

function mostrarBotaoAdicionar(categoria) {
  const botao = document.querySelector(`.categoria.${categoria} .btn-adicionar-carrinho-universal`);
  if (botao) botao.style.display = 'block';
}

function esconderBotaoAdicionar(categoria) {
  const botao = document.querySelector(`.categoria.${categoria} .btn-adicionar-carrinho-universal`);
  if (botao) botao.style.display = 'none';
}

function adicionarAoCarrinho(categoria) {
  const secaoElement = document.querySelector(`.categoria.${categoria}`);
  if (!secaoElement) return;

  if (categoria === 'lanches') {
    adicionarLancheAoCarrinho(secaoElement, categoria);
  } else if (['pizzas-trad', 'pizzas-especiais', 'pizzas-doces'].includes(categoria)) {
    adicionarPizzaAoCarrinho(secaoElement, categoria);
  } else {
    adicionarItemSimples(secaoElement, categoria);
  }
}

function adicionarLancheAoCarrinho(secaoElement, categoria) {
  const inputsProdutos = secaoElement.querySelectorAll('input[type="number"]:not([data-name*="Borda"])');
  let itensAdicionados = 0;
  
  inputsProdutos.forEach(input => {
    const quantidade = parseInt(input.value) || 0;
    if (quantidade > 0) {
      const nomeProduto = input.getAttribute('data-name');
      let precoProduto = parseFloat(input.getAttribute('data-price')) || 0;
      
      // Coletar adicionais selecionados
      const adicionaisSelecionados = Array.from(secaoElement.querySelectorAll('input[type="checkbox"]:checked'))
        .map(adicional => ({
          nome: adicional.getAttribute('data-name') || adicional.value || 'Adicional',
          preco: parseFloat(adicional.getAttribute('data-price')) || 0
        }));
              // Coletar ingredientes removidos
      const removerSelecionados = Array.from(secaoElement.querySelectorAll('.remover-ingredientes input[type="checkbox"]:checked'))
        .map(remover => remover.value);

      if (removerSelecionados.length > 0) {
        nomeFinal += ` (sem ${removerSelecionados.join(', ')})`;
      }
      
      const valorAdicionais = adicionaisSelecionados.reduce((total, adicional) => total + adicional.preco, 0);
      const nomesAdicionais = adicionaisSelecionados.map(adicional => adicional.nome);
      const precoFinal = precoProduto + valorAdicionais;
      
      let nomeFinal = nomeProduto;
      if (nomesAdicionais.length > 0) {
        nomeFinal += ` (+ ${nomesAdicionais.join(', ')})`;
      }
      
      // Adicionar ao carrinho
      for (let i = 0; i < quantidade; i++) {
        carrinho.push({
          id: Date.now() + Math.random(),
          nome: nomeFinal,
          preco: precoFinal,
          quantidade: 1,
          subtotal: precoFinal,
          categoria: categoria,
          adicionais: nomesAdicionais.length > 0 ? nomesAdicionais : null
        });
      }
      
      itensAdicionados += quantidade;
    }
  });
  
  if (itensAdicionados > 0) {
    resetarEstadoPedido();
    esconderBotaoAdicionar(categoria);
    atualizarCarrinho();
    mostrarMensagemInline(`${itensAdicionados} lanche(s) adicionado(s) ao carrinho!`);
  }
}

function adicionarPizzaAoCarrinho(secaoElement, categoria) {
  const inputsPizza = secaoElement.querySelectorAll('input[type="number"]:not([data-name*="Borda"])');
  let itensAdicionados = 0;
  
  inputsPizza.forEach(input => {
    const quantidade = parseInt(input.value) || 0;
    if (quantidade > 0) {
      const nomePizza = input.getAttribute('data-name');
      let precoPizza = parseFloat(input.getAttribute('data-price')) || 0;
      
      // Verificar borda
      let valorBorda = 0;
      let nomeBorda = null;
      
      const checkboxQuerBorda = secaoElement.querySelector('#quer-borda');
      if (checkboxQuerBorda && checkboxQuerBorda.checked) {
        const inputsBorda = secaoElement.querySelectorAll('input[data-name*="Borda"]');
        const bordaSelecionada = Array.from(inputsBorda).find(inp => parseInt(inp.value) > 0);
        
        if (bordaSelecionada) {
          const saboresSelecionados = secaoElement.querySelectorAll('.sabor-borda input[type="checkbox"]:checked');
          const saborSelecionado = Array.from(saboresSelecionados).find(cb => cb.checked);
          
          if (saborSelecionado) {
            const tamanhoPizza = getTamanhoPizza(nomePizza);
            valorBorda = obterPrecoBorda(tamanhoPizza);
            nomeBorda = saborSelecionado.value;
          }
        }
      }
      
      const precoFinal = precoPizza + valorBorda;
      let nomeFinal = nomePizza;
      
      if (nomeBorda) {
        nomeFinal += ` (+ Borda ${nomeBorda})`;
      }
      
      // Adicionar ao carrinho
      for (let i = 0; i < quantidade; i++) {
        carrinho.push({
          id: Date.now() + Math.random(),
          nome: nomeFinal,
          preco: precoFinal,
          quantidade: 1,
          subtotal: precoFinal,
          categoria: categoria,
          borda: nomeBorda
        });
      }
      
      itensAdicionados += quantidade;
    }
  });
  
  if (itensAdicionados > 0) {
    resetarEstadoPedido();
    esconderBotaoAdicionar(categoria);
    atualizarCarrinho();
    mostrarMensagemInline(`${itensAdicionados} pizza(s) adicionada(s) ao carrinho!`);
  }
}

function adicionarItemSimples(secaoElement, categoria) {
  const inputs = secaoElement.querySelectorAll('input[type="number"]');
  let itensAdicionados = 0;
  
  inputs.forEach(input => {
    const quantidade = parseInt(input.value) || 0;
    if (quantidade > 0) {
      const nome = input.getAttribute('data-name');
      const preco = parseFloat(input.getAttribute('data-price'));
      
      if (nome && !isNaN(preco)) {
        for (let i = 0; i < quantidade; i++) {
          carrinho.push({
            id: Date.now() + Math.random(),
            nome: nome,
            preco: preco,
            quantidade: 1,
            subtotal: preco,
            categoria: categoria
          });
        }
        
        itensAdicionados += quantidade;
        input.value = 0;
      }
    }
  });
  
  if (itensAdicionados > 0) {
    esconderBotaoAdicionar(categoria);
    atualizarCarrinho();
    mostrarMensagemInline(`${itensAdicionados} item(ns) adicionado(s) ao carrinho!`);
  }
}

// ========== INICIALIZAÇÃO E EVENT LISTENERS ==========

function inicializarSistema() {
  const categorias = [
    'lanches', 'hamburguer', 'tabuas', 'torre-batata', 'porções',
    'pizzas-trad', 'pizzas-especiais', 'pizzas-doces', 
    'cervejas', 'bebidas', 'caipirinhas', 'acai'
  ];
  
  categorias.forEach(categoria => {
    criarBotaoAdicionarUniversal(categoria);
    
    const secaoElement = document.querySelector(`.categoria.${categoria}`);
    if (!secaoElement) return;
    
    const inputs = secaoElement.querySelectorAll('input[type="number"]:not([data-name*="Borda"])');
    
    inputs.forEach(input => {
      // Remover listeners anteriores
      const novoInput = input.cloneNode(true);
      input.parentNode.replaceChild(novoInput, input);
      
      novoInput.addEventListener('input', function() {
        if (categoria === 'lanches') {
          processarLanche(this);
        } else if (['pizzas-trad', 'pizzas-especiais', 'pizzas-doces'].includes(categoria)) {
          processarPizza(this, categoria);
        } else {
          processarItemSimples(this, categoria);
        }
      });
    });
  });
  
  // Estado inicial
  resetarAdicionaisLanche();
  resetarSistemaBordas();
}

function processarItemSimples(input, categoria) {
  const quantidade = parseInt(input.value) || 0;
  
  if (quantidade > 0) {
    mostrarBotaoAdicionar(categoria);
  } else {
    esconderBotaoAdicionar(categoria);
  }
}

function mostrarMensagemInline(mensagem) {
  const mensagemExistente = document.querySelector('.mensagem-inline');
  if (mensagemExistente) mensagemExistente.remove();

  const divMensagem = document.createElement('div');
  divMensagem.className = 'mensagem-inline';
  divMensagem.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #25D366;
    color: white;
    padding: 12px 24px;
    border-radius: 25px;
    font-weight: 600;
    z-index: 9999;
    box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
  `;
  divMensagem.textContent = mensagem;

  document.body.appendChild(divMensagem);

  setTimeout(() => {
    if (divMensagem && divMensagem.parentNode) {
      divMensagem.remove();
    }
  }, 3000);
}

function atualizarCarrinho() {
  const itensCount = document.getElementById('itens-count');
  const totalCount = document.getElementById('total-count');
  
  const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
  const valorTotal = carrinho.reduce((total, item) => total + item.subtotal, 0);
  
  if (itensCount) itensCount.textContent = totalItens;
  if (totalCount) totalCount.textContent = valorTotal.toFixed(2).replace('.', ',');
  
  const carrinhoFlutuante = document.getElementById('carrinho-flutuante');
  if (carrinhoFlutuante) {
    carrinhoFlutuante.style.display = totalItens > 0 ? 'block' : 'none';
  }
  
  totalCarrinho = valorTotal;
}

function gerarMensagemPedido() {
  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio! Adicione alguns itens antes de finalizar o pedido.');

      const entregaSelecionada = document.querySelector('input[name="entrega"]:checked');
  if (entregaSelecionada) {
    mensagem += `🚚 *Tipo de Pedido:* ${entregaSelecionada.value}\n\n`;
  }
    return '';
  }
  
  let mensagem = '*🍽️ NOVO PEDIDO - CARDOSO CALDO DE CANA*\n\n';
  mensagem += '🍽 *ITENS DO PEDIDO:*\n\n';
  
  let totalGeral = 0;
  let numeroItem = 1;
  
  carrinho.forEach(item => {
    let nomeItem = item.nome;
    
    if (isPizza(item.nome) && !nomeItem.toLowerCase().includes('pizza')) {
      nomeItem = `Pizza ${nomeItem}`;
    }
    
    mensagem += `${numeroItem}. ${nomeItem}\n`;
    mensagem += `   Qtd: ${item.quantidade} | Valor: R$ ${item.subtotal.toFixed(2)}\n`;
    
    if (item.borda) {
      mensagem += `  🍕  Borda: ${item.borda}\n`;
    }
    
    if (item.adicionais && item.adicionais.length > 0) {
      mensagem += `   ➕ Adicionais: ${item.adicionais.join(', ')}\n`;
    }
    
    mensagem += '\n';
    totalGeral += item.subtotal;
    numeroItem++;
  });
  
  mensagem += '━━━━━━━━━━━━━━━━━━━━━━━━\n';
  mensagem += `💰 *TOTAL DO PEDIDO: R$ ${totalGeral.toFixed(2)}*\n\n`;
  mensagem += '🌐 _Pedido enviado pelo site_\n';
  mensagem += '⏳ _Aguardando confirmação..._';
  
  return mensagem;
}

function enviarPedido() {
  const mensagem = gerarMensagemPedido();
  
  if (mensagem) {
    const numeroWhatsApp = '5548996430781';
    const mensagemCodificada = encodeURIComponent(mensagem);
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
    
    window.open(urlWhatsApp, '_blank');
  }
}

// ========== INICIALIZAÇÃO PRINCIPAL ==========

document.addEventListener('DOMContentLoaded', () => {
  // Ocultar todas as seções inicialmente
  const allSections = document.querySelectorAll('.categoria');
  allSections.forEach(section => {
    section.style.display = 'none';
  });
  
  // Ocultar carrinho flutuante inicialmente
  const carrinhoFlutuante = document.getElementById('carrinho-flutuante');
  if (carrinhoFlutuante) {
    carrinhoFlutuante.style.display = 'none';
  }
  
  // Adicionar estilos CSS para animações
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }
    
    .btn-adicionar-carrinho-universal:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(37, 211, 102, 0.3);
    }
    
    input[disabled] {
      opacity: 0.5 !important;
      cursor: not-allowed !important;
    }
    
    .sabor-borda input[disabled] + label {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;
  document.head.appendChild(style);
  
  // Inicializar o sistema
  inicializarSistema();
  
  // Listener para tecla ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      fecharCarrinho();
      if (estadoPedido.ativo) {
        resetarEstadoPedido();
        mostrarMensagemInline('Pedido cancelado');
      }
    }
  });
  
  // Atualizar carrinho inicial
  atualizarCarrinho();
});