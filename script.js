import { MENU_DATA, PIZZA_DATA, WHATSAPP_NUMBER } from './product.js';

// ========== CONFIGURAÇÃO ==========
const CONFIG = {
  storageKey: 'cardoso_cart_v1',
  whatsappNumber: WHATSAPP_NUMBER,
  maxPizzaFlavors: 2,
  maxFreeAcaiOptions: 2,
  storageQuotaLimit: 4.5 * 1024 * 1024 // 4.5MB (segurança antes do limite de 5MB)
};

// ========== UTILITÁRIOS ==========
const utils = {
  // Formata preço para exibição
  formatPrice(price) {
    if (typeof price !== 'number' || isNaN(price)) return '0,00';
    return price.toFixed(2).replace('.', ',');
  },

  // Gera ID único para item do carrinho
  generateUniqueId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Normaliza string para comparação
  normalize(str) {
    if (!str) return '';
    return str.toLowerCase().trim().replace(/\s+/g, '-');
  },

  // Gera data-item-id padronizado
  generateItemId(category, productId, size = null) {
    const normalized = `${this.normalize(category)}__${this.normalize(productId)}`;
    return size ? `${normalized}__${this.normalize(size)}` : normalized;
  },

  // Mostra toast de notificação
  showToast(message, duration = 3000) {
    // Remove toasts anteriores
    document.querySelectorAll('.toast').forEach(t => t.remove());
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, duration);
  },

  // Atualiza mensagem de acessibilidade
  announceToScreenReader(message) {
    const liveRegion = document.getElementById('cart-live');
    if (liveRegion) {
      liveRegion.textContent = message;
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  },

  // Valida campos do formulário
  validateFormFields(fields) {
    const emptyFields = [];
    
    fields.forEach(field => {
      const element = document.getElementById(field.id);
      if (element && field.required && !element.value.trim()) {
        emptyFields.push(field.name);
        element.classList.add('field-error');
        element.focus();
      } else if (element) {
        element.classList.remove('field-error');
      }
    });
    
    return emptyFields;
  },

  // Verifica se localStorage tem espaço
  checkStorageQuota() {
    try {
      const testKey = '_quota_test_';
      const testData = new Array(1000).join('a');
      localStorage.setItem(testKey, testData);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
};

// ========== GERENCIADOR DE CATEGORIAS ==========
const categoryManager = {
  currentCategory: null,

  // Renderiza todas as categorias
  renderCategories() {
    console.log('🎨 Renderizando categorias...');
    const container = document.getElementById('categories-container');
    
    // Renderiza categorias normais
    Object.entries(MENU_DATA).forEach(([categoryId, categoryData]) => {
      const categoryEl = this.createCategoryElement(categoryId, categoryData, false);
      container.appendChild(categoryEl);
    });

    // Renderiza categorias de pizza
    Object.entries(PIZZA_DATA).forEach(([categoryId, categoryData]) => {
      const categoryEl = this.createCategoryElement(categoryId, categoryData, true);
      container.appendChild(categoryEl);
    });

    console.log('✅ Categorias renderizadas');
  },

  // Cria elemento de categoria
  createCategoryElement(categoryId, categoryData, isPizza) {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category';
    categoryDiv.id = `category-${categoryId}`;
    categoryDiv.setAttribute('data-category', categoryId);

    // Imagem da categoria
    const img = document.createElement('img');
    img.src = categoryData.image;
    img.alt = categoryData.name;
    img.className = 'category-img';
    categoryDiv.appendChild(img);

    // Lista de produtos
    const list = document.createElement('ul');
    list.className = 'category-list';

    if (isPizza) {
      this.renderPizzaCategory(list, categoryId, categoryData);
    } else {
      this.renderNormalCategory(list, categoryId, categoryData);
    }

    categoryDiv.appendChild(list);
    return categoryDiv;
  },

  // Renderiza categoria normal
  renderNormalCategory(list, categoryId, categoryData) {
    categoryData.items.forEach(item => {
      const li = this.createProductItem(categoryId, item, categoryData);
      list.appendChild(li);
    });
  },

  // Renderiza categoria de pizza
  renderPizzaCategory(list, categoryId, categoryData) {
    const li = document.createElement('li');
    li.className = 'category-item';
    
    const pizzaBaseId = utils.generateItemId(categoryId, 'pizza');
    
    li.innerHTML = `
      <div class="item-header">
        <div class="item-name">${categoryData.name}</div>
        <div class="item-description">Escolha o tamanho e até 2 sabores</div>
      </div>
      <div class="item-controls">
        <div class="size-selector">
          <span class="size-label">Tamanho:</span>
          <select class="size-select" data-pizza-category="${categoryId}" aria-label="Selecione o tamanho da pizza">
            <option value="">Selecione</option>
            <option value="P" data-price="${categoryData.basePrice.P}">P - R$ ${utils.formatPrice(categoryData.basePrice.P)}</option>
            <option value="M" data-price="${categoryData.basePrice.M}">M - R$ ${utils.formatPrice(categoryData.basePrice.M)}</option>
            <option value="G" data-price="${categoryData.basePrice.G}">G - R$ ${utils.formatPrice(categoryData.basePrice.G)}</option>
          </select>
        </div>
      </div>
      <div class="options-group pizza-flavors" style="display:none;">
        <div class="options-title">Sabores (escolha até 2):</div>
        ${categoryData.flavors.map((flavor, idx) => `
          <label class="option-item" for="flavor-${categoryId}-${idx}">
            <input type="checkbox" 
                   id="flavor-${categoryId}-${idx}"
                   class="option-checkbox pizza-flavor-checkbox" 
                   data-flavor="${flavor}" 
                   disabled
                   aria-label="Sabor ${flavor}">
            <span class="option-label">${flavor}</span>
          </label>
        `).join('')}
      </div>
      <div class="options-group pizza-border" style="display:none;">
        <div class="options-title">Borda recheada (opcional):</div>
        <select class="border-select" data-category="${categoryId}" disabled aria-label="Selecione a borda">
          <option value="">Sem borda</option>
          ${categoryData.borderFlavors.map(border => `
            <option value="${border}">${border}</option>
          `).join('')}
        </select>
      </div>
      <div class="item-controls">
        <div class="quantidade">
          <button class="menos" data-item-id="${pizzaBaseId}" data-is-pizza="true" data-pizza-category="${categoryId}" disabled aria-label="Diminuir quantidade">-</button>
          <span class="valor" data-item-id="${pizzaBaseId}" role="status" aria-live="polite">0</span>
          <button class="mais" data-item-id="${pizzaBaseId}" data-is-pizza="true" data-pizza-category="${categoryId}" disabled aria-label="Aumentar quantidade">+</button>
        </div>
      </div>
    `;
    list.appendChild(li);
  },

  // Cria item de produto
  createProductItem(categoryId, item, categoryData) {
    const li = document.createElement('li');
    li.className = 'category-item';

    const hasSizes = item.sizes && item.sizes.length > 0;
    const itemId = hasSizes ? null : utils.generateItemId(categoryId, item.id);
    const isAcai = categoryId === 'acai';

    let html = `
      <div class="item-header">
        <div class="item-name">${item.name}</div>
        ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
      </div>
      <div class="item-controls">
    `;

    // Se tem tamanhos
    if (hasSizes) {
      html += `<div class="size-selector">`;
      item.sizes.forEach((sizeObj, idx) => {
        const sizeItemId = utils.generateItemId(categoryId, item.id, sizeObj.size);
        html += `
          <label class="size-option" for="size-${categoryId}-${item.id}-${idx}">
            <input type="radio" 
                   id="size-${categoryId}-${item.id}-${idx}"
                   name="size-${categoryId}-${item.id}" 
                   value="${sizeObj.size}" 
                   data-price="${sizeObj.price}"
                   data-item-id="${sizeItemId}"
                   aria-label="Tamanho ${sizeObj.size} - R$ ${utils.formatPrice(sizeObj.price)}">
            <span>${sizeObj.size} - R$ ${utils.formatPrice(sizeObj.price)}</span>
          </label>
        `;
      });
      html += `</div>`;
    } else {
      html += `<div class="item-price">R$ ${utils.formatPrice(item.price)}</div>`;
    }

    // Controles de quantidade com botões
    html += `
        <div class="quantidade">
          <button class="menos" ${itemId ? `data-item-id="${itemId}"` : 'disabled'} aria-label="Diminuir quantidade">-</button>
          <span class="valor" ${itemId ? `data-item-id="${itemId}"` : ''} role="status" aria-live="polite">0</span>
          <button class="mais" ${itemId ? `data-item-id="${itemId}"` : 'disabled'} aria-label="Aumentar quantidade">+</button>
        </div>
      </div>
    `;

    // Opções de remoção (usa classe remove-option)
    if (item.removable && item.removable.length > 0) {
      html += `
        <div class="options-group">
          <div class="options-title">Remover ingredientes:</div>
          ${item.removable.map((ing, idx) => `
            <label class="option-item" for="remove-${categoryId}-${item.id}-${idx}">
              <input type="checkbox" 
                     id="remove-${categoryId}-${item.id}-${idx}"
                     class="option-checkbox remove-option" 
                     value="${ing}" 
                     disabled
                     aria-label="Remover ${ing}">
              <span class="option-label">${ing}</span>
            </label>
          `).join('')}
        </div>
      `;
    }

    // Opções grátis do açaí (usa classe acai-included)
    if (item.freeItems && item.freeItems.length > 0) {
      html += `
        <div class="options-group">
          <div class="options-title">Incluso (escolha ${item.freeOptions}):</div>
          ${item.freeItems.map((free, idx) => `
            <label class="option-item" for="acai-${categoryId}-${item.id}-${idx}">
              <input type="checkbox" 
                     id="acai-${categoryId}-${item.id}-${idx}"
                     class="option-checkbox acai-included" 
                     value="${free}" 
                     data-max="${item.freeOptions}"
                     disabled
                     aria-label="Incluir ${free}">
              <span class="option-label">${free}</span>
            </label>
          `).join('')}
        </div>
      `;
    }

    // Extras pagos
    if (categoryData.extras && categoryData.extras.length > 0) {
      html += `
        <div class="options-group">
          <div class="options-title">Adicionais:</div>
          ${categoryData.extras.map((extra, idx) => `
            <label class="option-item" for="extra-${categoryId}-${item.id}-${idx}">
              <input type="checkbox" 
                     id="extra-${categoryId}-${item.id}-${idx}"
                     class="option-checkbox extra-item" 
                     value="${extra.name}" 
                     data-price="${extra.price}" 
                     disabled
                     aria-label="${extra.name} - mais R$ ${utils.formatPrice(extra.price)}">
              <span class="option-label">${extra.name} (+R$ ${utils.formatPrice(extra.price)})</span>
            </label>
          `).join('')}
        </div>
      `;
    }

    // Frutas do açaí
    if (categoryData.fruits && categoryData.fruits.length > 0) {
      html += `
        <div class="options-group">
          <div class="options-title">Frutas:</div>
          ${categoryData.fruits.map((fruit, idx) => `
            <label class="option-item" for="fruit-${categoryId}-${item.id}-${idx}">
              <input type="checkbox" 
                     id="fruit-${categoryId}-${item.id}-${idx}"
                     class="option-checkbox extra-item" 
                     value="${fruit.name}" 
                     data-price="${fruit.price}" 
                     disabled
                     aria-label="${fruit.name} - mais R$ ${utils.formatPrice(fruit.price)}">
              <span class="option-label">${fruit.name} (+R$ ${utils.formatPrice(fruit.price)})</span>
            </label>
          `).join('')}
        </div>
      `;
    }

    li.innerHTML = html;
    return li;
  },

  // Mostra uma categoria específica
  showCategory(categoryId) {
    console.log('📂 Mostrando categoria:', categoryId);
    
    // Esconde todas
    document.querySelectorAll('.category').forEach(cat => {
      cat.classList.remove('active');
    });

    // Remove active dos botões
    document.querySelectorAll('.menu-btn').forEach(btn => {
      btn.classList.remove('active-category');
    });

    // Mostra a selecionada
    const category = document.getElementById(`category-${categoryId}`);
    if (category) {
      category.classList.add('active');
      this.currentCategory = categoryId;
      
      // Marca botão como ativo
      const activeBtn = document.querySelector(`.menu-btn[data-category="${categoryId}"]`);
      if (activeBtn) {
        activeBtn.classList.add('active-category');
      }
      
      console.log('✅ Categoria ativa:', categoryId);
    }
  }
};

// ========== GERENCIADOR DE PEDIDOS ==========
const orderManager = {
  currentOrder: null,
  activeItemId: null,

  // Inicia um novo pedido
  startOrder(itemId, categoryId) {
    console.log('🛒 Iniciando pedido:', itemId);
    
    if (this.currentOrder && this.currentOrder.itemId !== itemId) {
      utils.showToast('⚠️ Finalize o pedido atual antes de iniciar outro');
      this.resetQuantity(itemId);
      return false;
    }

    this.currentOrder = {
      itemId: itemId,
      categoryId: categoryId
    };
    this.activeItemId = itemId;

    // Habilita checkboxes e mostra botão
    this.enableExtras(itemId);
    document.getElementById('btn-add-fixed').classList.add('active');
    
    console.log('✅ Pedido iniciado, extras habilitados');
    return true;
  },

  // Cancela pedido atual
  cancelOrder() {
    if (!this.currentOrder) return;
    
    console.log('❌ Cancelando pedido');
    
    const itemId = this.currentOrder.itemId;
    this.resetQuantity(itemId);
    
    this.disableExtras(itemId);
    this.currentOrder = null;
    this.activeItemId = null;
    
    document.getElementById('btn-add-fixed').classList.remove('active');
  },

  // Reseta quantidade para zero
  resetQuantity(itemId) {
    const valorSpan = document.querySelector(`.valor[data-item-id="${itemId}"]`);
    if (valorSpan) {
      valorSpan.textContent = '0';
    }
  },

  // Obtém quantidade atual
  getQuantity(itemId) {
    const valorSpan = document.querySelector(`.valor[data-item-id="${itemId}"]`);
    return valorSpan ? parseInt(valorSpan.textContent) || 0 : 0;
  },

  // Define quantidade
  setQuantity(itemId, value) {
    const valorSpan = document.querySelector(`.valor[data-item-id="${itemId}"]`);
    if (valorSpan) {
      valorSpan.textContent = Math.max(0, value);
    }
  },

  // Habilita checkboxes de extras
  enableExtras(itemId) {
    const buttons = document.querySelectorAll(`button[data-item-id="${itemId}"]`);
    if (buttons.length === 0) return;

    const categoryItem = buttons[0].closest('.category-item');
    if (!categoryItem) return;

    const checkboxes = categoryItem.querySelectorAll('.option-checkbox');
    const labels = categoryItem.querySelectorAll('.option-label');
    
    checkboxes.forEach(cb => {
      cb.disabled = false;
    });
    
    labels.forEach(label => {
      label.style.pointerEvents = 'all';
      label.style.cursor = 'pointer';
    });

    // Habilita selects de pizza se existir
    const sizeSelect = categoryItem.querySelector('.size-select');
    const borderSelect = categoryItem.querySelector('.border-select');
    if (sizeSelect) sizeSelect.disabled = false;
    if (borderSelect) borderSelect.disabled = false;

    console.log('✅ Checkboxes habilitados para:', itemId);
  },

  // Desabilita checkboxes de extras
  disableExtras(itemId) {
    const buttons = document.querySelectorAll(`button[data-item-id="${itemId}"]`);
    if (buttons.length === 0) return;

    const categoryItem = buttons[0].closest('.category-item');
    if (!categoryItem) return;

    const checkboxes = categoryItem.querySelectorAll('.option-checkbox');
    const labels = categoryItem.querySelectorAll('.option-label');
    
    checkboxes.forEach(cb => {
      cb.disabled = true;
      cb.checked = false;
    });
    
    labels.forEach(label => {
      label.style.pointerEvents = 'none';
    });

    // Desabilita selects de pizza
    const sizeSelect = categoryItem.querySelector('.size-select');
    const borderSelect = categoryItem.querySelector('.border-select');
    if (sizeSelect) {
      sizeSelect.disabled = true;
      sizeSelect.value = '';
    }
    if (borderSelect) {
      borderSelect.disabled = true;
      borderSelect.value = '';
    }

    // Esconde opções de pizza
    const flavorsDiv = categoryItem.querySelector('.pizza-flavors');
    const borderDiv = categoryItem.querySelector('.pizza-border');
    if (flavorsDiv) flavorsDiv.style.display = 'none';
    if (borderDiv) borderDiv.style.display = 'none';
  },

  // Coleta dados do pedido atual
  collectOrderData() {
    if (!this.currentOrder) return null;

    const itemId = this.currentOrder.itemId;
    const buttons = document.querySelectorAll(`button[data-item-id="${itemId}"]`);
    if (buttons.length === 0) return null;

    const categoryItem = buttons[0].closest('.category-item');
    const quantity = this.getQuantity(itemId);

    if (quantity === 0) {
      utils.showToast('⚠️ Quantidade deve ser maior que zero');
      return null;
    }

    // Verifica se é pizza
    const isPizza = buttons[0].dataset.isPizza === 'true';
    
    if (isPizza) {
      return this.collectPizzaOrderData(itemId, categoryItem, quantity);
    }

    // Busca o produto normal
    const product = this.findProduct(this.currentOrder.itemId, this.currentOrder.categoryId);
    if (!product) {
      console.error('❌ Produto não encontrado:', this.currentOrder.itemId);
      utils.showToast('Erro: Produto não encontrado');
      return null;
    }

    console.log('✅ Produto encontrado:', product);

    // Coleta extras pagos
    const extras = [];
    categoryItem.querySelectorAll('.extra-item:checked').forEach(cb => {
      extras.push({
        name: cb.value,
        price: parseFloat(cb.dataset.price) || 0
      });
    });

    // Coleta removidos (usa classe remove-option)
    const removed = [];
    categoryItem.querySelectorAll('.remove-option:checked').forEach(cb => {
      removed.push(cb.value);
    });

    // Coleta opções grátis do açaí (usa classe acai-included)
    categoryItem.querySelectorAll('.acai-included:checked').forEach(cb => {
      extras.push({
        name: cb.value,
        price: 0  // Grátis
      });
    });

    const unitPrice = product.price || 0;
    const extrasPrice = extras.reduce((sum, e) => sum + e.price, 0);

    const orderData = {
      cartItemId: utils.generateUniqueId(),
      sourceId: this.currentOrder.itemId,
      name: product.name,
      unitPrice: unitPrice + extrasPrice,
      quantity: quantity,
      subtotal: (unitPrice + extrasPrice) * quantity,
      category: this.currentOrder.categoryId,
      size: product.size || null,
      extras: extras,
      removed: removed,
      flavors: [],
      border: null
    };

    console.log('📦 Dados do pedido coletados:', orderData);
    return orderData;
  },

  // Coleta dados de pedido de pizza
  collectPizzaOrderData(itemId, categoryItem, quantity) {
    const buttons = document.querySelectorAll(`button[data-item-id="${itemId}"]`);
    const pizzaCategory = buttons[0].dataset.pizzaCategory;
    console.log('🍕 Coletando dados de pizza:', pizzaCategory);

    // Verifica tamanho selecionado
    const sizeSelect = categoryItem.querySelector('.size-select');
    const size = sizeSelect.value;
    
    if (!size) {
      utils.showToast('⚠️ Selecione um tamanho para a pizza');
      sizeSelect.focus();
      sizeSelect.classList.add('field-error');
      return null;
    }
    sizeSelect.classList.remove('field-error');

    // Pega preço base
    const selectedOption = sizeSelect.querySelector(`option[value="${size}"]`);
    const basePrice = parseFloat(selectedOption.dataset.price) || 0;

    // Coleta sabores
    const flavors = [];
    categoryItem.querySelectorAll('.pizza-flavor-checkbox:checked').forEach(cb => {
      flavors.push(cb.dataset.flavor);
    });

    console.log('🍕 Sabores coletados:', flavors);

    if (flavors.length === 0) {
      utils.showToast('⚠️ Selecione pelo menos 1 sabor');
      return null;
    }

    // Coleta borda
    const borderSelect = categoryItem.querySelector('.border-select');
    const border = borderSelect.value || null;
    
    // Calcula preço da borda
    let borderPrice = 0;
    if (border && PIZZA_DATA[pizzaCategory]) {
      borderPrice = PIZZA_DATA[pizzaCategory].borderPrice[size] || 0;
    }

    const totalPrice = basePrice + borderPrice;
    const pizzaName = PIZZA_DATA[pizzaCategory].name;

    const orderData = {
      cartItemId: utils.generateUniqueId(),
      sourceId: `${pizzaCategory}__pizza__${size}`,
      name: `${pizzaName} (${size})`,
      unitPrice: totalPrice,
      quantity: quantity,
      subtotal: totalPrice * quantity,
      category: pizzaCategory,
      size: size,
      extras: [],
      removed: [],
      flavors: flavors,
      border: border
    };

    console.log('📦 Dados da pizza coletados:', orderData);
    return orderData;
  },

  // Busca produto por ID
  findProduct(itemId, categoryId) {
    console.log('🔍 Buscando produto:', itemId, 'na categoria:', categoryId);

    // Busca em MENU_DATA
    if (MENU_DATA[categoryId]) {
      const category = MENU_DATA[categoryId];
      
      for (const item of category.items) {
        // Tenta match exato
        const exactId = utils.generateItemId(categoryId, item.id);
        if (exactId === itemId) {
          console.log('✅ Match exato encontrado');
          return { name: item.name, price: item.price || 0 };
        }

        // Se tem tamanhos, tenta match com tamanho
        if (item.sizes) {
          for (const sizeObj of item.sizes) {
            const sizeId = utils.generateItemId(categoryId, item.id, sizeObj.size);
            if (sizeId === itemId) {
              console.log('✅ Match com tamanho encontrado');
              return {
                name: `${item.name} (${sizeObj.size})`,
                price: sizeObj.price || 0,
                size: sizeObj.size
              };
            }
          }
        }
      }
    }

    // Fallback: busca por prefixo
    console.log('⚠️ Match exato não encontrado, tentando fallback...');
    const normalized = itemId.split('__');
    if (normalized.length >= 2) {
      const catPrefix = normalized[0];
      const prodId = normalized[1];

      if (MENU_DATA[catPrefix]) {
        const item = MENU_DATA[catPrefix].items.find(i => 
          utils.normalize(i.id) === prodId
        );
        if (item) {
          console.log('✅ Produto encontrado por fallback');
          return { name: item.name, price: item.price || 0 };
        }
      }
    }

    console.error('❌ Produto não encontrado após todas tentativas');
    return null;
  }
};

// ========== GERENCIADOR DO CARRINHO ==========
const cartManager = {
  items: [],

  // Adiciona item ao carrinho
  addItem(item) {
    console.log('➕ Adicionando ao carrinho:', item);

    // Verifica se item idêntico já existe
    const existingIndex = this.items.findIndex(i => 
      i.sourceId === item.sourceId &&
      JSON.stringify(i.extras) === JSON.stringify(item.extras) &&
      JSON.stringify(i.removed) === JSON.stringify(item.removed) &&
      JSON.stringify(i.flavors) === JSON.stringify(item.flavors) &&
      i.border === item.border
    );

    if (existingIndex !== -1) {
      // Soma quantidade
      this.items[existingIndex].quantity += item.quantity;
      this.items[existingIndex].subtotal += item.subtotal;
      console.log('✅ Quantidade atualizada no item existente');
      utils.showToast('✅ Quantidade atualizada no carrinho!');
    } else {
      // Adiciona novo
      this.items.push(item);
      console.log('✅ Novo item adicionado');
      utils.showToast('✅ Item adicionado ao carrinho!');
    }

    this.save();
    this.updateUI();
    
    utils.announceToScreenReader(`${item.name} adicionado ao carrinho`);
  },

  // Remove item
  removeItem(cartItemId) {
    const index = this.items.findIndex(i => i.cartItemId === cartItemId);
    if (index !== -1) {
      const item = this.items[index];
      this.items.splice(index, 1);
      this.save();
      this.updateUI();
      utils.announceToScreenReader(`${item.name} removido do carrinho`);
    }
  },

  // Altera quantidade
  changeQuantity(cartItemId, delta) {
    const item = this.items.find(i => i.cartItemId === cartItemId);
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      this.removeItem(cartItemId);
    } else {
      item.quantity = newQty;
      const extrasPrice = item.extras.reduce((sum, e) => sum + e.price, 0);
      item.subtotal = item.unitPrice * newQty;
      this.save();
      this.updateUI();
      utils.announceToScreenReader(`Quantidade de ${item.name} atualizada para ${newQty}`);
    }
  },

  // Atualiza UI do carrinho
  updateUI() {
    const itemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const cartTotalSidebar = document.getElementById('cart-total-sidebar');
    const cartFloat = document.getElementById('cart-float');

    const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = this.items.reduce((sum, item) => sum + item.subtotal, 0);

    // Atualiza contadores
    cartCount.textContent = totalItems;
    cartTotal.textContent = utils.formatPrice(totalPrice);
    cartTotalSidebar.textContent = utils.formatPrice(totalPrice);

    // Mostra/esconde carrinho flutuante
    if (totalItems > 0) {
      cartFloat.classList.add('active');
    } else {
      cartFloat.classList.remove('active');
    }

    // Renderiza items
    if (this.items.length === 0) {
      itemsContainer.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">🛒</div>
          <p>Seu carrinho está vazio</p>
          <small>Adicione produtos para continuar</small>
        </div>
      `;
    } else {
      itemsContainer.innerHTML = this.items.map(item => `
        <li class="cart-item">
          <div class="item-info">
            <div class="item-details">
              <div class="item-name-cart">${item.name}</div>
              ${item.flavors && item.flavors.length > 0 ? `
                <div class="item-extras">Sabores: ${item.flavors.join(', ')}</div>
              ` : ''}
              ${item.border ? `
                <div class="item-extras">Borda: ${item.border}</div>
              ` : ''}
              ${item.extras.length > 0 ? `
                <div class="item-extras">${item.extras.map(e => e.price > 0 ? `+ ${e.name}` : e.name).join(', ')}</div>
              ` : ''}
              ${item.removed.length > 0 ? `
                <div class="item-extras">Sem: ${item.removed.join(', ')}</div>
              ` : ''}
            </div>
            <div class="item-price">R$ ${utils.formatPrice(item.subtotal)}</div>
          </div>
          <div class="item-quantity">
            <button class="btn-quantity" data-action="decrease" data-id="${item.cartItemId}" aria-label="Diminuir quantidade de ${item.name}">−</button>
            <span class="quantity-display">${item.quantity}</span>
            <button class="btn-quantity" data-action="increase" data-id="${item.cartItemId}" aria-label="Aumentar quantidade de ${item.name}">+</button>
          </div>
        </li>
      `).join('');
    }

    console.log('🔄 UI do carrinho atualizada');
  },

  // Salva no localStorage
  save() {
    try {
      const dataStr = JSON.stringify(this.items);
      
      // Verifica se vai estourar a quota
      if (dataStr.length > CONFIG.storageQuotaLimit) {
        utils.showToast('⚠️ Carrinho muito grande! Finalize o pedido.', 5000);
        console.warn('⚠️ localStorage próximo do limite');
      }
      
      localStorage.setItem(CONFIG.storageKey, dataStr);
      console.log('💾 Carrinho salvo');
    } catch (e) {
      console.error('❌ Erro ao salvar carrinho:', e);
      
      if (e.name === 'QuotaExceededError') {
        utils.showToast('⚠️ Memória cheia! Finalize o pedido atual.', 5000);
        // Tenta limpar carrinhos antigos
        this.clearOldData();
      } else {
        utils.showToast('⚠️ Erro ao salvar. Tente novamente.');
      }
    }
  },

  // Limpa dados antigos do localStorage
  clearOldData() {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cardoso_cart_') && key !== CONFIG.storageKey) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log('🧹 Dados antigos removidos:', keysToRemove.length);
    } catch (e) {
      console.error('Erro ao limpar dados antigos:', e);
    }
  },

  // Carrega do localStorage
  load() {
    try {
      const data = localStorage.getItem(CONFIG.storageKey);
      if (data) {
        this.items = JSON.parse(data);
        this.updateUI();
        console.log('📂 Carrinho carregado:', this.items.length, 'items');
      }
    } catch (e) {
      console.error('❌ Erro ao carregar carrinho:', e);
      this.items = [];
      utils.showToast('⚠️ Erro ao carregar carrinho salvo');
    }
  },

  // Limpa carrinho
  clear() {
    this.items = [];
    this.save();
    this.updateUI();
    console.log('🗑️ Carrinho limpo');
  }
};

// ========== GERENCIADOR DE WHATSAPP ==========
const whatsappManager = {
  sendOrder() {
    if (cartManager.items.length === 0) {
      utils.showToast('⚠️ Carrinho vazio');
      return;
    }

    const deliveryType = document.querySelector('input[name="delivery-type"]:checked').value;
    
    // Valida dados de entrega se necessário
    if (deliveryType === 'delivery') {
      const requiredFields = [
        { id: 'customer-name', name: 'Nome', required: true },
        { id: 'customer-phone', name: 'Telefone', required: true },
        { id: 'customer-street', name: 'Rua', required: true },
        { id: 'customer-number', name: 'Número', required: true },
        { id: 'customer-district', name: 'Bairro', required: true }
      ];

      const emptyFields = utils.validateFormFields(requiredFields);
      
      if (emptyFields.length > 0) {
        utils.showToast(`⚠️ Preencha: ${emptyFields.join(', ')}`, 4000);
        return;
      }
    }

    let message = '*Pedido - Cardoso Caldo de Cana*%0A%0A';

    // Adiciona items
    cartManager.items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}%0A`;
      
      // Sabores da pizza
      if (item.flavors && item.flavors.length > 0) {
        message += `   Sabor: ${item.flavors.join(', ')}%0A`;
      }
      
      // Borda da pizza
      if (item.border) {
        message += `   Borda: ${item.border}%0A`;
      }
      
      // Extras - separar grátis (COM:) dos pagos (Adicionais:)
      if (item.extras.length > 0) {
        const freeExtras = item.extras.filter(e => e.price === 0);
        const paidExtras = item.extras.filter(e => e.price > 0);
        
        // Primeiro mostra os inclusos (grátis) como "COM:"
        if (freeExtras.length > 0) {
          message += `   Com: ${freeExtras.map(e => e.name).join(', ')}%0A`;
        }
        
        // Depois mostra os pagos como "Adicionais:"
        if (paidExtras.length > 0) {
          message += `   Adicionais: ${paidExtras.map(e => e.name).join(', ')}%0A`;
        }
      }
      
      // Ingredientes removidos
      if (item.removed.length > 0) {
        message += `   Sem: ${item.removed.join(', ')}%0A`;
      }
      
      // Linha de preço com quantidade
      message += `   R$ ${utils.formatPrice(item.unitPrice)} | QTD: ${item.quantity} | Subtotal: R$ ${utils.formatPrice(item.subtotal)}%0A%0A`;
    });

    // Total
    const total = cartManager.items.reduce((sum, item) => sum + item.subtotal, 0);
    message += `*Total: R$ ${utils.formatPrice(total)}*%0A%0A`;

    // Dados de entrega
    if (deliveryType === 'delivery') {
      const name = document.getElementById('customer-name').value.trim();
      const phone = document.getElementById('customer-phone').value.trim();
      const street = document.getElementById('customer-street').value.trim();
      const number = document.getElementById('customer-number').value.trim();
      const district = document.getElementById('customer-district').value.trim();
      const complement = document.getElementById('customer-complement').value.trim();
      const notes = document.getElementById('customer-notes').value.trim();

      message += `* Dados para Entrega:*%0A`;
      message += `Nome: ${encodeURIComponent(name)}%0A`;
      message += `Telefone: ${encodeURIComponent(phone)}%0A`;
      message += `Endereço: ${encodeURIComponent(street)}, ${encodeURIComponent(number)}%0A`;
      message += `Bairro: ${encodeURIComponent(district)}%0A`;
      if (complement) message += `Complemento: ${encodeURIComponent(complement)}%0A`;
      if (notes) message += `Obs: ${encodeURIComponent(notes)}%0A`;
    } else {
      message += `*🏪 Retirada no balcão*`;
    }

    // Abre WhatsApp
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${message}`;
    window.open(url, '_blank');

    // Limpa carrinho e formulário
    cartManager.clear();
    uiManager.closeCart();
    
    // Limpa formulário
    if (deliveryType === 'delivery') {
      document.getElementById('delivery-form').reset();
      document.querySelectorAll('.field-error').forEach(el => {
        el.classList.remove('field-error');
      });
    }
    
    utils.showToast('✅ Pedido enviado! Aguarde o retorno.');
  }
};

// ========== GERENCIADOR DE UI ==========
const uiManager = {
  init() {
    this.setupCategoryButtons();
    this.setupCartControls();
    this.setupQuantityButtons();
    this.setupDeliveryToggle();
    this.setupAddToCartButton();
    this.setupWhatsAppButton();
    this.setupKeyboardShortcuts();
  },

  setupCategoryButtons() {
    document.querySelectorAll('.menu-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        categoryManager.showCategory(category);
        
        // Scroll suave para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  },

  setupCartControls() {
    // Abre carrinho
    document.getElementById('cart-float').addEventListener('click', () => {
      this.openCart();
    });

    // Fecha carrinho
    document.getElementById('btn-close-cart').addEventListener('click', () => {
      this.closeCart();
    });

    // Overlay fecha carrinho
    document.getElementById('overlay').addEventListener('click', () => {
      this.closeCart();
    });

    // Botões de quantidade no carrinho
    document.getElementById('cart-items').addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-quantity');
      if (!btn) return;

      const action = btn.dataset.action;
      const id = btn.dataset.id;
      const delta = action === 'increase' ? 1 : -1;
      
      cartManager.changeQuantity(id, delta);
    });
  },

  setupQuantityButtons() {
    // Botões de mais e menos
    document.addEventListener('click', (e) => {
      const btn = e.target;
      
      if (btn.classList.contains('mais') || btn.classList.contains('menos')) {
        const itemId = btn.dataset.itemId;
        if (!itemId) return;

        const categoryEl = btn.closest('.category');
        const categoryId = categoryEl ? categoryEl.dataset.category : null;

        const currentQty = orderManager.getQuantity(itemId);
        const delta = btn.classList.contains('mais') ? 1 : -1;
        const newQty = Math.max(0, currentQty + delta);

        orderManager.setQuantity(itemId, newQty);

        // Se quantidade > 0, inicia pedido
        if (newQty > 0 && !orderManager.currentOrder) {
          orderManager.startOrder(itemId, categoryId);
        } else if (newQty === 0 && orderManager.activeItemId === itemId) {
          orderManager.cancelOrder();
        }
      }
    });

    // Radio buttons de tamanho
    document.addEventListener('change', (e) => {
      if (e.target.type === 'radio' && e.target.name.startsWith('size-')) {
        const categoryItem = e.target.closest('.category-item');
        const buttons = categoryItem.querySelectorAll('.menos, .mais');
        const valorSpan = categoryItem.querySelector('.valor');
        const itemId = e.target.dataset.itemId;
        
        buttons.forEach(btn => {
          btn.dataset.itemId = itemId;
          btn.disabled = false;
        });
        
        if (valorSpan) {
          valorSpan.dataset.itemId = itemId;
        }
      }
    });

    // Selects de pizza
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('size-select')) {
        const categoryItem = e.target.closest('.category-item');
        const flavorsDiv = categoryItem.querySelector('.pizza-flavors');
        const borderDiv = categoryItem.querySelector('.pizza-border');
        const buttons = categoryItem.querySelectorAll('.menos, .mais');
        const valorSpan = categoryItem.querySelector('.valor');

        if (e.target.value) {
          // Atualiza o data-item-id com o tamanho selecionado
          const pizzaCategory = e.target.dataset.pizzaCategory;
          const size = e.target.value;
          const itemId = utils.generateItemId(pizzaCategory, 'pizza', size);
          
          buttons.forEach(btn => {
            btn.dataset.itemId = itemId;
            btn.disabled = false;
          });
          
          if (valorSpan) {
            valorSpan.dataset.itemId = itemId;
          }
          
          flavorsDiv.style.display = 'block';
          borderDiv.style.display = 'block';

          // Habilita checkboxes de sabor
          categoryItem.querySelectorAll('.pizza-flavor-checkbox').forEach(cb => {
            cb.disabled = false;
          });

          // Habilita select de borda
          categoryItem.querySelector('.border-select').disabled = false;
          
          console.log('🍕 Pizza configurada:', pizzaCategory, size);
        } else {
          flavorsDiv.style.display = 'none';
          borderDiv.style.display = 'none';
          buttons.forEach(btn => btn.disabled = true);
          if (buttons[0] && buttons[0].dataset.itemId) {
            orderManager.setQuantity(buttons[0].dataset.itemId, 0);
          }
        }
      }
    });

    // Limita sabores de pizza a 2
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('pizza-flavor-checkbox')) {
        const categoryItem = e.target.closest('.category-item');
        const checkboxes = categoryItem.querySelectorAll('.pizza-flavor-checkbox:checked');
        
        if (checkboxes.length > CONFIG.maxPizzaFlavors) {
          e.target.checked = false;
          utils.showToast(`⚠️ Máximo de ${CONFIG.maxPizzaFlavors} sabores`);
        }
      }
    });

    // Limita opções grátis do açaí
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('acai-included')) {
        const categoryItem = e.target.closest('.category-item');
        const maxOptions = parseInt(e.target.dataset.max) || CONFIG.maxFreeAcaiOptions;
        const checked = categoryItem.querySelectorAll('.acai-included:checked');
        
        if (checked.length > maxOptions) {
          e.target.checked = false;
          utils.showToast(`⚠️ Máximo de ${maxOptions} opções grátis`);
        }
      }
    });
  },

  setupDeliveryToggle() {
    document.querySelectorAll('input[name="delivery-type"]').forEach(radio => {
      radio.addEventListener('change', () => {
        const form = document.getElementById('delivery-form');
        if (radio.value === 'delivery') {
          form.style.display = 'block';
        } else {
          form.style.display = 'none';
          // Limpa erros quando esconde
          form.querySelectorAll('.field-error').forEach(el => {
            el.classList.remove('field-error');
          });
        }
      });
    });
  },

  setupAddToCartButton() {
    document.getElementById('btn-add-fixed').addEventListener('click', () => {
      const orderData = orderManager.collectOrderData();
      if (orderData) {
        cartManager.addItem(orderData);
        orderManager.cancelOrder();
        this.openCart();
      }
    });
  },

  setupWhatsAppButton() {
    document.getElementById('btn-whatsapp').addEventListener('click', () => {
      whatsappManager.sendOrder();
    });
  },

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // ESC cancela pedido ou fecha carrinho
      if (e.key === 'Escape') {
        if (orderManager.currentOrder) {
          orderManager.cancelOrder();
        } else if (document.getElementById('cart-panel').classList.contains('active')) {
          this.closeCart();
        }
      }
    });
  },

  openCart() {
    document.getElementById('cart-panel').classList.add('active');
    document.getElementById('overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  closeCart() {
    document.getElementById('cart-panel').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    document.body.style.overflow = '';
  }
};

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Iniciando Cardoso Caldo de Cana...');
  
  // Renderiza categorias
  categoryManager.renderCategories();
  
  // Mostra primeira categoria automaticamente
  categoryManager.showCategory('lanches');
  console.log('✅ Categoria inicial (Lanches) exibida');
  
  // Carrega carrinho
  cartManager.load();
  
  // Inicializa UI
  uiManager.init();
  
  // Verifica espaço no localStorage
  if (!utils.checkStorageQuota()) {
    console.warn('⚠️ localStorage pode estar cheio');
  }
  
  console.log('✅ Sistema inicializado com sucesso!');
  console.log('📊 Status: Pronto para uso');
});
    