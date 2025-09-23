// Sistema de carrinho universal para todas as categorias
let carrinho = [];
let totalCarrinho = 0;

// Controle de estado para pedidos em construção
let pedidoEmConstrucao = {
  ativo: false,
  categoria: null,
  produto: null
};

// Configurações temporárias específicas para pizzas (por seção)
let configuracoesTemporarias = {
  'pizzas-trad': { bordaSelecionada: null, tamanhoBorda: null, querBorda: false },
  'pizzas-especiais': { bordaSelecionada: null, tamanhoBorda: null, querBorda: false },
  'pizzas-doces': { bordaSelecionada: null, tamanhoBorda: null, querBorda: false }
};

// Função principal que abre a categoria desejada
function openCategory(categoryName) {
  if (pedidoEmConstrucao.ativo) {
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
      
      if (item.adicionais && item.adicionais.length > 0) {
        if (!nomeExibicao.includes('(+ ')) {
          nomeExibicao += ` (+ ${item.adicionais.join(', ')})`;
        }
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
  
  const comecaComPizza = nome.toLowerCase().startsWith('pizza');
  const ehPizzaExata = todasPizzas.some(pizza => nome.trim() === pizza.trim());
  
  return comecaComPizza || ehPizzaExata;
}

function getTamanhoPizza(nome) {
  if (nome.includes(' P')) return 'P';
  if (nome.includes(' M')) return 'M';
  if (nome.includes(' G')) return 'G';
  return null;
}

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

// ========== CORREÇÃO PRINCIPAL: FUNÇÃO DE PREÇO DA BORDA ==========
function obterPrecoBorda(tamanho) {
  const precosBorda = { 'P': 8, 'M': 10, 'G': 12 };
  return precosBorda[tamanho] || 0;
}

// ========== SISTEMA DE UMA PIZZA POR VEZ ==========

function limitarUmaPizzaPorVez(secao, inputAtual) {
  const secaoElement = document.querySelector(`.categoria.${secao}`);
  if (!secaoElement) return;
  
  const inputsPizza = secaoElement.querySelectorAll('input[type="number"]:not([data-name*="Borda"])');
  const valorAtual = parseInt(inputAtual.value) || 0;
  
  if (valorAtual > 0) {
    if (valorAtual > 1) {
      inputAtual.value = 1;
    }
    
    inputsPizza.forEach(input => {
      if (input !== inputAtual) {
        input.value = 0;
      }
    });
    
    resetarSistemaBordaPorCompleto(secao);
  }
}

function temPizzaSelecionadaNaSecao(secao) {
  const secaoElement = document.querySelector(`.categoria.${secao}`);
  if (!secaoElement) return false;
  
  const inputsPizza = secaoElement.querySelectorAll('input[type="number"]:not([data-name*="Borda"])');
  return Array.from(inputsPizza).some(input => (parseInt(input.value) || 0) > 0);
}

// ========== SISTEMA UNIVERSAL PARA OUTRAS CATEGORIAS ==========

function adicionarItemAoCarrinho(nome, preco, quantidade, secao = null) {
  if (quantidade <= 0) return;
  
  // Esta função agora é usada apenas para categorias simples (não pizzas/lanches)
  // Pizzas e lanches são processados diretamente em adicionarItensCategoriaAoCarrinho
  
  for (let i = 0; i < quantidade; i++) {
    const novoItem = {
      id: Date.now() + Math.random(),
      nome: nome,
      preco: preco,
      quantidade: 1,
      subtotal: preco,
      categoria: secao
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

// Sistema sequencial para lanches
function iniciarPedidoLanche(produtoInput) {
  const categoria = 'lanches';
  const secaoElement = document.querySelector(`.categoria.${categoria}`);
  if (!secaoElement) return;

  pedidoEmConstrucao.ativo = true;
  pedidoEmConstrucao.categoria = categoria;
  pedidoEmConstrucao.produto = produtoInput.getAttribute('data-name');

  desabilitarOutrosProdutosLanche(categoria, produtoInput);
  habilitarGrupoSequencialLanche(secaoElement, 1);
}

function desabilitarOutrosProdutosLanche(categoriaAtiva, inputAtivo) {
  const secaoElement = document.querySelector(`.categoria.${categoriaAtiva}`);
  if (!secaoElement) return;

  const inputsProdutos = secaoElement.querySelectorAll('input[type="number"][data-name]:not([data-adicional]):not([data-borda])');
  inputsProdutos.forEach(input => {
    if (input !== inputAtivo) {
      input.disabled = true;
      input.setAttribute('aria-disabled', 'true');
    }
  });

  const botoesCategoria = document.querySelectorAll('button[onclick*="openCategory"]');
  botoesCategoria.forEach(botao => {
    if (!botao.onclick?.toString().includes(categoriaAtiva)) {
      botao.disabled = true;
      botao.setAttribute('aria-disabled', 'true');
    }
  });

  const todosAdicionais = secaoElement.querySelectorAll('input[data-adicional], input[data-grupo], .grupo-adicional input, .adicionais input');
  todosAdicionais.forEach(input => {
    input.disabled = true;
    input.setAttribute('aria-disabled', 'true');
  });
}

function habilitarGrupoSequencialLanche(secaoElement, etapa) {
  let seletorGrupo = '';
  
  switch(etapa) {
    case 1:
      seletorGrupo = 'input[data-adicional="true"], input[data-grupo="adicionais"], .grupo-adicional input, .adicionais input[type="checkbox"]';
      break;
    case 2:
      seletorGrupo = 'input[data-grupo="extras"], input[data-grupo="molhos"], .grupo-extras input, .molhos input';
      break;
    case 3:
      seletorGrupo = 'textarea[data-grupo="obs"], input[data-grupo="observacoes"], .observacoes textarea';
      break;
  }

  const elementosGrupo = secaoElement.querySelectorAll(seletorGrupo);
  elementosGrupo.forEach(elemento => {
    elemento.disabled = false;
    elemento.removeAttribute('aria-disabled');
    
    if (etapa < 3) {
      elemento.addEventListener('change', function() {
        const grupoAtual = secaoElement.querySelectorAll(seletorGrupo);
        const temSelecionado = Array.from(grupoAtual).some(el => 
          (el.type === 'checkbox' && el.checked) || 
          (el.type === 'radio' && el.checked) ||
          (el.type === 'number' && parseInt(el.value) > 0) ||
          (el.tagName === 'TEXTAREA' && el.value.trim().length > 0)
        );
        
        if (temSelecionado) {
          setTimeout(() => habilitarGrupoSequencialLanche(secaoElement, etapa + 1), 100);
        }
      }, { once: true });
    }
  });
}

// Sistema sequencial para pizzas
function iniciarPedidoPizza(produtoInput, secao) {
  const secaoElement = document.querySelector(`.categoria.${secao}`);
  if (!secaoElement) return;

  pedidoEmConstrucao.ativo = true;
  pedidoEmConstrucao.categoria = secao;
  pedidoEmConstrucao.produto = produtoInput.getAttribute('data-name');

  desabilitarOutrosProdutosPizza(secao, produtoInput);
  habilitarTamanhosExclusivos(secaoElement, produtoInput);
}

function desabilitarOutrosProdutosPizza(secao, inputAtivo) {
  const secaoElement = document.querySelector(`.categoria.${secao}`);
  if (!secaoElement) return;

  const inputsPizza = secaoElement.querySelectorAll('input[type="number"]:not([data-name*="Borda"])');
  inputsPizza.forEach(input => {
    if (input !== inputAtivo) {
      input.disabled = true;
      input.setAttribute('aria-disabled', 'true');
    }
  });

  resetarSistemaBordaPorCompleto(secao);
  
  const botoesCategoria = document.querySelectorAll('button[onclick*="openCategory"]');
  botoesCategoria.forEach(botao => {
    const categoriaBotao = botao.onclick?.toString().match(/openCategory\('([^']+)'\)/)?.[1];
    if (categoriaBotao && categoriaBotao !== secao) {
      botao.disabled = true;
      botao.setAttribute('aria-disabled', 'true');
    }
  });
}

function habilitarTamanhosExclusivos(secaoElement, produtoAtivo) {
  const nomeProduto = produtoAtivo.getAttribute('data-name');
  const inputsTamanho = secaoElement.querySelectorAll(`input[data-name*="${nomeProduto.split(' ')[0]}"]`);
  const tamanhosDisponiveis = ['P', 'M', 'G'];
  
  tamanhosDisponiveis.forEach(tamanho => {
    const inputTamanho = Array.from(inputsTamanho).find(input => 
      input.getAttribute('data-name').includes(` ${tamanho}`)
    );
    
    if (inputTamanho) {
      inputTamanho.disabled = false;
      inputTamanho.removeAttribute('aria-disabled');
      
      inputTamanho.addEventListener('input', function() {
        const valor = parseInt(this.value) || 0;
        
        if (valor > 0) {
          if (valor > 1) this.value = 1;
          
          tamanhosDisponiveis.forEach(outroTamanho => {
            if (outroTamanho !== tamanho) {
              const outroInput = Array.from(inputsTamanho).find(input => 
                input.getAttribute('data-name').includes(` ${outroTamanho}`)
              );
              if (outroInput) {
                outroInput.disabled = true;
                outroInput.setAttribute('aria-disabled', 'true');
                outroInput.value = 0;
              }
            }
          });
          
          setTimeout(() => habilitarCheckboxBorda(secaoElement), 100);
        }
      });
    }
  });
}

function habilitarCheckboxBorda(secaoElement) {
  const checkboxQuerBorda = secaoElement.querySelector('#quer-borda');
  if (checkboxQuerBorda) {
    checkboxQuerBorda.disabled = false;
    checkboxQuerBorda.removeAttribute('aria-disabled');
    
    checkboxQuerBorda.addEventListener('change', function() {
      if (this.checked) {
        setTimeout(() => habilitarTamanhosBorda(secaoElement), 100);
      } else {
        resetarSistemaBorda(secaoElement);
      }
    }, { once: false });
  }
}

function habilitarTamanhosBorda(secaoElement) {
  const tamanhoPizzaSelecionada = getTamanhoPizzaSelecionadaNaSecao(
    secaoElement.className.includes('pizzas-trad') ? 'pizzas-trad' :
    secaoElement.className.includes('pizzas-especiais') ? 'pizzas-especiais' : 'pizzas-doces'
  );
  
  if (!tamanhoPizzaSelecionada) return;
  
  const inputsBorda = secaoElement.querySelectorAll('input[data-name*="Borda"]');
  inputsBorda.forEach(input => {
    const nomeBorda = input.getAttribute('data-name');
    const ehTamanhoCorreto = nomeBorda.includes(`Borda ${tamanhoPizzaSelecionada}`);
    
    if (ehTamanhoCorreto) {
      input.disabled = false;
      input.removeAttribute('aria-disabled');
      
      input.addEventListener('input', function() {
        const valor = parseInt(this.value) || 0;
        if (valor > 0) {
          if (valor > 1) this.value = 1;
          
          inputsBorda.forEach(outro => {
            if (outro !== this && !outro.disabled) {
              outro.value = 0;
            }
          });
          
          setTimeout(() => habilitarSaboresBorda(secaoElement), 100);
        } else {
          desabilitarSaboresBorda(secaoElement);
        }
      });
    } else {
      input.disabled = true;
      input.setAttribute('aria-disabled', 'true');
      input.value = 0;
    }
  });
}

function habilitarSaboresBorda(secaoElement) {
  const checkboxesSabor = secaoElement.querySelectorAll('.sabor-borda input[type="checkbox"], [data-sabor-borda] input[type="checkbox"]');
  checkboxesSabor.forEach(checkbox => {
    checkbox.disabled = false;
    checkbox.removeAttribute('aria-disabled');
    
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        checkboxesSabor.forEach(outro => {
          if (outro !== this) outro.checked = false;
        });
      }
    });
  });
}

function desabilitarSaboresBorda(secaoElement) {
  const checkboxesSabor = secaoElement.querySelectorAll('.sabor-borda input[type="checkbox"], [data-sabor-borda] input[type="checkbox"]');
  checkboxesSabor.forEach(checkbox => {
    checkbox.disabled = true;
    checkbox.setAttribute('aria-disabled', 'true');
    checkbox.checked = false;
  });
}

function resetarSistemaBorda(secaoElement) {
  const inputsBorda = secaoElement.querySelectorAll('input[data-name*="Borda"]');
  inputsBorda.forEach(input => {
    input.disabled = true;
    input.setAttribute('aria-disabled', 'true');
    input.value = 0;
  });
  
  desabilitarSaboresBorda(secaoElement);
}

function mostrarMensagemInline(mensagem) {
  const mensagemExistente = document.querySelector('.mensagem-inline');
  if (mensagemExistente) {
    mensagemExistente.remove();
  }

  const divMensagem = document.createElement('div');
  divMensagem.className = 'mensagem-inline';
  divMensagem.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #ff6b6b;
    color: white;
    padding: 12px 24px;
    border-radius: 25px;
    font-weight: 600;
    z-index: 9999;
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
    animation: slideDown 0.3s ease;
  `;
  divMensagem.textContent = mensagem;

  document.body.appendChild(divMensagem);

  setTimeout(() => {
    if (divMensagem && divMensagem.parentNode) {
      divMensagem.remove();
    }
  }, 4000);
}

function resetarPedidoEmConstrucao() {
  pedidoEmConstrucao.ativo = false;
  pedidoEmConstrucao.categoria = null;
  pedidoEmConstrucao.produto = null;

  const todosInputs = document.querySelectorAll('input[disabled], button[disabled], select[disabled]');
  todosInputs.forEach(elemento => {
    elemento.disabled = false;
    elemento.removeAttribute('aria-disabled');
  });

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

  const radios = document.querySelectorAll('input[type="radio"]');
  radios.forEach(radio => {
    if (!radio.closest('#carrinho-painel')) {
      radio.checked = false;
    }
  });

  const secaoLanches = document.querySelector('.categoria.lanches');
  if (secaoLanches) {
    const adicionaisLanche = secaoLanches.querySelectorAll('input[type="checkbox"], input[data-adicional], .adicionais input, .grupo-adicional input, input[data-grupo="adicionais"]');
    adicionaisLanche.forEach(adicional => {
      adicional.disabled = true;
      adicional.setAttribute('aria-disabled', 'true');
      adicional.checked = false;
    });
  }
}

function adicionarItensCategoriaAoCarrinho(nomeCategoria) {
  const secaoElement = document.querySelector(`.categoria.${nomeCategoria}`);
  if (!secaoElement) return;
  
  if (nomeCategoria === 'lanches') {
    const inputsProdutos = secaoElement.querySelectorAll('input[type="number"]:not([data-name*="Borda"]):not([data-adicional])');
    let itensAdicionados = 0;
    
    inputsProdutos.forEach(inputProduto => {
      const quantidade = parseInt(inputProduto.value) || 0;
      if (quantidade > 0) {
        const nomeProduto = inputProduto.getAttribute('data-name');
        let precoProduto = parseFloat(inputProduto.getAttribute('data-price')) || 0;
        
        const adicionaisSelecionados = secaoElement.querySelectorAll('input[type="checkbox"]:checked, input[data-adicional]:checked, .adicionais input:checked, .grupo-adicional input:checked');
        let valorAdicionais = 0;
        let nomeAdicionais = [];
        
        adicionaisSelecionados.forEach(adicional => {
          const precoAdicional = parseFloat(adicional.getAttribute('data-price')) || 0;
          const nomeAdicional = adicional.getAttribute('data-name') || adicional.value || adicional.nextElementSibling?.textContent || 'Adicional';
          
          valorAdicionais += precoAdicional;
          nomeAdicionais.push(nomeAdicional);
        });
        
        const precoFinal = precoProduto + valorAdicionais;
        
        let nomeFinal = nomeProduto;
        if (nomeAdicionais.length > 0) {
          nomeFinal += ` (+ ${nomeAdicionais.join(', ')})`;
        }
        
        if (nomeFinal && !isNaN(precoFinal)) {
          for (let i = 0; i < quantidade; i++) {
            const novoItem = {
              id: Date.now() + Math.random(),
              nome: nomeFinal,
              preco: precoFinal,
              quantidade: 1,
              subtotal: precoFinal,
              categoria: nomeCategoria,
              adicionais: nomeAdicionais.length > 0 ? nomeAdicionais : null
            };
            
            carrinho.push(novoItem);
          }
          
          itensAdicionados += quantidade;
          inputProduto.value = 0;
          
          adicionaisSelecionados.forEach(adicional => {
            adicional.checked = false;
          });
        }
      }
    });
    
    if (itensAdicionados > 0) {
      resetarPedidoEmConstrucao();
      alert(`${itensAdicionados} lanche(s) adicionado(s) ao carrinho com adicionais!`);
      esconderBotaoAdicionar(nomeCategoria);
      atualizarCarrinho();
    } else {
      alert('Selecione pelo menos um lanche para adicionar ao carrinho.');
    }
    
    return;
  }
  
  // LÓGICA PARA PIZZAS - COMPLETAMENTE REFEITA
  if (['pizzas-trad', 'pizzas-especiais', 'pizzas-doces'].includes(nomeCategoria)) {
    const inputsPizza = secaoElement.querySelectorAll('input[type="number"]:not([data-name*="Borda"])');
    let itensAdicionados = 0;
    
    inputsPizza.forEach(inputPizza => {
      const quantidade = parseInt(inputPizza.value) || 0;
      if (quantidade > 0) {
        const nomePizza = inputPizza.getAttribute('data-name');
        let precoPizza = parseFloat(inputPizza.getAttribute('data-price')) || 0;
        
        console.log(`🍕 Processando pizza: ${nomePizza} - R$ ${precoPizza}`);
        
        // VERIFICAR SE TEM BORDA SELECIONADA
        const checkboxQuerBorda = secaoElement.querySelector('#quer-borda');
        let valorBorda = 0;
        let nomeBorda = null;
        
        if (checkboxQuerBorda && checkboxQuerBorda.checked) {
          console.log('✅ Cliente quer borda');
          
          // Encontrar input de borda com quantidade > 0
          const inputsBorda = secaoElement.querySelectorAll('input[data-name*="Borda"]');
          const bordaSelecionada = Array.from(inputsBorda).find(inp => parseInt(inp.value) > 0);
          
          if (bordaSelecionada) {
            // Encontrar sabor selecionado
            const checkboxesSabor = secaoElement.querySelectorAll('.sabor-borda input[type="checkbox"]:checked');
            const saborSelecionado = Array.from(checkboxesSabor).find(cb => cb.checked);
            
            if (saborSelecionado) {
              const tamanhoPizza = getTamanhoPizza(nomePizza);
              valorBorda = obterPrecoBorda(tamanhoPizza);
              nomeBorda = saborSelecionado.value;
              
              console.log(`🍞 Borda encontrada: ${nomeBorda} (${tamanhoPizza}) - R$ ${valorBorda}`);
            }
          }
        }
        
        // CALCULAR PREÇO FINAL
        const precoFinal = precoPizza + valorBorda;
        
        // CRIAR NOME FINAL (igual aos lanches)
        let nomeFinal = nomePizza;
        if (nomeBorda) {
          nomeFinal += ` (+ Borda ${nomeBorda})`;
        }
        
        console.log(`💰 Pizza final: ${nomeFinal} - R$ ${precoFinal}`);
        
        if (nomeFinal && !isNaN(precoFinal)) {
          // Adicionar cada pizza individual ao carrinho
          for (let i = 0; i < quantidade; i++) {
            const novoItem = {
              id: Date.now() + Math.random(),
              nome: nomeFinal,
              preco: precoFinal,
              quantidade: 1,
              subtotal: precoFinal,
              categoria: nomeCategoria,
              borda: nomeBorda // Manter para compatibilidade
            };
            
            carrinho.push(novoItem);
          }
          
          itensAdicionados += quantidade;
          inputPizza.value = 0;
        }
      }
    });
    
    if (itensAdicionados > 0) {
      resetarPedidoEmConstrucao();
      resetarSistemaBordaPorCompleto(nomeCategoria);
      alert(`${itensAdicionados} pizza(s) adicionada(s) ao carrinho!`);
      esconderBotaoAdicionar(nomeCategoria);
      atualizarCarrinho();
    } else {
      alert('Selecione pelo menos uma pizza para adicionar ao carrinho.');
    }
    
    return;
  }
  
  // LÓGICA PARA OUTRAS CATEGORIAS (hamburguer, porções, etc.)
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
        input.value = 0;
      }
    }
  });
  
  if (itensAdicionados > 0) {
    resetarPedidoEmConstrucao();
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

function resetarSistemaBordaPorCompleto(secao) {
  const secaoElement = document.querySelector(`.categoria.${secao}`);
  if (!secaoElement) return;
  
  // CORREÇÃO: Resetar configuração temporal
  if (configuracoesTemporarias[secao]) {
    configuracoesTemporarias[secao] = {
      bordaSelecionada: null,
      tamanhoBorda: null,
      querBorda: false
    };
  }
  
  const checkboxQuerBorda = secaoElement.querySelector('#quer-borda');
  if (checkboxQuerBorda) {
    checkboxQuerBorda.checked = false;
    checkboxQuerBorda.disabled = true;
    checkboxQuerBorda.setAttribute('aria-disabled', 'true');
  }
  
  const inputsBorda = secaoElement.querySelectorAll('input[data-name*="Borda"]');
  inputsBorda.forEach(input => {
    input.value = 0;
    input.disabled = true;
    input.setAttribute('aria-disabled', 'true');
  });
  
  const checkboxesSabor = secaoElement.querySelectorAll('.sabor-borda input[type="checkbox"]');
  checkboxesSabor.forEach(checkbox => {
    checkbox.checked = false;
    checkbox.disabled = true;
    checkbox.setAttribute('aria-disabled', 'true');
  });
}

// ========== SISTEMA DE BORDAS CORRIGIDO ==========

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
    
    // ESTADO INICIAL - Tudo desabilitado
    resetarSistemaBordaPorCompleto(secao);
    
    // Desabilitar inicialmente todos os adicionais para lanches
    if (secao === 'lanches') {
      const todosAdicionais = secaoElement.querySelectorAll('input[type="checkbox"], input[data-adicional], .adicionais input, .grupo-adicional input');
      todosAdicionais.forEach(input => {
        input.disabled = true;
        input.setAttribute('aria-disabled', 'true');
        input.checked = false;
      });
    }
    
    // Aplicar limites máximos
    inputsBordaTamanho.forEach(input => {
      input.setAttribute('max', '1');
      input.setAttribute('min', '0');
    });
    
    inputsPizza.forEach(input => {
      input.setAttribute('max', '1');
      input.setAttribute('min', '0');
    });
    
    // STEP 1: Monitorar inputs de pizza
    inputsPizza.forEach(input => {
      input.addEventListener('input', function() {
        const quantidade = parseInt(this.value) || 0;
        
        if (quantidade > 0 && !pedidoEmConstrucao.ativo) {
          iniciarPedidoPizza(this, secao);
          
          setTimeout(() => {
            if (checkboxQuerBorda && temPizzaSelecionadaNaSecao(secao)) {
              checkboxQuerBorda.disabled = false;
              checkboxQuerBorda.removeAttribute('aria-disabled');
            }
          }, 50);
          
          return;
        } else if (quantidade > 0 && pedidoEmConstrucao.ativo && pedidoEmConstrucao.produto !== this.getAttribute('data-name')) {
          this.value = 0;
          mostrarMensagemInline('Finalize o pedido atual antes de iniciar outro');
          return;
        } else if (quantidade === 0 && pedidoEmConstrucao.ativo && pedidoEmConstrucao.produto === this.getAttribute('data-name')) {
          resetarPedidoEmConstrucao();
          resetarSistemaBordaPorCompleto(secao);
          return;
        }

        if (quantidade > 0) {
          limitarUmaPizzaPorVez(secao, this);
          
          const temPizza = temPizzaSelecionadaNaSecao(secao);
          
          if (checkboxQuerBorda && temPizza) {
            checkboxQuerBorda.disabled = false;
            checkboxQuerBorda.removeAttribute('aria-disabled');
          }
        } else {
          if (checkboxQuerBorda) {
            checkboxQuerBorda.disabled = true;
            checkboxQuerBorda.setAttribute('aria-disabled', 'true');
            checkboxQuerBorda.checked = false;
          }
          resetarSistemaBordaPorCompleto(secao);
        }
      });
    });
    
    // STEP 2: Checkbox "quer borda" - CORRIGIDO
    if (checkboxQuerBorda) {
      checkboxQuerBorda.addEventListener('change', function() {
        config.querBorda = this.checked;
        
        if (config.querBorda) {
          const tamanhoPizza = getTamanhoPizzaSelecionadaNaSecao(secao);
          
          if (tamanhoPizza) {
            inputsBordaTamanho.forEach(input => {
              const nomeBorda = input.getAttribute('data-name');
              const ehTamanhoCorreto = nomeBorda.includes(`Borda ${tamanhoPizza}`);
              
              if (ehTamanhoCorreto) {
                input.disabled = false;
                input.removeAttribute('aria-disabled');
                input.setAttribute('max', '1');
              } else {
                input.disabled = true;
                input.setAttribute('aria-disabled', 'true');
                input.value = 0;
              }
            });
          }
        } else {
          inputsBordaTamanho.forEach(input => {
            input.disabled = true;
            input.setAttribute('aria-disabled', 'true');
            input.value = 0;
          });
          
          checkboxesSaborBorda.forEach(checkbox => {
            checkbox.disabled = true;
            checkbox.setAttribute('aria-disabled', 'true');
            checkbox.checked = false;
          });
          
          config.tamanhoBorda = null;
          config.bordaSelecionada = null;
        }
      });
    }
    
    // STEP 3: Inputs de tamanho da borda
    inputsBordaTamanho.forEach(input => {
      input.addEventListener('input', function() {
        let quantidade = parseInt(this.value) || 0;
        
        if (quantidade > 1) {
          quantidade = 1;
          this.value = 1;
        }
        
        const nomeBorda = this.getAttribute('data-name');
        let tamanho = '';
        
        if (nomeBorda.includes('Borda P')) tamanho = 'P';
        else if (nomeBorda.includes('Borda M')) tamanho = 'M';
        else if (nomeBorda.includes('Borda G')) tamanho = 'G';
        
        if (quantidade > 0) {
          inputsBordaTamanho.forEach(outroInput => {
            if (outroInput !== this && !outroInput.disabled) {
              outroInput.value = 0;
            }
          });
          
          config.tamanhoBorda = tamanho;
          
          checkboxesSaborBorda.forEach(checkbox => {
            checkbox.disabled = false;
            checkbox.removeAttribute('aria-disabled');
          });
        } else {
          config.tamanhoBorda = null;
          config.bordaSelecionada = null;
          
          checkboxesSaborBorda.forEach(checkbox => {
            checkbox.disabled = true;
            checkbox.setAttribute('aria-disabled', 'true');
            checkbox.checked = false;
          });
        }
      });
    });
    
    // STEP 4: Sabores de borda (apenas um por vez)
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

// ========== LISTENERS UNIVERSAIS PARA INPUTS ==========

function adicionarListenersUniversais() {
  const categorias = [
    'lanches', 'hamburguer', 'tabuas', 'torre-batata', 'porções',
    'pizzas-trad', 'pizzas-especiais', 'pizzas-doces', 
    'cervejas', 'bebidas', 'caipirinhas', 'acai'
  ];
  
  categorias.forEach(categoria => {
    criarBotaoAdicionarUniversal(categoria);
    
    const secaoElement = document.querySelector(`.categoria.${categoria}`);
    if (!secaoElement) return;
    
    if (categoria === 'lanches') {
      const todosAdicionais = secaoElement.querySelectorAll('input[type="checkbox"], input[data-adicional], .adicionais input, .grupo-adicional input, input[data-grupo="adicionais"]');
      todosAdicionais.forEach(input => {
        input.disabled = true;
        input.setAttribute('aria-disabled', 'true');
        input.checked = false;
      });
    }
    
    const inputs = secaoElement.querySelectorAll('input[type="number"]:not([data-name*="Borda"])');
    const ehCategoriaPizza = ['pizzas-trad', 'pizzas-especiais', 'pizzas-doces'].includes(categoria);
    const ehCategoriaLanche = categoria === 'lanches';
    
    inputs.forEach(input => {
      input.addEventListener('input', function() {
        if (ehCategoriaLanche) {
          const quantidade = parseInt(this.value) || 0;
          
          if (quantidade > 0 && !pedidoEmConstrucao.ativo) {
            iniciarPedidoLanche(this);
            
            setTimeout(() => {
              const adicionaisLanche = secaoElement.querySelectorAll('input[type="checkbox"], input[data-adicional], .adicionais input, .grupo-adicional input, input[data-grupo="adicionais"]');
              adicionaisLanche.forEach(adicional => {
                adicional.disabled = false;
                adicional.removeAttribute('aria-disabled');
              });
            }, 50);
            
          } else if (quantidade > 0 && pedidoEmConstrucao.ativo && pedidoEmConstrucao.produto !== this.getAttribute('data-name')) {
            this.value = 0;
            mostrarMensagemInline('Finalize o pedido atual antes de iniciar outro');
            return;
          }
          
          if (quantidade > 0) {
            mostrarBotaoAdicionar(categoria);
          } else if (pedidoEmConstrucao.ativo && pedidoEmConstrucao.produto === this.getAttribute('data-name')) {
            const adicionaisLanche = secaoElement.querySelectorAll('input[type="checkbox"], input[data-adicional], .adicionais input, .grupo-adicional input, input[data-grupo="adicionais"]');
            adicionaisLanche.forEach(adicional => {
              adicional.disabled = true;
              adicional.setAttribute('aria-disabled', 'true');
              adicional.checked = false;
            });
            
            resetarPedidoEmConstrucao();
            esconderBotaoAdicionar(categoria);
          }
        } else if (ehCategoriaPizza) {
          const temItens = temPizzaSelecionadaNaSecao(categoria);
          
          if (temItens) {
            mostrarBotaoAdicionar(categoria);
          } else {
            esconderBotaoAdicionar(categoria);
          }
        } else {
          const quantidade = parseInt(this.value) || 0;
          
          if (quantidade > 0 && pedidoEmConstrucao.ativo && pedidoEmConstrucao.categoria !== categoria) {
            this.value = 0;
            mostrarMensagemInline('Finalize o pedido atual antes de mudar de categoria');
            return;
          }
          
          const temItens = Array.from(inputs).some(inp => (parseInt(inp.value) || 0) > 0);
          
          if (temItens) {
            mostrarBotaoAdicionar(categoria);
          } else {
            esconderBotaoAdicionar(categoria);
          }
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
    let nomeItem = item.nome;
    
    if (isPizza(item.nome) && !nomeItem.toLowerCase().includes('pizza')) {
      nomeItem = `Pizza ${nomeItem}`;
    }
    
    mensagem += `${numeroItem}. ${nomeItem}\n`;
    mensagem += `   Qtd: ${item.quantidade} | Valor: R$ ${item.subtotal.toFixed(2)}\n`;
    
    if (item.borda) {
      mensagem += `   🍕 Borda: ${item.borda}\n`;
    }
    
    if (item.adicionais && item.adicionais.length > 0) {
      mensagem += `   🍔 Adicionais: ${item.adicionais.join(', ')}\n`;
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

function addToFloatingCart(item) {
  if (typeof adicionarItemAoCarrinho === 'function') {
    adicionarItemAoCarrinho(item.nome, item.preco, item.quantidade, item.categoria);
  } else {
    carrinho.push(item);
    atualizarCarrinho();
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
  `;
  document.head.appendChild(style);
  
  inicializarSistemaBordas();
  adicionarListenersUniversais();
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      fecharCarrinho();
      if (pedidoEmConstrucao.ativo) {
        resetarPedidoEmConstrucao();
        mostrarMensagemInline('Pedido cancelado');
      }
    }
  });
  
  atualizarCarrinho();
});