import React, { useEffect, useState} from "react";
import "./assets/App.css"; // Importamos los estilos que crearemos abajo

export default function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        // Hacemos la petición a tu API local
        const respuesta = await fetch("http://localhost:5000/api/products");

        if (!respuesta.ok) {
          throw new Error("No se pudo conectar con el servidor");
        }

        const datos = await respuesta.json();
        setProductos(datos);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();
  }, []);

  // Manejo de estados de la interfaz
  if (cargando)
    return <div className="estado">Cargando catálogo de artesanías... ⏳</div>;
  if (error) return <div className="">Error: {error} ❌</div>;
  if (productos.length === 0)
    return (
      <div className="estado">No hay productos disponibles por ahora.</div>
    );

  return (
    <div className="contenedor">
      <header className="cabecera">
        <h1>Boutique de Artesanías</h1>
        <p>Tesoros culturales directamente de las manos de sus creadores.</p>
      </header>

      <main className="grilla-productos">
        {productos.map((producto) => (
          <article key={producto.product_id} className="tarjeta-producto">
            {/* Cabecera de la Tarjeta */}
            <div className="tarjeta-header">
              <h2>{producto.title}</h2>
              <span className="precio">${producto.base_price} MXN</span>
            </div>

            {/* Detalles del Creador y Materiales */}
            <div className="detalles-creador">
              <p>
                <strong>Artesano:</strong> {producto.artisan_name}
              </p>
              <p>
                <strong>Origen:</strong> {producto.artisan_community}
              </p>
              <p>
                <strong>Técnica:</strong> {producto.technique} (
                {producto.material})
              </p>
            </div>

            <p className="descripcion">{producto.description}</p>

            {/* Sección de Variantes (Iteramos sobre el array JSONB) */}
            <div className="variantes-seccion">
              <h3>Opciones Disponibles:</h3>
              {producto.variants && producto.variants.length > 0 ? (
                <ul className="lista-variantes">
                  {producto.variants.map((variante) => (
                    <li
                      key={variante.variant_id}
                      className={variante.stock === 0 ? "agotado" : ""}
                    >
                      <strong>{variante.color}</strong> - Talla: {variante.size}
                      {variante.stock > 0 ? (
                        <span className="stock"> ({variante.stock} disp.)</span>
                      ) : (
                        <span className="stock-agotado"> (Agotado)</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="sin-variantes">
                  Pieza única / Sin variantes registradas.
                </p>
              )}
            </div>

            {/* Botón de acción (solo visual por ahora) */}
            <button
              className="boton-comprar"
              disabled={!producto.variants.some((v) => v.stock > 0)}
            >
              Añadir al Carrito
            </button>
          </article>
        ))}
      </main>
    </div>
  );
}
