

// ========== NÚMERO DO WHATSAPP ==========
export const WHATSAPP_NUMBER = '5548996430781';

// ========== DADOS DO CARDÁPIO ==========
export const MENU_DATA = {
  lanches: {
    name: 'Lanches',
    image: 'img/x-salada.png',
    items: [
      {
        id: 'misto-quente',
        name: 'Misto Quente',
        description: 'Pão, queijo, presunto e maionese.',
        price: 14,
        removable: ['Maionese']
      },
      {
        id: 'x-burguer-1',
        name: 'X Burguer (1 Carne)',
        description: 'Pão, carne, queijo, presunto e maionese.',
        price: 18,
        removable: ['Queijo', 'Maionese']
      },
      {
        id: 'x-frango',
        name: 'X Frango',
        description: 'Pão, frango, queijo, tomate, alface, milho, ervilha e maionese.',
        price: 25,
        removable: ['Queijo', 'Tomate', 'Alface', 'Milho', 'Ervilha', 'Maionese']
      },
      {
        id: 'x-calabresa',
        name: 'X Calabresa',
        description: 'Pão, calabresa, carne, presunto, queijo, tomate, alface, milho, ervilha e maionese.',
        price: 25,
        removable: ['Queijo', 'Tomate', 'Alface', 'Milho', 'Ervilha', 'Maionese']
      },
      {
        id: 'x-coracao',
        name: 'X Coração',
        description: 'Pão, coração, carne, presunto, queijo, tomate, alface, milho, ervilha e maionese.',
        price: 29,
        removable: ['Queijo', 'Tomate', 'Alface', 'Milho', 'Ervilha', 'Maionese']
      },
      {
        id: 'x-camarao',
        name: 'X Camarão',
        description: 'Pão, camarão, queijo, tomate, alface, milho, ervilha e maionese.',
        price: 33,
        removable: ['Queijo', 'Tomate', 'Alface', 'Milho', 'Ervilha', 'Maionese']
      },
      {
        id: 'x-salada',
        name: 'X Salada',
        description: 'Pão, carne, queijo, presunto, tomate, alface, milho, ervilha e maionese.',
        price: 22,
        removable: ['Queijo', 'Tomate', 'Alface', 'Milho', 'Ervilha', 'Maionese']
      },
      {
        id: 'x-burguer-2',
        name: 'X Burguer (2 Carnes)',
        description: 'Pão, 2 carnes, queijo, presunto e maionese.',
        price: 21,
        removable: ['Queijo', 'Maionese']
      },
      {
        id: 'x-bacon',
        name: 'X Bacon',
        description: 'Pão, bacon, carne, presunto, queijo, tomate, alface, milho, ervilha e maionese.',
        price: 27,
        removable: ['Queijo', 'Tomate', 'Alface', 'Milho', 'Ervilha', 'Maionese']
      },
      {
        id: 'x-egg',
        name: 'X Egg',
        description: 'Pão, ovo, carne, presunto, queijo, tomate, alface, milho, ervilha e maionese.',
        price: 24,
        removable: ['Queijo', 'Tomate', 'Alface', 'Milho', 'Ervilha', 'Maionese']
      },
      {
        id: 'x-acebolado',
        name: 'X Acebolado',
        description: 'Pão, cebola, carne, presunto, queijo, tomate, alface, milho, ervilha e maionese.',
        price: 24,
        removable: ['Queijo', 'Tomate', 'Alface', 'Milho', 'Ervilha', 'Maionese']
      },
      {
        id: 'x-da-casa',
        name: 'X Da Casa',
        description: 'Pão, maionese, carne, frango, calabresa, ovo, coração, bacon, presunto, queijo, saladas e grãos.',
        price: 46,
        removable: ['Queijo', 'Tomate', 'Alface', 'Milho', 'Ervilha', 'Maionese']
      },
      {
        id: 'x-doce',
        name: 'X Doce',
        description: 'Pão, chocolate, morango e bombom.',
        price: 20
      }
    ],
    extras: [
      { id: 'partido', name: 'Partido', price: 3 },
      { id: 'gostinho', name: 'Gostinho', price: 4 },
      { id: 'mais-carne', name: '+ Carne', price: 4 },
      { id: 'mais-frango', name: '+ Frango', price: 4 },
      { id: 'calabresa', name: 'Calabresa', price: 5 },
      { id: 'graos', name: 'Grãos', price: 2 },
      { id: 'salada', name: 'Salada', price: 2 },
      { id: 'queijo', name: 'Queijo', price: 2 },
      { id: 'ovo', name: 'Ovo', price: 2 },
      { id: 'coracao', name: 'Coração', price: 4 }
    ]
  },

  hamburguer: {
    name: 'Especiais da Casa',
    image: 'img/hamburgue-especial.png',
    items: [
      {
        id: 'hamburguer-tradicional',
        name: 'Hamburguer Tradicional',
        description: 'Pão, carne, queijo, cheddar, salada, maionese e fritas.',
        price: 30,
        removable: ['Salada', 'Maionese']
      },
      {
        id: 'hamburguer-bacon',
        name: 'Hamburguer Bacon',
        description: 'Pão, carne, bacon, queijo, cheddar, salada, maionese e fritas.',
        price: 33,
        removable: ['Salada', 'Maionese']
      },
      {
        id: 'hamburguer-casa',
        name: 'Hamburguer da Casa',
        description: 'Pão, 2 carnes, bacon, cebola caramelizada, queijo, cheddar, salada, maionese e fritas.',
        price: 37,
        removable: ['Salada', 'Maionese']
      },
      {
        id: 'hamburguer-kids',
        name: 'Hamburguer Kids',
        description: 'Pão, carne, queijo, cheddar, salada, molho especial, acompanha batata divertida.',
        price: 19,
        removable: ['Salada', 'Maionese', 'Molho Especial']
      }
    ]
  },

  tabuas: {
    name: 'Tábuas',
    image: 'img/tábua.png',
    items: [
      {
        id: 'tabua',
        name: 'Tábua',
        description: 'Aipim, carne, calabresa, coração, frango, batata, cebola a milanesa, polenta, azeitona, pepino e ovo de codorna.',
        sizes: [
          { size: 'P', price: 76 },
          { size: 'M', price: 100 },
          { size: 'G', price: 115 }
        ]
      }
    ]
  },

  'torre-batata': {
    name: 'Torre de Batata',
    image: 'img/torre-batata.png',
    items: [
      {
        id: 'torre-batata',
        name: 'Torre de Batata',
        description: 'Batata, bacon, calabresa, coração, queijo, requeijão e orégano.',
        sizes: [
          { size: 'P', price: 60 },
          { size: 'G', price: 80 }
        ]
      }
    ]
  },

  porcoes: {
    name: 'Porções',
    image: 'img/porções.png',
    items: [
      { id: 'batata-frita', name: 'Batata Frita (500g)', price: 22 },
      { id: 'fritas-bacon-cheddar', name: 'Fritas com Bacon e Cheddar (500g)', price: 32 },
      { id: 'aipim', name: 'Aipim (500g)', price: 20 },
      { id: 'calabresa', name: 'Calabresa (400g)', price: 23 },
      { id: 'carne', name: 'Carne (500g)', price: 34 },
      { id: 'camarao-empanado', name: 'Camarão Empanado (400g)', price: 54 },
      { id: 'casquinha-siri', name: 'Casquinha de Sirí (UND)', price: 10 },
      { id: 'cebola-empanada', name: 'Cebola Empanada', price: 18 },
      { id: 'coracao-paozinho', name: 'Coração + Pãozinho (400g)', price: 33 },
      { id: 'coxinha-aza-fritas', name: 'Coxinha da Aza + Fritas', description: '6 unidades + 250g batatas', price: 35 },
      { id: 'frango-xadrez', name: 'Frango Xadrez + Pãozinho (400g)', price: 31 },
      { id: 'filezinho-frango', name: 'Filezinho de Frango + Fritas', description: '450g + 250g batatas', price: 35 },
      { id: 'isca-peixe', name: 'Isca de Peixe (400g)', price: 34 },
      { id: 'polenta-frita', name: 'Polenta Frita (500g)', price: 18 },
      { id: 'porcao-frios', name: 'Porção de Frios', price: 18 },
      { id: 'porcao-paozinho', name: 'Porção de Pãozinho', price: 7 },
      { id: 'ovo-codorna', name: 'Ovo de Codorna (24 UND)', price: 15 }
    ]
  },

  cervejas: {
    name: 'Cervejas',
    image: 'img/cervejas.png',
    items: [
      { id: 'antartica-600', name: 'Antártica 600ml', price: 12, category: '600ml' },
      { id: 'brahma-600', name: 'Brahma 600ml', price: 12, category: '600ml' },
      { id: 'original-600', name: 'Original 600ml', price: 15, category: '600ml' },
      { id: 'antartica-litao', name: 'Antártica Litão', price: 14, category: 'Litão' },
      { id: 'brahma-litao', name: 'Brahma Litão', price: 14, category: 'Litão' },
      { id: 'corona-long', name: 'Corona Long Neck', price: 12, category: 'Long Neck' },
      { id: 'budweizer-long', name: 'Budweizer Long Neck', price: 10, category: 'Long Neck' },
      { id: 'heineken-long', name: 'Heineken Long Neck', price: 12, category: 'Long Neck' },
      { id: 'antartica-lata', name: 'Antártica Lata', price: 6, category: 'Lata' },
      { id: 'brahma-sem-alcool', name: 'Brahma sem Álcool', price: 7, category: 'Lata' },
      { id: 'brahma-malzebier', name: 'Brahma Malzebier', price: 7, category: 'Lata' }
    ]
  },

  bebidas: {
    name: 'Bebidas',
    image: 'img/bebidas.png',
    items: [
      { id: 'refri-cacula', name: 'Refri Caçulinha', price: 3, category: 'Refrigerantes' },
      { id: 'refri-lata', name: 'Refri Lata', price: 6, category: 'Refrigerantes' },
      { id: 'refri-600', name: 'Refri 600ml', price: 8, category: 'Refrigerantes' },
      { id: 'refri-2l', name: 'Refri 2 Litros', price: 13, category: 'Refrigerantes' },
      { id: 'coca-2l', name: 'Refri Coca-Cola 2lt', price: 14, category: 'Refrigerantes' },
      { id: 'h2o', name: 'H2O', price: 8, category: 'Água' },
      { id: 'agua-gas', name: 'Água C/Gás', price: 4, category: 'Água' },
      { id: 'agua-sem-gas', name: 'Água S/Gás', price: 4, category: 'Água' },
      { id: 'red-bull', name: 'Red Bull', price: 12, category: 'Energético' },
      { id: 'energetico-bally', name: 'Energético Bally', price: 6, category: 'Energético' },
      { id: 'suco-laranja', name: 'Suco de Laranja', price: 8, category: 'Suco' },
      { id: 'suco-maracuja', name: 'Suco de Maracujá', price: 7, category: 'Suco' },
      { id: 'suco-abacaxi', name: 'Suco de Abacaxi', price: 8, category: 'Suco' },
      { id: 'caldo-cana', name: 'Caldo de Cana', price: 7, category: 'Suco' }
    ]
  },

  caipirinhas: {
    name: 'Caipirinhas',
    image: 'img/caipirinhas.png',
    items: [
      { id: 'caipirinha-limao', name: 'Caipirinha de Limão', price: 16 },
      { id: 'caipirinha-morango', name: 'Caipirinha de Morango', price: 18 },
      { id: 'caipirinha-vinho', name: 'Caipirinha de Vinho', price: 16 },
      { id: 'caipirinha-abacaxi', name: 'Caipirinha de Abacaxi', price: 16 },
      { id: 'caipirinha-maracuja', name: 'Caipirinha de Maracujá', price: 18 },
      { id: 'caipirinha-nevada', name: 'Caipirinha Nevada', price: 19 },
      { id: 'caipirinha-pina-colada', name: 'Caipirinha Piña Colada', price: 18 }
    ]
  },

  acai: {
    name: 'Açaí',
    image: 'img/açai.png',
    items: [
      {
        id: 'acai-300',
        name: 'Açaí 300ml',
        price: 12,
        freeOptions: 2,
        freeItems: [
          'Cobertura de chocolate',
          'Cobertura de morango',
          'Calda de caramelo',
          'Leite condensado',
          'Granulado',
          'Banana'
        ]
      },
      {
        id: 'acai-500',
        name: 'Açaí 500ml',
        price: 17,
        freeOptions: 2,
        freeItems: [
          'Cobertura de chocolate',
          'Cobertura de morango',
          'Calda de caramelo',
          'Leite condensado',
          'Granulado',
          'Banana'
        ]
      }
    ],
    extras: [
      { id: 'leite-ninho', name: 'Leite ninho', price: 3 },
      { id: 'creme-avela', name: 'Creme de avelã', price: 5 },
      { id: 'ovo-maltine', name: 'Ovo maltine', price: 3 },
      { id: 'leitinho', name: 'Leitinho', price: 5 },
      { id: 'creme-limao', name: 'Creme de limão', price: 5 },
      { id: 'creme-amendoim', name: 'Creme amendoim', price: 4 },
      { id: 'creme-chocolate-preto', name: 'Creme chocolate preto', price: 5 },
      { id: 'creme-chocolate-branco', name: 'Creme chocolate branco', price: 5 },
      { id: 'granola', name: 'Granola', price: 3 },
      { id: 'kit-kat', name: 'Kit Kat', price: 4 },
      { id: 'ouro-branco', name: 'Ouro branco', price: 3 },
      { id: 'trento', name: 'Trento', price: 4 },
      { id: 'sonho-valsa', name: 'Sonho de valsa', price: 3 },
      { id: 'amendoim', name: 'Amendoim', price: 3 },
      { id: 'confete', name: 'Confete', price: 3 },
      { id: 'choco-ball', name: 'Choco ball', price: 3 },
      { id: 'pacoca', name: 'Paçoca', price: 3 }
    ],
    fruits: [
      { id: 'abacaxi', name: 'Abacaxi', price: 3 },
      { id: 'morango', name: 'Morango', price: 3 },
      { id: 'manga', name: 'Manga', price: 3 },
      { id: 'kiwi', name: 'Kiwi', price: 3 },
      { id: 'coco-fresco', name: 'Coco fresco', price: 4 }
    ]
  }
};

