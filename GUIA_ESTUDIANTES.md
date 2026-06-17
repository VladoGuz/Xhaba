# Guía para Estudiantes: Entendiendo la Arquitectura de Xhaba 🌺

¡Hola! Si estás leyendo esto, es porque estás aprendiendo a programar o quieres entender cómo está estructurada esta aplicación. Esta guía está diseñada para llevarte paso a paso por los conceptos clave.

## 1. La Arquitectura Cliente - Servidor
Xhaba está construida usando lo que se conoce como arquitectura **Cliente-Servidor**. Imagina que la aplicación es un restaurante:

### El Frontend (El Cliente / El Mesero y el Menú)
Ubicado en la carpeta `client/`. Está construido con **React**. 
Es todo lo que el usuario ve y con lo que interactúa: los botones, las imágenes, los formularios. 
- **React** nos permite construir interfaces dividiendo todo en piezas reutilizables llamadas **Componentes** (ej. `ProductCard.jsx`, `InventoryList.jsx`).
- **Estado (State)**: React guarda información temporal en la memoria del navegador usando algo llamado *Hooks*, específicamente `useState`. Por ejemplo, cuando escribes en un campo de texto, ese texto se guarda temporalmente en el "Estado".

### El Backend (El Servidor / La Cocina)
Ubicado en la carpeta `server/`. Está construido con **Node.js** y **Express**.
Su trabajo principal es escuchar peticiones que llegan desde el Frontend, procesarlas (ir a buscar ingredientes), y devolver una respuesta.
- No tiene interfaz gráfica. Es puramente lógica y datos.
- Se comunica en formato **JSON** (JavaScript Object Notation), que es un formato universal de texto para enviar datos.

### La Base de Datos (La Bodega)
Usamos **PostgreSQL**. Es donde la información "vive para siempre". Sin ella, cada vez que recargaras la página, los productos o usuarios desaparecerían. El Backend es el único que tiene la llave de la bodega (la base de datos); el Frontend nunca habla directamente con la base de datos por seguridad.

---

## 2. ¿Cómo viaja la información? (El Flujo de Vida)
Veamos un ejemplo de cómo se muestran los productos en la tienda:

1. **(Frontend) `useEffect`**: Cuando la página `Catalog.jsx` carga, un *hook* llamado `useEffect` ejecuta una función. Es como decir "React, tan pronto termines de pintar la pantalla, haz esto".
2. **(Frontend) Petición `fetch`**: El frontend usa una función llamada `fetch` para hacer una petición (HTTP GET) al backend diciendo: *"¡Oye servidor, dame los productos!"* (esto pasa en `api.js`).
3. **(Backend) Rutas (Routes)**: El backend recibe la petición en `server/index.js` y la manda a `productRoutes.js`. Las rutas son como los recepcionistas, que dicen: "Ah, ¿quieres productos? Déjame pasarte con el controlador de productos".
4. **(Backend) Controlador (Controller)**: El archivo `productController.js` es el chef. Toma la orden y dice: "Necesito ir a la base de datos".
5. **(Backend) SQL**: El controlador ejecuta una consulta en lenguaje SQL (`SELECT * FROM products`) a la base de datos PostgreSQL.
6. **(Base de Datos)**: Devuelve los datos crudos al controlador.
7. **(Backend) Respuesta (Response)**: El controlador empaqueta esos datos en formato JSON y se los lanza de vuelta por internet al Frontend (`res.json()`).
8. **(Frontend) Renderizado**: El Frontend recibe el JSON, lo guarda en su `useState`, y React mágicamente re-dibuja la pantalla creando un `<ProductCard>` por cada producto.

---

## 3. Conceptos Clave de React que verás en el código

- **Componentes (`function App()`)**: Funciones que retornan HTML (llamado JSX en React).
- **Props**: Propiedades. Es la forma de pasar datos de un componente "Padre" a un componente "Hijo" (como pasarle parámetros a una función).
- **`useState`**: La memoria a corto plazo del componente. Si el valor de un estado cambia, React vuelve a pintar solo la parte de la pantalla afectada.
- **`useEffect`**: Se usa para ejecutar "efectos secundarios" (como hacer peticiones a la API o iniciar temporizadores) justo después de que el componente se dibuja en pantalla.
- **Context API (`useContext`)**: Imagina que tienes una variable que necesitan muchos componentes (como el Carrito de Compras o el Usuario que inició sesión). En vez de pasarla de padre a hijo una y otra vez, la metes en un Contexto global. Cualquier componente, sin importar en qué parte del árbol esté, puede acceder a ella. Esto lo verás en `AuthContext.jsx` y `CartContext.jsx`.

## 4. Conceptos Clave de Backend que verás en el código

- **Rutas Rest API (GET, POST, PUT, DELETE)**: 
  - `GET`: Dame información.
  - `POST`: Crea algo nuevo (guardar un producto).
  - `PUT`: Actualiza algo que ya existe (editar un producto).
  - `DELETE`: Borra algo.
- **`async / await`**: El internet y la base de datos son lentos comparados con el procesador. JavaScript usa `await` para decir: "Oye, detente aquí y espera a que la base de datos termine de responder antes de continuar con la siguiente línea de código".
- **Middlewares**: Son funciones "porteros" que se ejecutan antes de que la petición llegue al controlador final. Por ejemplo, `authenticateToken` es un middleware que revisa si el usuario está logueado antes de dejarle borrar un producto.

¡Explora el código! Busca los archivos mencionados y lee los comentarios explicativos en español que dejamos dentro de ellos.
