import { useState } from 'react';

export default function Home() {
  const [inputFormatted, setInputFormatted] = useState('');
  const [inputArray, setInputArray] = useState('');
  const [factura, setFactura] = useState(null);

  const handleSubmit = async () => {
    let codigos;
    try {
      if (inputFormatted.trim()) {
        codigos = inputFormatted.trim().split('\n').filter(l => l.trim());
      } else if (inputArray.trim()) {
        codigos = JSON.parse(`[${inputArray}]`);
      } else {
        alert("Ingresa los códigos en alguno de los campos");
        return;
      }
    } catch (error) {
      alert("Error al parsear el formato del segundo input. Asegúrate de que esté entre comillas y separado por comas.");
      return;
    }

    const res = await fetch('/api/procesar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigos }),
    });

    const data = await res.json();
    setFactura(data);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', backgroundColor: '#fff5cc', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/2983/2983067.png"
          alt="logo"
          style={{ height: '80px', marginBottom: '1rem' }}
        />
        <h1 style={{ fontSize: '2rem', color: '#333', fontWeight: 'bold' }}>Decodificación de Códigos de Barras</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '700px', margin: '0 auto' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#333' }}>Formato línea por línea:</label>
          <textarea
            rows={6}
            style={{ width: '100%', padding: '10px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#000' }}
            placeholder="|* **|\n|**|\n..."
            value={inputFormatted}
            onChange={(e) => setInputFormatted(e.target.value)}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#333' }}>Formato tipo array (para test):</label>
          <input
            type="text"
            style={{ width: '100%', padding: '10px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#000' }}
            placeholder='"|* **|", "|**|", "|* *|", ...'
            value={inputArray}
            onChange={(e) => setInputArray(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          style={{ padding: '12px', fontSize: '1rem', backgroundColor: '#000', color: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Procesar
        </button>
      </div>

      {factura && (
        <div style={{ marginTop: '2rem', background: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 0 10px #ccc', maxWidth: '800px', marginInline: 'auto' }}>
          <h3 style={{ textAlign: 'center', color: '#333' }}>Factura</h3>
          {factura.items.length > 0 ? (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', backgroundColor: '#fff' }}>
                <thead>
                  <tr style={{ background: '#f0f0f0', color: '#333' }}>
                    <th style={{ border: '1px solid #aaa', padding: '10px' }}>Producto</th>
                    <th style={{ border: '1px solid #aaa', padding: '10px' }}>Precio Unitario</th>
                    <th style={{ border: '1px solid #aaa', padding: '10px' }}>Cantidad</th>
                    <th style={{ border: '1px solid #aaa', padding: '10px' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {factura.items.map((item, i) => (
                    <tr key={i} style={{ color: '#000' }}>
                      <td style={{ border: '1px solid #aaa', padding: '10px' }}>{item.nombre}</td>
                      <td style={{ border: '1px solid #aaa', padding: '10px' }}>{item.precio}</td>
                      <td style={{ border: '1px solid #aaa', padding: '10px' }}>{item.cantidad}</td>
                      <td style={{ border: '1px solid #aaa', padding: '10px' }}>{item.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ textAlign: 'right', marginTop: '10px', fontWeight: 'bold', fontSize: '1.2rem', color: '#000' }}>
                Total: {factura.total}
              </div>
            </>
          ) : (
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>No se reconocieron productos válidos.</p>
          )}

          {factura.errores.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ color: '#b30000' }}>Códigos inválidos:</h4>
              <ul style={{ color: '#000' }}>
                {factura.errores.map((e, i) => <li key={i}><code>{e}</code></li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
