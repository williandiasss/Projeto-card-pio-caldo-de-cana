// ========================================
// CARDÁPIO DIGITAL - CARDOSO CALDO DE CANA
// Sistema completo de gerenciamento de pedidos
// ========================================

// ========== VARIÁVEIS GLOBAIS ==========
let carrinho = [];
let totalCarrinho = 0;

// Estado centralizado do pedido atual
let estadoPedido = {
  ativo: false,
  categoria: null,
  produto: null,
  dadosTemporarios: {}
};

// ========== FUNÇÕES DE NAVEGAÇÃO ==========

function openCategory(categoryName) {
  if (estadoPedido.ativo) {
    mostrarMensagemInline('Finalize o pedido atual antes de mudar de categoria');
    return;
  }

  const allSections = document.querySelectorAll('.categoria');
  allSections.forEach(section => {
    section.style.display = 'none';
  });

  const targetSection = document.querySelector(`.categoria.${categoryName}`);
  if (targetSection) {
    targetSection.style.display = 'block';
  }
}

// ========== SISTEMA DE CARRINHO FLUTUANTE ==========

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
      
      if (isPizza(item.nome) && !nomeExibicao.toLowerCase().includes('pizza')) {
        nomeExibicao = `Pizza ${nomeExibicao}`;
      }
      
      let detalhesHTML = '';
      if (item.meio) detalhesHTML += `<div class="item-meio" style="font-size: 0.9em; color: #666; margin-top: 2px;">Meio: ${item.meio}</div>`;
      if (item.borda) detalhesHTML += `<div class="item-borda" style="font-size: 0.9em; color: #666; margin-top: 2px;">Borda: ${item.borda}</div>`;
      if (item.removerIngredientes) detalhesHTML += `<div class="item-remover" style="font-size: 0.9em; color: #666; margin-top: 2px;">Sem: ${item.removerIngredientes}</div>`;
      if (item.adicionais) detalhesHTML += `<div class="item-adicionais" style="font-size: 0.9em; color: #666; margin-top: 2px;">+ ${item.adicionais}</div>`;
      if (item.acompanhamentos) detalhesHTML += `<div class="item-acompanhamentos" style="font-size: 0.9em; color: #666; margin-top: 2px;">Acompanhamentos: ${item.acompanhamentos}</div>`;
      if (item.observacoes) detalhesHTML += `<div class="item-obs" style="font-size: 0.9em; color: #666; margin-top: 2px;">Obs: ${item.observacoes}</div>`;
      
      itemElement.innerHTML = `
        <div class="item-info">
          <div class="item-detalhes">
            <div class="item-nome">${nomeExibicao}</div>
            ${detalhesHTML}
            <div class="item-preco">R$ ${item.subtotal.toFixed(2).replace('.', ',')}</div>
          </div>
        </div>
        <div class="item-quantidade">
          <button class="btn-quantidade" onclick="alterarQuantidadeCarrinho(${index}, -1)">−</button>
          <span class="quantidade-numero">${item.quantidade}</span>
          <button class="btn-quantidade" onclick="alterarQuantidadeCarrinho(${index}, 1)">+</button>
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
    animation: slideDown 0.3s ease;
  `;
  divMensagem.textContent = mensagem;

  document.body.appendChild(divMensagem);

  setTimeout(() => {
    if (divMensagem && divMensagem.parentNode) {
      divMensagem.remove();
    }
  }, 3000);
}

// ========== CONTROLE DE ESTADO DO PEDIDO ==========

function iniciarPedido(input, categoria) {
  if (estadoPedido.ativo && estadoPedido.produto !== input.getAttribute('data-name')) {
    input.value = 0;
    mostrarMensagemInline('Finalize o pedido atual antes de iniciar outro');
    return false;
  }

  estadoPedido.ativo = true;
  estadoPedido.categoria = categoria;
  estadoPedido.produto = input.getAttribute('data-name');
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
      botao.style.opacity = '0.5';
    }
  });
}

function resetarEstadoPedido() {
  estadoPedido.ativo = false;
  estadoPedido.categoria = null;
  estadoPedido.produto = null;
  estadoPedido.dadosTemporarios = {};

  const todosElementos = document.querySelectorAll('input[disabled], button[disabled]');
  todosElementos.forEach(elemento => {
    elemento.disabled = false;
    elemento.style.opacity = '1';
  });

  const inputsNumeros = document.querySelectorAll('input[type="number"]');
  inputsNumeros.forEach(input => {
    if (!input.closest('#carrinho-painel')) {
      input.value = 0;
    }
  });

  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    if (!checkbox.closest('#carrinho-painel') && !checkbox.closest('#tipo-entrega')) {
      checkbox.checked = false;
    }
  });

  resetarAdicionaisLanche();
  resetarSistemaBordas();
  resetarAcai();
  resetarHamburguer();
}

// ========== SISTEMA PARA LANCHES ==========

function processarLanche(input) {
  const quantidade = parseInt(input.value) || 0;
  const categoria = 'lanches';
  
  if (quantidade > 0) {
    if (!iniciarPedido(input, categoria)) return;
    
    habilitarRemoverIngredientesLanche(input);
    habilitarAdicionaisLanche(categoria);
    mostrarBotaoAdicionar(categoria);
  } else if (estadoPedido.ativo && estadoPedido.produto === input.getAttribute('data-name')) {
    resetarEstadoPedido();
    esconderBotaoAdicionar(categoria);
  }
}

function habilitarRemoverIngredientesLanche(input) {
  const li = input.closest('li');
  if (!li) return;
  
  const divRemover = li.querySelector('.remover-ingredientes');
  if (divRemover) {
    const checkboxes = divRemover.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.disabled = false);
  }
}

function habilitarAdicionaisLanche(categoria) {
  const secaoElement = document.querySelector(`.categoria.${categoria}`);
  if (!secaoElement) return;

  const h3Adicionais = Array.from(secaoElement.querySelectorAll('h3')).find(h3 => h3.textContent.trim() === 'Adicionais');
  if (!h3Adicionais) return;
  
  let elemento = h3Adicionais.nextElementSibling;
  while (elemento && elemento.tagName === 'LI') {
    const checkbox = elemento.querySelector('input[type="checkbox"]');
    if (checkbox) checkbox.disabled = false;
    elemento = elemento.nextElementSibling;
  }
}

