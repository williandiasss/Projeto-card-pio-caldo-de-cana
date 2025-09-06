// Sistema de carrinho universal para todas as categorias
let carrinho = [];
let totalCarrinho = 0;

// Configurações temporárias específicas para pizzas (por seção)
let configuracoesTemporarias = {
  'pizzas-trad': { bordaSelecionada: null, tamanhoBorda: null, querBorda: false },
  'pizzas-especiais': { bordaSelecionada: null, tamanhoBorda: null, querBorda: false },
  'pizzas-doces': { bordaSelecionada: null, tamanhoBorda: null, querBorda: false }
};

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

// ========== FUNÇÕES DO PAINEL LATERAL DO CARRINHO ==========

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

// CORRIGIDO: Estrutura HTML dos itens com as classes CSS corretas
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
      
      if (item.borda) {
        nomeExibicao += ` (Borda: ${item.borda})`;
      }
      
      // ESTRUTURA HTML CORRIGIDA com as classes CSS necessárias
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
  
  return [...pizzasTracionais, ...pizzasEspeciais, ...pizzasDoces].some(pizza => nome.includes(pizza));
}

function getTamanhoPizza(nome) {
  if (nome.includes(' P')) return 'P';
  if (nome.includes(' M')) return 'M';
  if (nome.includes(' G')) return 'G';
  return null;
}

// NOVO: Função para detectar tamanho da pizza selecionada na seção
function getTamanhoPizzaSelecionadaNaSecao(secao) {
  const secaoElement = document.querySelector(`.categoria.${secao}`);
  if (!secaoElement) return null;
  
  const inputs = secaoElement.querySelectorAll('input[type="number"]:not([data-name*="Borda"])');
  
  for (let input of inputs) {
    const quantidade = parseInt(input.value) || 0;
    if (quantidade > 0) {
      const nome = input.getAttribute('data-name');
      return getTamanhoPizza(nome);
    }
  }
  
  return null;
}

function obterPrecoBorda(tamanho) {
  const precosBorda = { 'P': 8, 'M': 10, 'G': 12 };
  return precosBorda[tamanho] || 0;
}

// ========== SISTEMA UNIVERSAL PARA TODAS AS CATEGORIAS ==========

function adicionarItemAoCarrinho(nome, preco, quantidade, secao = null) {
  if (quantidade <= 0) return;
  
  let borda = null;
  let precoUnitario = preco;
  
  // Se é pizza, verifica configuração de borda
  if (isPizza(nome) && secao && configuracoesTemporarias[secao]) {
    const config = configuracoesTemporarias[secao];
    
    if (config.querBorda && config.bordaSelecionada && config.tamanhoBorda) {
      const tamanhoPizza = getTamanhoPizza(nome);
      
      if (tamanhoPizza === config.tamanhoBorda) {
        borda = config.bordaSelecionada;
        precoUnitario += obterPrecoBorda(tamanhoPizza);
      }
    }
  }
  
  // Adiciona cada quantidade como item individual para manter independência
  for (let i = 0; i < quantidade; i++) {
    const novoItem = {
      id: Date.now() + Math.random(),
      nome: nome,
      preco: precoUnitario,
      quantidade: 1,
      subtotal: precoUnitario,
      borda: borda
    };
    
    carrinho.push(novoItem);
  }
  
  atualizarCarrinho();
}

// Função universal para criar botões "Adicionar ao Carrinho" em qualquer categoria
function criarBotaoAdicionarUniversal(nomeCategoria) {
  const secaoElement = document.querySelector(`.categoria.${nomeCategoria}`);
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
    botaoAdicionar.textContent = '🛒 Adicionar Selecionados ao Carrinho';
    
    botaoAdicionar.addEventListener('mouseenter', () => {
      botaoAdicionar.style.transform = 'translateY(-2px)';
      botaoAdicionar.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.3)';
    });
    
    botaoAdicionar.addEventListener('mouseleave', () => {
      botaoAdicionar.style.transform = 'translateY(0)';
      botaoAdicionar.style.boxShadow = 'none';
    });
    
    botaoAdicionar.addEventListener('click', function() {
      adicionarItensCategoriaAoCarrinho(nomeCategoria);
    });
    
    secaoElement.appendChild(botaoAdicionar);
  }
}

