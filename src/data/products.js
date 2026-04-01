export const UNITS = [
  { id: 'u',      label: 'Unidades',  short: 'u' },
  { id: 'lb',     label: 'Libras',    short: 'lb' },
  { id: 'L',      label: 'Litros',    short: 'L' },
  { id: 'cubeta', label: 'Cubeta',    short: 'cub' },
]

export const CATEGORIES = [
  { id: 'lacteos',   name: 'Lácteos',       icon: '🥛', color: '#E3F2FD' },
  { id: 'frutas',    name: 'Frutas',         icon: '🍎', color: '#F3E5F5' },
  { id: 'verduras',  name: 'Verduras',       icon: '🥦', color: '#E8F5E9' },
  { id: 'proteinas', name: 'Proteínas',      icon: '🥩', color: '#FBE9E7' },
  { id: 'carbos',    name: 'Carbohidratos',  icon: '🥖', color: '#FFF8E1' },
  { id: 'limpieza',  name: 'Limpieza',       icon: '🧴', color: '#E0F7FA' },
]

export const DEFAULT_PRODUCTS = {
  lacteos: [
    { id: 'leche',       emoji: '🥛', name: 'Leche',        unit: 'L'      },
    { id: 'queso',       emoji: '🧀', name: 'Queso',        unit: 'lb'     },
    { id: 'mantequilla', emoji: '🧈', name: 'Mantequilla',  unit: 'u'      },
    { id: 'huevos',      emoji: '🥚', name: 'Huevos',       unit: 'cubeta' },
    { id: 'yogur',       emoji: '🍦', name: 'Yogur',        unit: 'u'      },
    { id: 'crema',       emoji: '🫙', name: 'Crema',        unit: 'u'      },
  ],
  frutas: [
    { id: 'manzana',  emoji: '🍎', name: 'Manzana',  unit: 'u'  },
    { id: 'platano',  emoji: '🍌', name: 'Plátano',  unit: 'u'  },
    { id: 'naranja',  emoji: '🍊', name: 'Naranja',  unit: 'u'  },
    { id: 'uvas',     emoji: '🍇', name: 'Uvas',     unit: 'lb' },
    { id: 'fresa',    emoji: '🍓', name: 'Fresa',    unit: 'lb' },
    { id: 'sandia',   emoji: '🍉', name: 'Sandía',   unit: 'u'  },
  ],
  verduras: [
    { id: 'brocoli',   emoji: '🥦', name: 'Brócoli',   unit: 'u'  },
    { id: 'zanahoria', emoji: '🥕', name: 'Zanahoria', unit: 'lb' },
    { id: 'cebolla',   emoji: '🧅', name: 'Cebolla',   unit: 'lb' },
    { id: 'tomate',    emoji: '🍅', name: 'Tomate',    unit: 'lb' },
    { id: 'lechuga',   emoji: '🥬', name: 'Lechuga',   unit: 'u'  },
    { id: 'papa',      emoji: '🥔', name: 'Papa',      unit: 'lb' },
  ],
  proteinas: [
    { id: 'res',      emoji: '🥩', name: 'Res',      unit: 'lb' },
    { id: 'pollo',    emoji: '🍗', name: 'Pollo',    unit: 'lb' },
    { id: 'pescado',  emoji: '🐟', name: 'Pescado',  unit: 'lb' },
    { id: 'jamon',    emoji: '🥓', name: 'Jamón',    unit: 'lb' },
    { id: 'lentejas', emoji: '🫘', name: 'Lentejas', unit: 'lb' },
    { id: 'atun',     emoji: '🐠', name: 'Atún',     unit: 'u'  },
  ],
  carbos: [
    { id: 'pan',   emoji: '🥖', name: 'Pan',   unit: 'u'  },
    { id: 'arroz', emoji: '🍚', name: 'Arroz', unit: 'lb' },
    { id: 'pasta', emoji: '🍝', name: 'Pasta', unit: 'u'  },
    { id: 'papa',  emoji: '🥔', name: 'Papa',  unit: 'lb' },
    { id: 'maiz',  emoji: '🌽', name: 'Maíz',  unit: 'u'  },
    { id: 'avena', emoji: '🥣', name: 'Avena', unit: 'lb' },
  ],
  limpieza: [
    { id: 'shampoo',   emoji: '🧴', name: 'Shampoo',     unit: 'u' },
    { id: 'dental',    emoji: '🪥', name: 'Pasta dental', unit: 'u' },
    { id: 'papel',     emoji: '🧻', name: 'Papel',        unit: 'u' },
    { id: 'jabon',     emoji: '🧼', name: 'Jabón',        unit: 'u' },
    { id: 'detergente',emoji: '🫧', name: 'Detergente',   unit: 'u' },
    { id: 'suavizante',emoji: '🌸', name: 'Suavizante',   unit: 'u' },
  ],
}