function resetarAdicionaisLanche() {
  const secaoElement = document.querySelector('.categoria.lanches');
  if (!secaoElement) return;

  const checkboxes = secaoElement.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.disabled = true;
    checkbox.checked = false;
  });
}

// ========== SISTEMA PARA HAMBÚRGUER ==========

function processarHamburguer(input) {
  const quantidade = parseInt(input.value) || 0;
  const categoria = 'hamburguer';
  
  if (quantidade > 0) {
    if (!iniciarPedido(input, categoria)) return;
    
    habilitarRemoverIngredientesHamburguer(input);
    mostrarBotaoAdicionar(categoria);
  } else if (estadoPedido.ativo && estadoPedido.produto === input.getAttribute('data-name')) {
    resetarEstadoPedido();
    esconderBotaoAdicionar(categoria);
  }
}

function habilitarRemoverIngredientesHamburguer(input) {
  const li = input.closest('li');
  if (!li) return;
  
  const divRemover = li.querySelector('.remover-ingredientes');
  if (divRemover) {
    const checkboxes = divRemover.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
      cb.disabled = false;
      cb.style.pointerEvents = 'auto';
      cb.style.opacity = '1';
    });
  }
}

function resetarHamburguer() {
  const secaoElement = document.querySelector('.categoria.hamburguer');
  if (!secaoElement) return;

  const checkboxes = secaoElement.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.disabled = true;
    checkbox.checked = false;
    checkbox.style.pointerEvents = 'none';
  });
}

// ========== SISTEMA PARA TÁBUAS - CORRIGIDO ==========

function processarTabuas(input) {
  const quantidade = parseInt(input.value) || 0;
  const categoria = 'tabuas';
  
  if (quantidade > 0) {
    if (!estadoPedido.ativo) {
      estadoPedido.ativo = true;
      estadoPedido.categoria = categoria;
      estadoPedido.produto = input.getAttribute('data-name');
      desabilitarOutrasCategorias(categoria);
      
      const secaoElement = document.querySelector(`.categoria.${categoria}`);
      if (secaoElement) {
        const todosInputs = secaoElement.querySelectorAll('input[type="number"]');
        todosInputs.forEach(inp => {
          if (inp !== input) {
            inp.disabled = true;
            inp.value = 0;
          }
        });
      }
    } else if (estadoPedido.produto !== input.getAttribute('data-name')) {
      input.value = 0;
      mostrarMensagemInline('Finalize o pedido atual antes de iniciar outro');
      return;
    }
    
    mostrarBotaoAdicionar(categoria);
  } else if (estadoPedido.ativo && estadoPedido.produto === input.getAttribute('data-name')) {
    resetarCategoriaSimples(categoria);
    esconderBotaoAdicionar(categoria);
  }
}

// ========== SISTEMA PARA TORRE DE BATATA - CORRIGIDO ==========

function processarTorreBatata(input) {
  const quantidade = parseInt(input.value) || 0;
  const categoria = 'torre-batata';
  
  if (quantidade > 0) {
    if (!estadoPedido.ativo) {
      estadoPedido.ativo = true;
      estadoPedido.categoria = categoria;
      estadoPedido.produto = input.getAttribute('data-name');
      desabilitarOutrasCategorias(categoria);
      
      const secaoElement = document.querySelector(`.categoria.${categoria}`);
      if (secaoElement) {
        const todosInputs = secaoElement.querySelectorAll('input[type="number"]');
        todosInputs.forEach(inp => {
          if (inp !== input) {
            inp.disabled = true;
            inp.value = 0;
          }
        });
      }
    } else if (estadoPedido.produto !== input.getAttribute('data-name')) {
      input.value = 0;
      mostrarMensagemInline('Finalize o pedido atual antes de iniciar outro');
      return;
    }
    
    mostrarBotaoAdicionar(categoria);
  } else if (estadoPedido.ativo && estadoPedido.produto === input.getAttribute('data-name')) {
    resetarCategoriaSimples(categoria);
    esconderBotaoAdicionar(categoria);
  }
}

// ========== SISTEMA PARA PORÇÕES - CORRIGIDO COM ACENTO ==========

function processarPorcoes(input) {
  const quantidade = parseInt(input.value) || 0;
  const categoria = 'porções'; // CORRIGIDO: com acento
  
  console.log(`🔍 processarPorcoes chamado - Quantidade: ${quantidade}, Produto: ${input.getAttribute('data-name')}`);
  
  if (quantidade > 0) {
    if (!estadoPedido.ativo) {
      console.log('✅ Iniciando novo pedido de porções');
      estadoPedido.ativo = true;
      estadoPedido.categoria = categoria;
      estadoPedido.produto = input.getAttribute('data-name');
      desabilitarOutrasCategorias(categoria);
      
      const secaoElement = document.querySelector(`.categoria.${categoria}`);
      if (secaoElement) {
        const todosInputs = secaoElement.querySelectorAll('input[type="number"]');
        console.log(`📋 Total de inputs na categoria: ${todosInputs.length}`);
        todosInputs.forEach(inp => {
          if (inp !== input) {
            inp.disabled = true;
            inp.value = 0;
          }
        });
      }
    } else if (estadoPedido.produto !== input.getAttribute('data-name')) {
      console.log('⚠️ Tentativa de iniciar outro pedido bloqueada');
      input.value = 0;
      mostrarMensagemInline('Finalize o pedido atual antes de iniciar outro');
      return;
    }
    
    mostrarBotaoAdicionar(categoria);
  } else if (estadoPedido.ativo && estadoPedido.produto === input.getAttribute('data-name')) {
    console.log('🔄 Resetando categoria porções');
    resetarCategoriaSimples(categoria);
    esconderBotaoAdicionar(categoria);
  }
}

// ========== SISTEMA PARA CERVEJAS - CORRIGIDO ==========