function adicionarItensCategoriaAoCarrinho(nomeCategoria) {
  const secaoElement = document.querySelector(`.categoria.${nomeCategoria}`);
  if (!secaoElement) return;
  
  const inputs = secaoElement.querySelectorAll('input[type="number"]:not([data-name*="Borda"])');
  let itensAdicionados = 0;
  
  inputs.forEach(input => {
    const quantidade = parseInt(input.value) || 0;
    if (quantidade > 0) {
      const nome = input.getAttribute('data-name');
      const preco = parseFloat(input.getAttribute('data-price'));
      
      if (nome && !isNaN(preco)) {
        adicionarItemAoCarrinho(nome, preco, quantidade, nomeCategoria);
        itensAdicionados += quantidade;
        input.value = 0; // Zera após adicionar
      }
    }
  });
  
  // Para pizzas, também verifica bordas
  if (['pizzas-trad', 'pizzas-especiais', 'pizzas-doces'].includes(nomeCategoria)) {
    resetarConfiguracaoSecaoPizza(nomeCategoria);
  }
  
  if (itensAdicionados > 0) {
    alert(`${itensAdicionados} item(ns) adicionado(s) ao carrinho!`);
    esconderBotaoAdicionar(nomeCategoria);
  } else {
    alert('Selecione pelo menos um item para adicionar ao carrinho.');
  }
}

function mostrarBotaoAdicionar(nomeCategoria) {
  const botao = document.querySelector(`.categoria.${nomeCategoria} .btn-adicionar-carrinho-universal`);
  if (botao) {
    botao.style.display = 'block';
  }
}

function esconderBotaoAdicionar(nomeCategoria) {
  const botao = document.querySelector(`.categoria.${nomeCategoria} .btn-adicionar-carrinho-universal`);
  if (botao) {
    botao.style.display = 'none';
  }
}

function resetarConfiguracaoSecaoPizza(secao) {
  const secaoElement = document.querySelector(`.categoria.${secao}`);
  if (!secaoElement) return;
  
  configuracoesTemporarias[secao] = {
    bordaSelecionada: null,
    tamanhoBorda: null,
    querBorda: false
  };
  
  const checkboxQuerBorda = secaoElement.querySelector('#quer-borda');
  if (checkboxQuerBorda) checkboxQuerBorda.checked = false;
  
  const inputsBorda = secaoElement.querySelectorAll('input[data-name*="Borda"]');
  inputsBorda.forEach(input => {
    input.value = 0;
    input.disabled = true;
    input.style.opacity = '0.5';
  });
  
  const checkboxesSabor = secaoElement.querySelectorAll('.sabor-borda input[type="checkbox"]');
  checkboxesSabor.forEach(checkbox => {
    checkbox.checked = false;
    checkbox.disabled = true;
    checkbox.style.opacity = '0.5';
  });
}

// ========== SISTEMA DE BORDAS MELHORADO PARA PIZZAS ==========

