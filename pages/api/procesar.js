const catalog = {
  5: "Chicles", 8: "Refresco", 11: "Pan Integral", 12: "Galletas",
  15: "Leche", 19: "Harina", 20: "Azúcar", 22: "Jabón",
  25: "Aceite", 28: "Sal", 35: "Cereal", 45: "Café",
  51: "Yogur", 60: "Pasta", 75: "Arroz", 90: "Pollo",
  229: "Carne de Res", 1029: "Huevos", 2744: "Mermelada"
};

function processBarcodes(barcodes) {
  const factura = {};
  const errores = [];

  for (const code of barcodes) {
    if (!code.startsWith('|') || !code.endsWith('|')) {
      errores.push(code);
      continue;
    }

    let acumulado = 0;

    // Normaliza múltiples espacios
    const limpio = code.replace(/\s+/g, ' ');
    const tokens = [...limpio.matchAll(/(\|+|\*+|\s+)/g)];

    for (const m of tokens) {
      const t = m[0];
      if (t.startsWith('|')) {
        const count = t.length;
        if (count === 1) acumulado += 5;
        else if (count === 2) acumulado *= 3;
        else acumulado = Math.pow(acumulado, count);
      } else if (t.startsWith('*')) {
        const count = t.length;
        if (count === 1) acumulado += 10;
        else if (count === 2) acumulado *= 2;
        else acumulado = acumulado ** 2;
      } else if (t.startsWith(' ')) {
        acumulado = Math.floor(acumulado / 2);
      }
    }

    if (catalog[acumulado]) {
      if (!factura[acumulado]) {
        factura[acumulado] = { nombre: catalog[acumulado], cantidad: 1 };
      } else {
        factura[acumulado].cantidad++;
      }
    } else {
      errores.push(code);
    }
  }

  let total = 0;
  const items = Object.entries(factura).map(([precio, { nombre, cantidad }]) => {
    const subtotal = parseInt(precio) * cantidad;
    total += subtotal;
    return { nombre, precio: parseInt(precio), cantidad, subtotal };
  });

  return { items, total, errores };
}

// 👇👇👇 ESTO ES LO QUE ESTABA FALTANDO
export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end('Método no permitido');
    return;
  }

  const { codigos } = req.body;
  const resultado = processBarcodes(codigos);
  res.status(200).json(resultado);
}