// ========== DADOS DAS PIZZAS ==========
export const PIZZA_DATA = {
  'pizzas-trad': {
    name: 'Pizzas Tradicionais',
    image: 'img/pizzas-tradicionais.png',
    basePrice: { P: 45, M: 55, G: 65 },
    borderPrice: { P: 8, M: 10, G: 12 },
    flavors: [
      'Quatro Queijos',
      'Bacon',
      'Calabresa',
      'Brócolis',
      'Frango com Catupiry',
      'Mista',
      'Pasqualina',
      'Portuguesa',
      'Marguerita',
      'Lombo Defumado',
      'Alho e Óleo',
      'Tomate Seco',
      'Peperoni',
      'Baiana',
      'Agridoce'
    ],
    borderFlavors: [
      'Catupiry',
      'Cheddar',
      'Doce de leite',
      'Creme de avelã',
      'Chocolate branco',
      'Chocolate preto'
    ]
  },

  'pizzas-especiais': {
    name: 'Pizzas Especiais',
    image: 'img/pizzas-especiais.png',
    basePrice: { P: 53, M: 64, G: 78 },
    borderPrice: { P: 8, M: 10, G: 12 },
    flavors: [
      'Frango Especial',
      'Brócolis Especial',
      'Calabresa Especial',
      'Palmito',
      'Strogonoff de Carne',
      'Americana',
      'Alcatra com Doritos',
      'Coração Acebolado',
      'Camarão ao Molho',
      'Camarão Especial'
    ],
    borderFlavors: [
      'Catupiry',
      'Cheddar',
      'Doce de leite',
      'Creme de avelã',
      'Chocolate branco',
      'Chocolate preto'
    ]
  },

  'pizzas-doces': {
    name: 'Pizzas Doces',
    image: 'img/pizzas-doces.png',
    basePrice: { P: 45, M: 55, G: 65 },
    borderPrice: { P: 8, M: 10, G: 12 },
    flavors: [
      'Chocolate Preto com Morango',
      'Chocolate Branco com Morango',
      'Charge',
      'Confete',
      'Brigadeiro Especial',
      'Prestígio',
      'Paçoquita',
      'Banana com Chocolate',
      'Banana com Canela',
      'Abacaxi',
      'Banana Nevada'
    ],
    borderFlavors: [
      'Catupiry',
      'Cheddar',
      'Doce de leite',
      'Creme de avelã',
      'Chocolate branco',
      'Chocolate preto'
    ]
  }
};

// ========== VERIFICAÇÃO DE INTEGRIDADE ==========
console.log('✅ product.js carregado com sucesso!');
console.log('📦 Categorias MENU_DATA:', Object.keys(MENU_DATA).length);
console.log('🍕 Categorias PIZZA_DATA:', Object.keys(PIZZA_DATA).length);