function inicializarSistemaBordas() {
  const secoesPizza = ['pizzas-trad', 'pizzas-especiais', 'pizzas-doces'];
  
  secoesPizza.forEach(secao => {
    const secaoElement = document.querySelector(`.categoria.${secao}`);
    if (!secaoElement) return;
    
    const config = configuracoesTemporarias[secao];
    const checkboxQuerBorda = secaoElement.querySelector('#quer-borda');
    const inputsBordaTamanho = secaoElement.querySelectorAll('input[data-name*="Borda"]');
    const checkboxesSaborBorda = secaoElement.querySelectorAll('.sabor-borda input[type="checkbox"]');
    const inputsPizza = secaoElement.querySelectorAll('input[type="number"]:not([data-name*="Borda"])');
    
    // Estado inicial - tudo desabilitado
    resetarTodosSistemasBorda(secao);
    
    // PASSO 1: Monitorar seleção de pizza para habilitar checkbox "quer borda"
    inputsPizza.forEach(input => {
      input.addEventListener('input', function() {
        const temPizzaSelecionada = Array.from(inputsPizza).some(inp => (parseInt(inp.value) || 0) > 0);
        
        if (checkboxQuerBorda) {
          if (temPizzaSelecionada) {
            checkboxQuerBorda.disabled = false;
            checkboxQuerBorda.style.opacity = '1';
            checkboxQuerBorda.parentElement.style.opacity = '1';
          } else {
            // Se não tem pizza selecionada, reseta tudo
            resetarTodosSistemasBorda(secao);
          }
        }
      });
    });
    
    // PASSO 2: Checkbox "quer borda" habilita tamanhos de borda correspondentes
    if (checkboxQuerBorda) {
      checkboxQuerBorda.addEventListener('change', function() {
        config.querBorda = this.checked;
        
        if (config.querBorda) {
          // Detectar tamanho da pizza selecionada
          const tamanhoPizza = getTamanhoPizzaSelecionadaNaSecao(secao);
          
          if (tamanhoPizza) {
            // Habilitar apenas o tamanho de borda correspondente à pizza
            inputsBordaTamanho.forEach(input => {
              const nomeBorda = input.getAttribute('data-name');
              const ehTamanhoCorreto = nomeBorda.includes(`Borda ${tamanhoPizza}`);
              
              if (ehTamanhoCorreto) {
                input.disabled = false;
                input.style.opacity = '1';
                input.parentElement.style.opacity = '1';
              } else {
                input.disabled = true;
                input.style.opacity = '0.3';
                input.parentElement.style.opacity = '0.3';
                input.value = 0;
              }
            });
          }
        } else {
          // Desabilitar bordas e sabores
          inputsBordaTamanho.forEach(input => {
            input.disabled = true;
            input.style.opacity = '0.5';
            input.parentElement.style.opacity = '0.5';
            input.value = 0;
          });
          
          checkboxesSaborBorda.forEach(checkbox => {
            checkbox.disabled = true;
            checkbox.style.opacity = '0.5';
            checkbox.parentElement.style.opacity = '0.5';
            checkbox.checked = false;
          });
          
          config.tamanhoBorda = null;
          config.bordaSelecionada = null;
        }
      });
    }
    
    // PASSO 3: Seleção de quantidade de borda habilita sabores
    inputsBordaTamanho.forEach(input => {
      input.addEventListener('input', function() {
        const quantidade = parseInt(this.value) || 0;
        const nomeBorda = this.getAttribute('data-name');
        let tamanho = '';
        
        if (nomeBorda.includes('Borda P')) tamanho = 'P';
        else if (nomeBorda.includes('Borda M')) tamanho = 'M';
        else if (nomeBorda.includes('Borda G')) tamanho = 'G';
        
        if (quantidade > 0) {
          // Garantir que apenas um tamanho de borda seja selecionado
          inputsBordaTamanho.forEach(outroInput => {
            if (outroInput !== this && !outroInput.disabled) {
              outroInput.value = 0;
            }
          });
          
          config.tamanhoBorda = tamanho;
          
          // Habilitar sabores de borda
          checkboxesSaborBorda.forEach(checkbox => {
            checkbox.disabled = false;
            checkbox.style.opacity = '1';
            checkbox.parentElement.style.opacity = '1';
          });
        } else {
          config.tamanhoBorda = null;
          config.bordaSelecionada = null;
          
          // Desabilitar sabores
          checkboxesSaborBorda.forEach(checkbox => {
            checkbox.disabled = true;
            checkbox.style.opacity = '0.5';
            checkbox.parentElement.style.opacity = '0.5';
            checkbox.checked = false;
          });
        }
      });
    });
    
    // PASSO 4: Seleção de sabor da borda (apenas um por vez)
    checkboxesSaborBorda.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        if (this.checked) {
          checkboxesSaborBorda.forEach(cb => {
            if (cb !== this) cb.checked = false;
          });
          config.bordaSelecionada = this.value;
        } else {
          config.bordaSelecionada = null;
        }
      });
    });
  });
}