function processarCervejas(input) {
  const quantidade = parseInt(input.value) || 0;
  const categoria = 'cervejas';
  
  if (quantidade > 0) {
    if (!estadoPedido.ativo) {
      estadoPedido.ativo = true;
      estadoPedido.categoria = categoria;
      estadoPedido.produto = input.getAttribute('data-name');
      desabilitarOutrasCategorias(categoria);
      
      const secaoElement = document.querySelector(`.categoria.${categoria}`);
      if (secaoElement) {
        const todosInputs = secaoElement.querySelectorAll('input[type="number"]');
        todosInputs.forEach(inp => {
          if (inp !== input) {
            inp.disabled = true;
            inp.value = 0;
          }
        });
      }
    } else if (estadoPedido.produto !== input.getAttribute('data-name')) {
      input.value = 0;
      mostrarMensagemInline('Finalize o pedido atual antes de iniciar outro');
      return;
    }
    
    mostrarBotaoAdicionar(categoria);
  } else if (estadoPedido.ativo && estadoPedido.produto === input.getAttribute('data-name')) {
    resetarCategoriaSimples(categoria);
    esconderBotaoAdicionar(categoria);
  }
}

// ========== SISTEMA PARA BEBIDAS - CORRIGIDO ==========

function processarBebidas(input) {
  const quantidade = parseInt(input.value) || 0;
  const categoria = 'bebidas';
  
  if (quantidade > 0) {
    if (!estadoPedido.ativo) {
      estadoPedido.ativo = true;
      estadoPedido.categoria = categoria;
      estadoPedido.produto = input.getAttribute('data-name');
      desabilitarOutrasCategorias(categoria);
      
      const secaoElement = document.querySelector(`.categoria.${categoria}`);
      if (secaoElement) {
        const todosInputs = secaoElement.querySelectorAll('input[type="number"]');
        todosInputs.forEach(inp => {
          if (inp !== input) {
            inp.disabled = true;
            inp.value = 0;
          }
        });
      }
    } else if (estadoPedido.produto !== input.getAttribute('data-name')) {
      input.value = 0;
      mostrarMensagemInline('Finalize o pedido atual antes de iniciar outro');
      return;
    }
    
    mostrarBotaoAdicionar(categoria);
  } else if (estadoPedido.ativo && estadoPedido.produto === input.getAttribute('data-name')) {
    resetarCategoriaSimples(categoria);
    esconderBotaoAdicionar(categoria);
  }
}

// ========== SISTEMA PARA CAIPIRINHAS - CORRIGIDO ==========

function processarCaipirinhas(input) {
  const quantidade = parseInt(input.value) || 0;
  const categoria = 'caipirinhas';
  
  if (quantidade > 0) {
    if (!estadoPedido.ativo) {
      estadoPedido.ativo = true;
      estadoPedido.categoria = categoria;
      estadoPedido.produto = input.getAttribute('data-name');
      desabilitarOutrasCategorias(categoria);
      
      const secaoElement = document.querySelector(`.categoria.${categoria}`);
      if (secaoElement) {
        const todosInputs = secaoElement.querySelectorAll('input[type="number"]');
        todosInputs.forEach(inp => {
          if (inp !== input) {
            inp.disabled = true;
            inp.value = 0;
          }
        });
      }
    } else if (estadoPedido.produto !== input.getAttribute('data-name')) {
      input.value = 0;
      mostrarMensagemInline('Finalize o pedido atual antes de iniciar outro');
      return;
    }
    
    mostrarBotaoAdicionar(categoria);
  } else if (estadoPedido.ativo && estadoPedido.produto === input.getAttribute('data-name')) {
    resetarCategoriaSimples(categoria);
    esconderBotaoAdicionar(categoria);
  }
}

// ========== FUNÇÃO DE RESET PARA CATEGORIAS SIMPLES ==========

function resetarCategoriaSimples(categoria) {
  estadoPedido.ativo = false;
  estadoPedido.categoria = null;
  estadoPedido.produto = null;
  
  const secaoElement = document.querySelector(`.categoria.${categoria}`);
  if (secaoElement) {
    const todosInputs = secaoElement.querySelectorAll('input[type="number"]');
    todosInputs.forEach(inp => {
      inp.disabled = false;
      inp.value = 0;
    });
  }
  
  const todosElementos = document.querySelectorAll('button[disabled]');
  todosElementos.forEach(elemento => {
    elemento.disabled = false;
    elemento.style.opacity = '1';
  });
}

// ========== SISTEMA PARA PIZZAS ==========

function processarPizza(input, categoria) {
  const quantidade = parseInt(input.value) || 0;
  
  if (quantidade > 0) {
    if (!iniciarPedido(input, categoria)) return;
    
    if (quantidade > 1) input.value = 1;
    
    habilitarCheckboxMeioMeio(input);
    habilitarCheckboxQuerBorda(categoria);
    mostrarBotaoAdicionar(categoria);
  } else if (estadoPedido.ativo && estadoPedido.produto === input.getAttribute('data-name')) {
    resetarEstadoPedido();
    esconderBotaoAdicionar(categoria);
  }
}

function habilitarCheckboxMeioMeio(input) {
  const li = input.closest('li');
  if (!li) return;
  
  const divMeioMeio = li.querySelector('.pizza-meio-meio');
  if (!divMeioMeio) return;
  
  const checkboxMeio = divMeioMeio.querySelector('.chk-meio-meio');
  if (checkboxMeio) {
    checkboxMeio.disabled = false;
    
    checkboxMeio.onchange = function() {
      const saboresDiv = divMeioMeio.querySelector('.sabores-meio-meio');
      if (this.checked) {
        saboresDiv.style.display = 'block';
        
        const checkboxesSabores = saboresDiv.querySelectorAll('input[type="checkbox"]');
        checkboxesSabores.forEach(cb => {
          cb.disabled = false;
          cb.onchange = function() {
            if (this.checked) {
              checkboxesSabores.forEach(outro => {
                if (outro !== this) outro.checked = false;
              });
            }
          };
        });
      } else {
        saboresDiv.style.display = 'none';
        const checkboxesSabores = saboresDiv.querySelectorAll('input[type="checkbox"]');
        checkboxesSabores.forEach(cb => {
          cb.disabled = true;
          cb.checked = false;
        });
      }
    };
  }
}