// NOVA: Função para resetar todos os sistemas de borda
function resetarTodosSistemasBorda(secao) {
  const secaoElement = document.querySelector(`.categoria.${secao}`);
  if (!secaoElement) return;
  
  const config = configuracoesTemporarias[secao];
  
  config.querBorda = false;
  config.tamanhoBorda = null;
  config.bordaSelecionada = null;
  
  // Desabilitar checkbox "quer borda"
  const checkboxQuerBorda = secaoElement.querySelector('#quer-borda');
  if (checkboxQuerBorda) {
    checkboxQuerBorda.checked = false;
    checkboxQuerBorda.disabled = true;
    checkboxQuerBorda.style.opacity = '0.5';
    checkboxQuerBorda.parentElement.style.opacity = '0.5';
  }
  
  // Desabilitar todos os inputs de borda
  const inputsBorda = secaoElement.querySelectorAll('input[data-name*="Borda"]');
  inputsBorda.forEach(input => {
    input.value = 0;
    input.disabled = true;
    input.style.opacity = '0.5';
    input.parentElement.style.opacity = '0.5';
  });
  
  // Desabilitar todos os sabores de borda
  const checkboxesSabor = secaoElement.querySelectorAll('.sabor-borda input[type="checkbox"]');
  checkboxesSabor.forEach(checkbox => {
    checkbox.checked = false;
    checkbox.disabled = true;
    checkbox.style.opacity = '0.5';
    checkbox.parentElement.style.opacity = '0.5';
  });
}

// ========== LISTENERS UNIVERSAIS PARA INPUTS ==========

function adicionarListenersUniversais() {
  // Lista de todas as categorias
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
      input.addEventListener('input', function() {
        const temItens = Array.from(inputs).some(inp => (parseInt(inp.value) || 0) > 0);
        
        if (temItens) {
          mostrarBotaoAdicionar(categoria);
        } else {
          esconderBotaoAdicionar(categoria);
        }
      });
    });
  });
}

// ========== OUTRAS FUNÇÕES ==========

function atualizarCarrinho() {
  const itensCount = document.getElementById('itens-count');
  const totalCount = document.getElementById('total-count');
  
  let totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
  let valorTotal = carrinho.reduce((total, item) => total + item.subtotal, 0);
  
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
    return '';
  }
  
  let mensagem = '*🍽️ NOVO PEDIDO - CARDOSO CALDO DE CANA*\n\n';
  mensagem += '📋 *ITENS DO PEDIDO:*\n\n';
  
  let totalGeral = 0;
  let numeroItem = 1;
  
  carrinho.forEach(item => {
    mensagem += `${numeroItem}. ${item.nome}\n`;
    mensagem += `   Qtd: ${item.quantidade} | Valor: R$ ${item.subtotal.toFixed(2)}\n`;
    
    if (item.borda) {
      mensagem += `   🍕 Borda: ${item.borda}\n`;
    }
    
    mensagem += '\n';
    totalGeral += item.subtotal;
    numeroItem++;
  });
  
  mensagem += '━━━━━━━━━━━━━━━━━━━━━━━━\n';
  mensagem += `💰 *TOTAL DO PEDIDO: R$ ${totalGeral.toFixed(2)}*\n\n`;
  mensagem += '📱 _Pedido enviado pelo site_\n';
  mensagem += '🕐 _Aguardando confirmação..._';
  
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

// ========== INICIALIZAÇÃO ==========

document.addEventListener('DOMContentLoaded', () => {
  const allSections = document.querySelectorAll('.categoria');
  allSections.forEach(section => {
    section.style.display = 'none';
  });
  
  const carrinhoFlutuante = document.getElementById('carrinho-flutuante');
  if (carrinhoFlutuante) {
    carrinhoFlutuante.style.display = 'none';
  }
  
  inicializarSistemaBordas();
  adicionarListenersUniversais();
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      fecharCarrinho();
    }
  });
  
  atualizarCarrinho();
  
  console.log('Sistema de carrinho universal inicializado com bordas sequenciais!');
});