function habilitarCheckboxQuerBorda(categoria) {
  const secaoElement = document.querySelector(`.categoria.${categoria}`);
  if (!secaoElement) return;

  const bordaInfo = secaoElement.querySelector('.borda-info');
  if (!bordaInfo) return;

  const checkboxQuerBorda = bordaInfo.querySelector('#quer-borda');
  if (checkboxQuerBorda) {
    checkboxQuerBorda.disabled = false;
    
    checkboxQuerBorda.onchange = function() {
      if (this.checked) {
        habilitarTamanhosBorda(categoria);
      } else {
        const inputsBorda = bordaInfo.querySelectorAll('input[data-name*="Borda"]');
        inputsBorda.forEach(input => {
          input.disabled = true;
          input.value = 0;
        });
        desabilitarSaboresBorda(categoria);
      }
    };
  }
}

function habilitarTamanhosBorda(categoria) {
  const secaoElement = document.querySelector(`.categoria.${categoria}`);
  if (!secaoElement) return;

  const tamanhoPizza = getTamanhoPizzaSelecionada(categoria);
  if (!tamanhoPizza) return;

  const bordaInfo = secaoElement.querySelector('.borda-info');
  if (!bordaInfo) return;

  const inputsBorda = bordaInfo.querySelectorAll('input[data-name*="Borda"]');
  inputsBorda.forEach(input => {
    const nomeBorda = input.getAttribute('data-name');
    if (nomeBorda.includes(`Borda ${tamanhoPizza}`)) {
      input.disabled = false;
      input.style.opacity = '1';
      
      input.oninput = function() {
        const valor = parseInt(this.value) || 0;
        if (valor > 0) {
          if (valor > 1) this.value = 1;
          
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
      };
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

  const bordaInfo = secaoElement.querySelector('.borda-info');
  if (!bordaInfo) return;

  const sabores = bordaInfo.querySelectorAll('.sabor-borda input[type="checkbox"]');
  sabores.forEach(sabor => {
    sabor.disabled = false;
    sabor.style.opacity = '1';
    
    sabor.onchange = function() {
      if (this.checked) {
        sabores.forEach(outro => {
          if (outro !== this) outro.checked = false;
        });
      }
    };
  });
}

function desabilitarSaboresBorda(categoria) {
  const secaoElement = document.querySelector(`.categoria.${categoria}`);
  if (!secaoElement) return;

  const bordaInfo = secaoElement.querySelector('.borda-info');
  if (!bordaInfo) return;

  const sabores = bordaInfo.querySelectorAll('.sabor-borda input[type="checkbox"]');
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

    const bordaInfo = secaoElement.querySelector('.borda-info');
    if (!bordaInfo) return;

    const checkboxQuerBorda = bordaInfo.querySelector('#quer-borda');
    if (checkboxQuerBorda) {
      checkboxQuerBorda.disabled = true;
      checkboxQuerBorda.checked = false;
    }

    const inputsBorda = bordaInfo.querySelectorAll('input[data-name*="Borda"]');
    inputsBorda.forEach(input => {
      input.disabled = true;
      input.style.opacity = '0.5';
      input.value = 0;
    });

    desabilitarSaboresBorda(secao);
    
    const checkboxesMeio = secaoElement.querySelectorAll('.chk-meio-meio');
    checkboxesMeio.forEach(cb => {
      cb.disabled = true;
      cb.checked = false;
    });
    
    const saboresMeio = secaoElement.querySelectorAll('.sabores-meio-meio');
    saboresMeio.forEach(div => {
      div.style.display = 'none';
      const cbs = div.querySelectorAll('input[type="checkbox"]');
      cbs.forEach(cb => {
        cb.disabled = true;
        cb.checked = false;
      });
    });
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

// ========== SISTEMA PARA AÇAÍ ==========

function processarAcai(input) {
  const quantidade = parseInt(input.value) || 0;
  const categoria = 'acai';
  
  if (quantidade > 0) {
    if (!iniciarPedido(input, categoria)) return;
    
    const li = input.closest('li');
    if (li) {
      const divGratis = li.querySelector('.gratis-acompanhamentos');
      if (divGratis) {
        const checkboxesGratis = divGratis.querySelectorAll('input[type="checkbox"]');
        checkboxesGratis.forEach(cb => {
          cb.disabled = false;
          cb.onchange = function() {
            const selecionados = Array.from(checkboxesGratis).filter(c => c.checked);
            if (selecionados.length >= 2) {
              checkboxesGratis.forEach(c => {
                if (!c.checked) c.disabled = true;
              });
            } else {
              checkboxesGratis.forEach(c => c.disabled = false);
            }
          };
        });
      }
    }
    
    habilitarAdicionaisAcai(categoria);
    mostrarBotaoAdicionar(categoria);
  } else if (estadoPedido.ativo && estadoPedido.produto === input.getAttribute('data-name')) {
    resetarEstadoPedido();
    esconderBotaoAdicionar(categoria);
  }
}

function habilitarAdicionaisAcai(categoria) {
  const secaoElement = document.querySelector(`.categoria.${categoria}`);
  if (!secaoElement) return;

  const todosH3 = secaoElement.querySelectorAll('h3');
  todosH3.forEach(h3 => {
    if (h3.textContent.trim() === 'Adicionais' || h3.textContent.trim() === 'Adicionais Frutas') {
      let elemento = h3.nextElementSibling;
      while (elemento && elemento.tagName === 'LI') {
        const checkbox = elemento.querySelector('input[type="checkbox"]');
        if (checkbox) checkbox.disabled = false;
        elemento = elemento.nextElementSibling;
      }
    }
  });
}

function resetarAcai() {
  const secaoElement = document.querySelector('.categoria.acai');
  if (!secaoElement) return;

  const checkboxes = secaoElement.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.disabled = true;
    checkbox.checked = false;
  });
}

// ========== SISTEMA DE BOTÕES DE ADICIONAR ==========

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
    
    const ul = secaoElement.querySelector('ul');
    if (ul) {
      ul.appendChild(botaoAdicionar);
    } else {
      secaoElement.appendChild(botaoAdicionar);
    }
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

// ========== ADICIONAR AO CARRINHO ==========

function adicionarAoCarrinho(categoria) {
  const secaoElement = document.querySelector(`.categoria.${categoria}`);
  if (!secaoElement) return;

  if (categoria === 'lanches') {
    adicionarLancheAoCarrinho(secaoElement, categoria);
  } else if (categoria === 'hamburguer') {
    adicionarHamburguerAoCarrinho(secaoElement, categoria);
  } else if (['tabuas', 'torre-batata', 'porções', 'cervejas', 'bebidas', 'caipirinhas'].includes(categoria)) {
    adicionarItemSimplesComReset(secaoElement, categoria);
  } else if (['pizzas-trad', 'pizzas-especiais', 'pizzas-doces'].includes(categoria)) {
    adicionarPizzaAoCarrinho(secaoElement, categoria);
  } else if (categoria === 'acai') {
    adicionarAcaiAoCarrinho(secaoElement, categoria);
  }
}

function adicionarLancheAoCarrinho(secaoElement, categoria) {
  const inputsProdutos = secaoElement.querySelectorAll('li.com-input input[type="number"]');
  let itensAdicionados = 0;
  
  inputsProdutos.forEach(input => {
    const quantidade = parseInt(input.value) || 0;
    if (quantidade > 0) {
      const nomeProduto = input.getAttribute('data-name');
      let precoProduto = parseFloat(input.getAttribute('data-price')) || 0;
      
      const li = input.closest('li');
      const removerSelecionados = [];
      if (li) {
        const divRemover = li.querySelector('.remover-ingredientes');
        if (divRemover) {
          const checkboxesRemover = divRemover.querySelectorAll('input[type="checkbox"]:checked');
          checkboxesRemover.forEach(cb => removerSelecionados.push(cb.value));
        }
      }
      
      const h3Adicionais = Array.from(secaoElement.querySelectorAll('h3')).find(h3 => h3.textContent.trim() === 'Adicionais');
      const adicionaisSelecionados = [];
      
      if (h3Adicionais) {
        let elemento = h3Adicionais.nextElementSibling;
        while (elemento && elemento.tagName === 'LI') {
          const checkbox = elemento.querySelector('input[type="checkbox"]:checked');
          if (checkbox) {
            adicionaisSelecionados.push({
              nome: checkbox.getAttribute('data-name') || 'Adicional',
              preco: parseFloat(checkbox.getAttribute('data-price')) || 0
            });
          }
          elemento = elemento.nextElementSibling;
        }
      }
      
      const valorAdicionais = adicionaisSelecionados.reduce((total, adicional) => total + adicional.preco, 0);
      const nomesAdicionais = adicionaisSelecionados.map(adicional => adicional.nome);
      const precoFinal = precoProduto + valorAdicionais;
      
      for (let i = 0; i < quantidade; i++) {
        carrinho.push({
          id: Date.now() + Math.random(),
          nome: nomeProduto,
          preco: precoFinal,
          quantidade: 1,
          subtotal: precoFinal,
          categoria: categoria,
          removerIngredientes: removerSelecionados.length > 0 ? removerSelecionados.join(', ') : null,
          adicionais: nomesAdicionais.length > 0 ? nomesAdicionais.join(', ') : null
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

function adicionarHamburguerAoCarrinho(secaoElement, categoria) {
  const inputsProdutos = secaoElement.querySelectorAll('li.com-input input[type="number"]');
  let itensAdicionados = 0;
  
  inputsProdutos.forEach(input => {
    const quantidade = parseInt(input.value) || 0;
    if (quantidade > 0) {
      const nomeProduto = input.getAttribute('data-name');
      const precoProduto = parseFloat(input.getAttribute('data-price')) || 0;
      
      const li = input.closest('li');
      const removerSelecionados = [];
      if (li) {
        const divRemover = li.querySelector('.remover-ingredientes');
        if (divRemover) {
          const checkboxesRemover = divRemover.querySelectorAll('input[type="checkbox"]:checked');
          checkboxesRemover.forEach(cb => removerSelecionados.push(cb.value));
        }
      }
      
      for (let i = 0; i < quantidade; i++) {
        carrinho.push({
          id: Date.now() + Math.random(),
          nome: nomeProduto,
          preco: precoProduto,
          quantidade: 1,
          subtotal: precoProduto,
          categoria: categoria,
          removerIngredientes: removerSelecionados.length > 0 ? removerSelecionados.join(', ') : null
        });
      }
      
      itensAdicionados += quantidade;
    }
  });
  
  if (itensAdicionados > 0) {
    resetarEstadoPedido();
    esconderBotaoAdicionar(categoria);
    atualizarCarrinho();
    mostrarMensagemInline(`${itensAdicionados} hambúrguer(es) adicionado(s) ao carrinho!`);
  }
}

function adicionarItemSimplesComReset(secaoElement, categoria) {
  const inputs = secaoElement.querySelectorAll('input[type="number"]');
  let itensAdicionados = 0;
  
  inputs.forEach(input => {
    const quantidade = parseInt(input.value) || 0;
    if (quantidade > 0) {
      const nome = input.getAttribute('data-name');
      const preco = parseFloat(input.getAttribute('data-price'));
      
      if (nome && !isNaN(preco)) {
        carrinho.push({
          id: Date.now() + Math.random(),
          nome: nome,
          preco: preco,
          quantidade: quantidade,
          subtotal: preco * quantidade,
          categoria: categoria
        });
        
        itensAdicionados += quantidade;
      }
    }
  });
  
  if (itensAdicionados > 0) {
    resetarCategoriaSimples(categoria);
    esconderBotaoAdicionar(categoria);
    atualizarCarrinho();
    
    let mensagem = '';
    switch(categoria) {
      case 'tabuas': mensagem = `${itensAdicionados} tábua(s) adicionada(s) ao carrinho!`; break;
      case 'torre-batata': mensagem = `${itensAdicionados} torre(s) de batata adicionada(s) ao carrinho!`; break;
      case 'porcoes': mensagem = `${itensAdicionados} porção(ões) adicionada(s) ao carrinho!`; break;
      case 'cervejas': mensagem = `${itensAdicionados} cerveja(s) adicionada(s) ao carrinho!`; break;
      case 'bebidas': mensagem = `${itensAdicionados} bebida(s) adicionada(s) ao carrinho!`; break;
      case 'caipirinhas': mensagem = `${itensAdicionados} caipirinha(s) adicionada(s) ao carrinho!`; break;
      default: mensagem = `${itensAdicionados} item(ns) adicionado(s) ao carrinho!`;
    }
    
    mostrarMensagemInline(mensagem);
  }
}

function adicionarPizzaAoCarrinho(secaoElement, categoria) {
  const inputsPizza = secaoElement.querySelectorAll('li.com-input input[type="number"]:not([data-name*="Borda"])');
  let itensAdicionados = 0;
  
  inputsPizza.forEach(input => {
    const quantidade = parseInt(input.value) || 0;
    if (quantidade > 0) {
      const nomePizza = input.getAttribute('data-name');
      let precoPizza = parseFloat(input.getAttribute('data-price')) || 0;
      
      const li = input.closest('li');
      let meioSelecionado = null;
      let precoMeio = 0;
      
      if (li) {
        const divMeioMeio = li.querySelector('.pizza-meio-meio');
        if (divMeioMeio) {
          const checkboxMeio = divMeioMeio.querySelector('.chk-meio-meio');
          if (checkboxMeio && checkboxMeio.checked) {
            const saboresDiv = divMeioMeio.querySelector('.sabores-meio-meio');
            if (saboresDiv) {
              const saborSelecionado = saboresDiv.querySelector('input[type="checkbox"]:checked');
              if (saborSelecionado) {
                meioSelecionado = saborSelecionado.value;
                
                const tamanhoPizza = getTamanhoPizza(nomePizza);
                const inputsOutrosSabores = secaoElement.querySelectorAll('li.com-input input[type="number"]:not([data-name*="Borda"])');
                
                for (let outroInput of inputsOutrosSabores) {
                  const outroNome = outroInput.getAttribute('data-name');
                  if (outroNome.includes(meioSelecionado) && outroNome.includes(tamanhoPizza)) {
                    precoMeio = parseFloat(outroInput.getAttribute('data-price')) || 0;
                    break;
                  }
                }
                
                if (precoMeio > precoPizza) {
                  precoPizza = precoMeio;
                }
              }
            }
          }
        }
      }
      
      let valorBorda = 0;
      let nomeBorda = null;
      
      const bordaInfo = secaoElement.querySelector('.borda-info');
      if (bordaInfo) {
        const checkboxQuerBorda = bordaInfo.querySelector('#quer-borda');
        if (checkboxQuerBorda && checkboxQuerBorda.checked) {
          const inputsBorda = bordaInfo.querySelectorAll('input[data-name*="Borda"]');
          const bordaSelecionada = Array.from(inputsBorda).find(inp => parseInt(inp.value) > 0);
          
          if (bordaSelecionada) {
            const saboresSelecionados = bordaInfo.querySelectorAll('.sabor-borda input[type="checkbox"]:checked');
            const saborSelecionado = Array.from(saboresSelecionados).find(cb => cb.checked);
            
            if (saborSelecionado) {
              const tamanhoPizza = getTamanhoPizza(nomePizza);
              valorBorda = obterPrecoBorda(tamanhoPizza);
              nomeBorda = saborSelecionado.value;
            }
          }
        }
      }
      
      const precoFinal = precoPizza + valorBorda;
      
      for (let i = 0; i < quantidade; i++) {
        carrinho.push({
          id: Date.now() + Math.random(),
          nome: nomePizza,
          preco: precoFinal,
          quantidade: 1,
          subtotal: precoFinal,
          categoria: categoria,
          meio: meioSelecionado,
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

function adicionarAcaiAoCarrinho(secaoElement, categoria) {
  const inputsAcai = secaoElement.querySelectorAll('li.com-input input[type="number"]');
  let itensAdicionados = 0;
  
  inputsAcai.forEach(input => {
    const quantidade = parseInt(input.value) || 0;
    if (quantidade > 0) {
      const nomeAcai = input.getAttribute('data-name');
      let precoAcai = parseFloat(input.getAttribute('data-price')) || 0;
      
      const li = input.closest('li');
      const acompanhamentosGratis = [];
      
      if (li) {
        const divGratis = li.querySelector('.gratis-acompanhamentos');
        if (divGratis) {
          const checkboxesGratis = divGratis.querySelectorAll('input[type="checkbox"]:checked');
          checkboxesGratis.forEach(cb => acompanhamentosGratis.push(cb.value));
        }
      }
      
      const adicionaisPagos = [];
      const todosH3 = secaoElement.querySelectorAll('h3');
      
      todosH3.forEach(h3 => {
        if (h3.textContent.trim() === 'Adicionais' || h3.textContent.trim() === 'Adicionais Frutas') {
          let elemento = h3.nextElementSibling;
          while (elemento && elemento.tagName === 'LI') {
            const checkbox = elemento.querySelector('input[type="checkbox"]:checked');
            if (checkbox) {
              adicionaisPagos.push({
                nome: checkbox.getAttribute('data-name') || 'Adicional',
                preco: parseFloat(checkbox.getAttribute('data-price')) || 0
              });
            }
            elemento = elemento.nextElementSibling;
          }
        }
      });
      
      const valorAdicionais = adicionaisPagos.reduce((total, adicional) => total + adicional.preco, 0);
      const precoFinal = precoAcai + valorAdicionais;
      
      let detalhesAdicionais = '';
      let detalhesAcompanhamentos = '';
      
      if (acompanhamentosGratis.length > 0) {
        detalhesAcompanhamentos = acompanhamentosGratis.join(', ');
      }
      
      if (adicionaisPagos.length > 0) {
        detalhesAdicionais = adicionaisPagos.map(a => a.nome).join(', ');
      }
      
      for (let i = 0; i < quantidade; i++) {
        carrinho.push({
          id: Date.now() + Math.random(),
          nome: nomeAcai,
          preco: precoFinal,
          quantidade: 1,
          subtotal: precoFinal,
          categoria: categoria,
          acompanhamentos: detalhesAcompanhamentos || null,
          adicionais: detalhesAdicionais || null
        });
      }
      
      itensAdicionados += quantidade;
    }
  });
  
  if (itensAdicionados > 0) {
    resetarEstadoPedido();
    esconderBotaoAdicionar(categoria);
    atualizarCarrinho();
    mostrarMensagemInline(`${itensAdicionados} açaí(s) adicionado(s) ao carrinho!`);
  }
}

// ========== SISTEMA DE ENTREGA ==========

function configurarSistemaEntrega() {
  const radiosEntrega = document.querySelectorAll('input[name="entrega"]');
  const formularioEntrega = document.getElementById('formulario-entrega');
  
  radiosEntrega.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.value === 'Entrega' && formularioEntrega) {
        formularioEntrega.style.display = 'block';
        formularioEntrega.style.animation = 'slideDown 0.3s ease';
      } else if (formularioEntrega) {
        formularioEntrega.style.display = 'none';
      }
    });
  });
  
  if (formularioEntrega) {
    formularioEntrega.style.display = 'none';
  }
}

// ========== GERAÇÃO DE MENSAGEM WHATSAPP ==========

function gerarMensagemPedido() {
  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio! Adicione alguns itens antes de finalizar o pedido.');
    return '';
  }
  
  const entregaSelecionada = document.querySelector('input[name="entrega"]:checked');
  if (!entregaSelecionada) {
    alert('Por favor, selecione uma opção de retirada antes de finalizar o pedido.');
    return '';
  }
  
  if (entregaSelecionada.value === 'Entrega') {
    const nome = document.getElementById('nome')?.value.trim();
    const telefone = document.getElementById('telefone')?.value.trim();
    const rua = document.getElementById('rua')?.value.trim();
    const numero = document.getElementById('numero')?.value.trim();
    const bairro = document.getElementById('bairro')?.value.trim();
    
    if (!nome || !telefone || !rua || !numero || !bairro) {
      alert('Por favor, preencha todos os campos obrigatórios de entrega.');
      return '';
    }
  }
  
  let mensagem = 'Pedido - Cardoso Caldo de Cana\n';
  mensagem += '------------------------------\n\n';
  
  let totalGeral = 0;
  
  carrinho.forEach(item => {
    let nomeItem = item.nome;
    
    if (isPizza(item.nome) && !nomeItem.toLowerCase().includes('pizza')) {
      nomeItem = `Pizza ${nomeItem}`;
    }
    
    mensagem += `Qtd: ${item.quantidade} --- ${nomeItem}\n`;
    
    if (item.meio) {
      mensagem += `Meio: ${item.meio}\n`;
    }
    
    if (item.borda) {
      mensagem += `Borda: ${item.borda}\n`;
    }
    
    if (item.acompanhamentos) {
      mensagem += `Acompanhamentos: ${item.acompanhamentos}\n`;
    }
    
    if (item.adicionais) {
      mensagem += `Adicionais: ${item.adicionais}\n`;
    }
    
    if (item.removerIngredientes) {
      mensagem += `Remover: ${item.removerIngredientes}\n`;
    }
    
    if (item.observacoes) {
      mensagem += `Observacoes: ${item.observacoes}\n`;
    }
    
    mensagem += `Total: R$ ${item.subtotal.toFixed(2)}\n\n`;
    
    totalGeral += item.subtotal;
  });
  
  mensagem += '------------------------------\n';
  mensagem += `Total: R$ ${totalGeral.toFixed(2)}\n\n`;
  
  if (entregaSelecionada.value === 'Retirada') {
    mensagem += `Retirada: Retirar no balcao\n`;
  } else {
    mensagem += `Retirada: Entregar no Endereco\n\n`;
    
    const nome = document.getElementById('nome')?.value.trim();
    const telefone = document.getElementById('telefone')?.value.trim();
    const rua = document.getElementById('rua')?.value.trim();
    const numero = document.getElementById('numero')?.value.trim();
    const bairro = document.getElementById('bairro')?.value.trim();
    const complemento = document.getElementById('complemento')?.value.trim();
    const observacoes = document.getElementById('observacoes')?.value.trim();
    
    mensagem += `Dados para Entrega:\n`;
    mensagem += `Nome: ${nome}\n`;
    mensagem += `Telefone: ${telefone}\n`;
    mensagem += `Endereco: ${rua}, ${numero}\n`;
    mensagem += `Bairro: ${bairro}\n`;
    
    if (complemento) {
      mensagem += `Complemento: ${complemento}\n`;
    }
    
    if (observacoes) {
      mensagem += `Observacoes: ${observacoes}\n`;
    }
  }
  
  return mensagem;
}

function enviarPedido() {
  const mensagem = gerarMensagemPedido();
  
  if (mensagem) {
    const numeroWhatsApp = '5548996430781';
    const mensagemCodificada = encodeURIComponent(mensagem);
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
    
    window.open(urlWhatsApp, '_blank');
    
    carrinho = [];
    atualizarCarrinho();
    fecharCarrinho();
    
    const formularioEntrega = document.getElementById('formulario-entrega');
    if (formularioEntrega) {
      formularioEntrega.querySelectorAll('input, textarea').forEach(campo => {
        campo.value = '';
      });
      formularioEntrega.style.display = 'none';
    }
    
    const radioRetirada = document.querySelector('input[name="entrega"][value="Retirada"]');
    if (radioRetirada) radioRetirada.checked = true;
    
    mostrarMensagemInline('Pedido enviado com sucesso!');
  }
}

// ========== INICIALIZAÇÃO DO SISTEMA ==========

function inicializarSistema() {
  const categorias = [
    'lanches', 'hamburguer', 'tabuas', 'torre-batata', 'porções', // CORRIGIDO
    'pizzas-trad', 'pizzas-especiais', 'pizzas-doces', 
    'cervejas', 'bebidas', 'caipirinhas', 'acai'
  ];
  
  categorias.forEach(categoria => {
    criarBotaoAdicionarUniversal(categoria);
    
    const secaoElement = document.querySelector(`.categoria.${categoria}`);
    if (!secaoElement) {
      console.warn(`⚠️ Categoria não encontrada: ${categoria}`);
      return;
    }
    
    const inputs = secaoElement.querySelectorAll('input[type="number"]:not([data-name*="Borda"])');
    
    if (inputs.length === 0) {
      console.warn(`⚠️ Nenhum input encontrado na categoria: ${categoria}`);
    }
    
    inputs.forEach(input => {
      // Remove qualquer listener inline antigo
      input.removeAttribute('oninput');
      input.removeAttribute('onchange');
      
      input.addEventListener('input', function() {
        if (categoria === 'lanches') {
          processarLanche(this);
        } else if (categoria === 'hamburguer') {
          processarHamburguer(this);
        } else if (categoria === 'tabuas') {
          processarTabuas(this);
        } else if (categoria === 'torre-batata') {
          processarTorreBatata(this);
        } else if (categoria === 'porções') { // CORRIGIDO
          processarPorcoes(this);
        } else if (categoria === 'cervejas') {
          processarCervejas(this);
        } else if (categoria === 'bebidas') {
          processarBebidas(this);
        } else if (categoria === 'caipirinhas') {
          processarCaipirinhas(this);
        } else if (['pizzas-trad', 'pizzas-especiais', 'pizzas-doces'].includes(categoria)) {
          processarPizza(this, categoria);
        } else if (categoria === 'acai') {
          processarAcai(this);
        }
      });
    });
  });
  
  resetarAdicionaisLanche();
  resetarSistemaBordas();
  resetarAcai();
  resetarHamburguer();
  
  configurarSistemaEntrega();
  
  console.log('✅ Sistema inicializado - Listeners configurados para todas as categorias');
}

// ========== ESTILOS CSS DINÂMICOS ==========

function adicionarEstilos() {
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
    
    .mensagem-inline {
      animation: slideDown 0.3s ease;
    }
    
    .btn-adicionar-carrinho-universal:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(37, 211, 102, 0.3);
    }
    
    .btn-adicionar-carrinho-universal:active {
      transform: translateY(0);
    }
    
    input[disabled]:not(#carrinho-painel input):not(#formulario-entrega input) {
      opacity: 0.5 !important;
      cursor: not-allowed !important;
    }
    
    button[disabled] {
      opacity: 0.5 !important;
      cursor: not-allowed !important;
    }
    
    .sabor-borda input[disabled] + label,
    .sabores-meio-meio input[disabled] + label {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .remover-ingredientes input[type="checkbox"]:not([disabled]) {
      pointer-events: auto !important;
      cursor: pointer !important;
      opacity: 1 !important;
    }
    
    .remover-ingredientes label {
      cursor: pointer !important;
      user-select: none;
    }
    
    input[type="number"]:not([disabled]) {
      pointer-events: auto !important;
      cursor: text !important;
      opacity: 1 !important;
    }
    
    #tipo-entrega {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid rgba(255,255,255,0.2);
    }
    
    #tipo-entrega label {
      color: white;
      font-size: 14px;
      margin-bottom: 8px;
      cursor: pointer;
    }
    
    .carrinho-header {
      flex-shrink: 0;
      max-height: 60vh;
      overflow-y: auto;
      overflow-x: hidden;
    }
    
    #formulario-entrega {
      width: 100%;
      box-sizing: border-box;
      padding: 15px !important;
      margin: 0 !important;
      background-color: rgba(255, 255, 255, 0.05) !important;
      border-radius: 8px !important;
    }
    
    #formulario-entrega h3 {
      color: white !important;
      font-size: 16px !important;
      margin: 0 0 15px 0 !important;
      padding: 0 !important;
      border: none !important;
      text-shadow: none !important;
      text-align: left !important;
    }
    
    #formulario-entrega label {
      display: block !important;
      color: white !important;
      font-size: 13px !important;
      margin-bottom: 6px !important;
      font-weight: 500 !important;
      text-align: left !important;
    }
    
    #formulario-entrega input[type="text"],
    #formulario-entrega input[type="tel"],
    #formulario-entrega textarea {
      width: 100% !important;
      max-width: 100% !important;
      padding: 10px 12px !important;
      margin-bottom: 14px !important;
      font-size: 14px !important;
      color: #1a1a1a !important;
      background-color: #f8f9fa !important;
      border: 1px solid #e0e0e0 !important;
      border-radius: 6px !important;
      box-sizing: border-box !important;
      font-family: inherit !important;
      height: auto !important;
      text-align: left !important;
    }
    
    #formulario-entrega input::placeholder,
    #formulario-entrega textarea::placeholder {
      color: #a0a0a0 !important;
    }
    
    #formulario-entrega textarea {
      resize: vertical !important;
      min-height: 60px !important;
      font-family: inherit !important;
    }
    
    .carrinho-header::-webkit-scrollbar {
      width: 6px;
    }
    
    .carrinho-header::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
    }
    
    .carrinho-header::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 3px;
    }
    
    .carrinho-header::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  `; 
  document.head.appendChild(style);
}

// ========== INICIALIZAÇÃO PRINCIPAL ==========

document.addEventListener('DOMContentLoaded', () => {
  const allSections = document.querySelectorAll('.categoria');
  allSections.forEach(section => {
    section.style.display = 'none';
  });
  
  const carrinhoFlutuante = document.getElementById('carrinho-flutuante');
  if (carrinhoFlutuante) {
    carrinhoFlutuante.style.display = 'none';
  }
  
  adicionarEstilos();
  inicializarSistema();
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      fecharCarrinho();
      if (estadoPedido.ativo) {
        resetarEstadoPedido();
        mostrarMensagemInline('Pedido cancelado');
      }
    }
  });
  
  atualizarCarrinho();
  
  console.log('✅ Sistema do Cardápio Digital Cardoso Caldo de Cana inicializado com sucesso!');
  console.log('🔧 Categorias corrigidas: Tábuas, Torre de Batata, Porções, Cervejas, Bebidas e Caipirinhas');
  console.log('✨ Todas as categorias agora permitem apenas 1 pedido por vez e resetam corretamente!');
  console.log('');
  console.log('📊 VERIFICAÇÃO DE CATEGORIAS:');
  console.log('Lanches:', document.querySelector('.categoria.lanches') ? '✅' : '❌');
  console.log('Hambúrguer:', document.querySelector('.categoria.hamburguer') ? '✅' : '❌');
  console.log('Tábuas:', document.querySelector('.categoria.tabuas') ? '✅' : '❌');
  console.log('Torre Batata:', document.querySelector('.categoria.torre-batata') ? '✅' : '❌');
  console.log('Porções:', document.querySelector('.categoria.porções') ? '✅' : '❌'); // CORRIGIDO
  console.log('Cervejas:', document.querySelector('.categoria.cervejas') ? '✅' : '❌');
  console.log('Bebidas:', document.querySelector('.categoria.bebidas') ? '✅' : '❌');
  console.log('Caipirinhas:', document.querySelector('.categoria.caipirinhas') ? '✅' : '❌');
  console.log('Açaí:', document.querySelector('.categoria.acai') ? '✅' : '❌');
});