# Depósito — Inventario de stock

Aplicación web para gestionar el stock de cualquier negocio, con **aviso automático de los
productos que hay que reponer**. Trabajo práctico de Desarrollo Frontend construido con
Svelte 5 (runas), SvelteKit y Supabase.

La app es **agnóstica del rubro**: productos, categorías y unidades los define quien la
usa. Los datos de ejemplo del seed son un catálogo de videojuegos retro, pero sirve igual
para una ferretería, una farmacia o un depósito de insumos.

## Stack

| Pieza | Versión | Para qué |
| --- | --- | --- |
| Svelte | 5.57 | Componentes y reactividad con runas (`$state`, `$derived`, `$props`, `$effect`) |
| SvelteKit | 3.2 | Ruteo por archivos, alias `#lib`, variables de entorno |
| `@sveltejs/adapter-static` | 4.0 | Build como SPA estática (sin servidor propio) |
| Supabase JS | 2.119 | Postgres en la nube, consultas REST y Realtime |
| Tailwind CSS | 4.3 | Estilos utilitarios y tema con variables CSS |
| shadcn-svelte | 1.8 | Componentes de UI accesibles (preset `vega`, base `neutral`) |
| bits-ui | 2.x | Primitivas accesibles detrás de shadcn (diálogos, selects, radios) |
| mode-watcher | 1.1 | Modo claro/oscuro persistido |
| Vite | 8.3 | Servidor de desarrollo y build |

La app corre **100 % en el navegador** (`ssr = false`): el build genera archivos estáticos
que se pueden subir a cualquier hosting.

## Puesta en marcha

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Crear el proyecto en Supabase

1. Entrar a [supabase.com/dashboard](https://supabase.com/dashboard) y crear un proyecto.
2. Abrir **SQL Editor → New query**, pegar el contenido de [`supabase/schema.sql`](supabase/schema.sql)
   y ejecutarlo. Crea las tablas, el trigger, la función de movimientos, las políticas RLS
   y habilita Realtime.
3. Ejecutar [`supabase/expiry.sql`](supabase/expiry.sql), que agrega los lotes y
   la versión de `register_movement` que los maneja.
4. Repetir con [`supabase/seed.sql`](supabase/seed.sql) para cargar datos de ejemplo: un
   almacén de barrio con 13 productos en 5 categorías, mezclando perecederos y no
   perecederos, con lotes vencidos y por vencer e historial de ventas.

> Dos scripts destructivos, para cuando hagan falta:
>
> - [`supabase/reset.sql`](supabase/reset.sql) **vacía** las tablas y deja la estructura.
>   Sirve para volver a cargar el seed desde cero.
> - [`supabase/drop.sql`](supabase/drop.sql) **borra** las tablas. Hace falta cuando
>   cambió la estructura: como `schema.sql` usa `create table if not exists`, sobre una
>   tabla vieja no hace nada y el seed falla con `column ... does not exist`. Después de
>   correrlo hay que repetir schema.sql, expiry.sql y seed.sql.

### 3. Configurar las credenciales

En Supabase: **Settings → API**. Copiar la `Project URL` y la **publishable key**
(`sb_publishable_...`, el reemplazo de la vieja `anon`) en el archivo `.env` de la raíz:

```bash
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

Hay un `.env.example` como plantilla. El `.env` está en `.gitignore`: no se sube al repo.
Nunca usar la *secret key*: esa salta RLS y solo va en un backend.

### 4. Levantar la app

```bash
pnpm dev
```

Si falta configurar Supabase, la app no se rompe: muestra una pantalla con los pasos
pendientes.

## Scripts

| Comando | Qué hace |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo con recarga instantánea |
| `pnpm build` | Build de producción estático en `build/` |
| `pnpm preview` | Sirve el build para probarlo localmente |
| `pnpm check` | Chequeo de tipos y accesibilidad con `svelte-check` |

## Funcionalidades

### Aviso de reposición (la feature central)

Cada producto tiene un **stock mínimo**. Según cómo está el stock respecto de ese mínimo,
la app lo clasifica en tres estados y lo muestra en todas las pantallas:

| Estado | Condición | Color |
| --- | --- | --- |
| **Agotado** | `stock = 0` | rojo |
| **Stock bajo** | `stock <= stock_minimo` | ámbar |
| **Stock normal** | `stock > stock_minimo` | verde |

El panel **Hay que reponer** ordena los productos por urgencia (primero los agotados) y
calcula cuántas unidades faltan para llegar al objetivo de reposición
(`stock_minimo × 2`). El botón *Reponer* abre el formulario de movimiento ya cargado con
esa cantidad sugerida. Además, el encabezado muestra un contador permanente con la
cantidad de productos a reponer.

### Pantallas

- **Panel** (`/`): totales del inventario (productos, unidades, valor, productos a
  reponer), panel de reposición y últimos movimientos.
- **Productos** (`/productos`): listado con buscador, filtro por categoría y por estado de
  stock, ordenamiento por nombre, stock, precio o faltante. Alta, edición y baja.
- **Movimientos** (`/movimientos`): registro de entradas, salidas y ajustes, con vista
  previa del stock resultante antes de confirmar, más el historial filtrable.
- **Categorías** (`/categorias`): alta y baja, con la cantidad de productos y de alertas
  por categoría.

La navegación es un sidebar colapsable (atajo `Ctrl/Cmd+B`) que muestra en cada sección un
contador de lo que necesita atención: productos a reponer y lotes por vencer, en ámbar o
rojo según la urgencia. Los listados largos están paginados del lado del cliente.

### Vencimientos y sugerencias de promoción

El vencimiento pertenece al **lote**, no al producto: un mismo artículo puede tener varias
tandas con fechas distintas, así que modelarlo como un campo del producto sería incorrecto
apenas entra la segunda compra. Los productos marcados como perecederos llevan lotes
(`product_batches`), y su stock es siempre la suma de ellos.

- Las **entradas** piden fecha de vencimiento y, opcionalmente, un código de lote.
- Las **salidas** descuentan del lote que vence primero (FEFO), salvo que se elija otro.
- Los **ajustes** se hacen sobre un lote puntual.

La pantalla **Vencimientos** lista los lotes vencidos o próximos a vencer y, para cada uno,
sugiere qué hacer. La sugerencia se calcula así:

1. Se mide el **ritmo de venta observado** del producto: unidades vendidas dividido los días
   de historial que la app realmente tiene (no una ventana fija de 30 días, porque dividir
   por 30 un producto cargado hace 3 días daría un ritmo falso).
2. Si hay menos de 3 salidas o menos de 7 días de historial, **no proyecta nada**: muestra
   “sin datos suficientes” y explica qué falta. Es la respuesta correcta, no un número
   inventado.
3. Con datos suficientes, proyecta cuántas unidades se venderían antes del vencimiento y
   calcula cuántas sobrarían.
4. Si sobran, sugiere un descuento según cuánto habría que acelerar la venta.

Cada tarjeta muestra **los datos que originan la recomendación** (unidades, días, ritmo
observado, cantidad de salidas y nivel de confianza), y la pantalla aclara que el
porcentaje es una heurística: la app no tiene datos de elasticidad precio/demanda y no
finge tenerlos.

### Integridad de los datos

El stock nunca se escribe "a mano" desde el navegador. Los movimientos llaman a la función
`register_movement` de Postgres, que en una sola transacción bloquea la fila del
producto, valida que el stock no quede negativo, actualiza el stock y escribe el registro
en el historial con el stock resultante. Por eso, al editar un producto el campo de stock
aparece bloqueado: se cambia desde Movimientos, para que quede historial.

### Tiempo real

La app se suscribe a los cambios de la tabla `products` con Supabase Realtime: si otra
persona (u otra pestaña) modifica el stock, el listado se actualiza solo. El pie de página
muestra si la sincronización está activa.

## Datos de ejemplo

El seed carga un almacén de barrio: perecederos (lácteos, panificados, fiambres) y
productos que no vencen (almacén, limpieza). Incluye lotes vencidos y por vencer, y un
historial de ventas para que las sugerencias de promoción tengan datos reales sobre los
que trabajar.

La app no asume ningún rubro: para otro negocio alcanza con reemplazar `seed.sql`.

## Modelo de datos

```
categories                 products                        stock_movements
----------                 --------                        ---------------
id            bigint PK    id            bigint PK         id              bigint PK
name          text unique  sku           text unique       product_id      -> products.id
created_at    timestamptz  name          text              batch_id        -> product_batches.id
                           description   text              type            inbound|outbound|adjustment
                           category_id   -> categories.id  quantity        integer
                           unit          text              resulting_stock integer
                           stock         integer >= 0      reason          text
                           min_stock     integer >= 0      created_at      timestamptz
                           price         numeric(12,2)
                           perishable    boolean
                           created_at    timestamptz
                           updated_at    timestamptz

product_batches (solo para productos perecederos)
---------------
id            bigint PK
product_id    -> products.id
code          text            código de lote, opcional
expires_at    date
quantity      integer >= 0
```

## Arquitectura

El código está organizado **por feature**, no por tipo de archivo. En tres capas con una
regla de dependencia estricta:

```
layout/     el shell de la app. Puede importar de features y de shared.
features/   un dominio cada una. Importa de shared; entre features, solo por su index.js.
shared/     no sabe nada del inventario. Nunca importa de features.
```

Cada feature tiene siempre la misma estructura interna, así cualquiera sabe dónde buscar:

```
features/<feature>/
├── api/          service layer: las únicas funciones que hablan con Supabase
├── domain/       reglas de negocio puras, sin framework ni estado (testeables solas)
├── state/        estado compartido con runas
├── components/   UI de esa feature, dividida en list / item / form / dialog
├── types.js      los tipos del dominio en JSDoc
└── index.js      API pública: el resto de la app importa solo desde acá
```

```
src/lib/
├── layout/
│   ├── components/         AppSidebar, AppTopbar, ThemeToggle, SkipLink
│   ├── navigation.js       las secciones del menú
│   └── state/bootstrap.svelte.js   carga inicial de todas las features y realtime
├── features/
│   ├── products/
│   │   ├── api/products.service.js
│   │   ├── domain/{stock,validation,constants}.js
│   │   ├── state/{products,filters}.svelte.js
│   │   └── components/     ProductList, ProductTableRow, ProductCard, ProductForm,
│   │                       ProductFormDialog, ProductFilters, ProductCombobox,
│   │                       DeleteProductDialog, RestockPanel, StockBadge, StockBar,
│   │                       ProductListSkeleton
│   ├── categories/
│   │   ├── api/categories.service.js
│   │   ├── state/categories.svelte.js
│   │   └── components/     CategoryList, CategoryListItem, CategoryForm,
│   │                       DeleteCategoryDialog, CategoryListSkeleton
│   ├── movements/
│   │   ├── api/movements.service.js
│   │   ├── domain/{sales,validation,constants}.js
│   │   ├── state/movements.svelte.js
│   │   └── components/     MovementList, MovementListItem, MovementForm,
│   │                       MovementFormDialog, MovementFilters, MovementListSkeleton
│   ├── expiry/
│   │   ├── api/batches.service.js
│   │   ├── domain/{expiry,promo,constants}.js
│   │   ├── state/batches.svelte.js
│   │   └── components/     ExpiryList, ExpiryListItem, ExpiryStats, ExpiryBadge,
│   │                       PromoAdviceCard, DiscardBatchDialog, ExpiryListSkeleton
│   └── dashboard/
│       ├── domain/alerts.js        une alertas de stock y vencimientos
│       └── components/             AlertsCard, AlertListItem, StatsGrid,
│                                   DashboardSkeleton
└── shared/
    ├── api/{client,errors}.js      cliente de Supabase y traducción de errores
    ├── components/
    │   ├── ui/                     shadcn-svelte (generado)
    │   ├── forms/FormField.svelte
    │   ├── data/{StatTile,Paginator}.svelte
    │   └── feedback/{EmptyState,ErrorAlert,SupabaseSetupNotice}.svelte
    ├── hooks/{pagination,is-mobile}.svelte.js
    ├── state/{status,notify}.js    carga/error transversal y avisos
    ├── utils/{format,forms,cn}.js
    └── config/app.js
```

Tres decisiones que vale la pena explicar:

- **Las rutas solo componen.** `src/routes/*/+page.svelte` arma la pantalla con componentes
  de las features y maneja qué diálogo está abierto. No tiene lógica de negocio ni llamadas
  a la base.
- **`shared/state/status.svelte.js` concentra carga y error.** Sus helpers `run()` y
  `load()` envuelven cada acción: marcan ocupado, traducen el error, avisan al usuario y
  devuelven si salió bien. Así ninguna feature repite el mismo try/catch.
- **`domain/` no importa nada del framework.** Son funciones puras: se les pasan datos y
  devuelven datos. Es donde viven las reglas de stock, los estados de vencimiento, el
  ritmo de venta y la sugerencia de promoción.

## Idioma del código

La **base de datos y los identificadores del código están en inglés**; los textos que ve
el usuario, en español. Es decir: la columna es `min_stock`, el campo del tipo es
`min_stock`, y la etiqueta en pantalla dice "Stock mínimo".

Los valores de estado también son códigos en inglés (`inbound`, `outbound`, `adjustment`
para los movimientos; `out`, `low`, `ok` para el stock; `expired`, `critical`, `soon` para
los vencimientos), y cada uno tiene su etiqueta en español en la capa de presentación.

## Modo claro y oscuro

El tema son variables CSS en `src/routes/layout.css`, con una paleta para cada modo (las
oficiales de shadcn, base `neutral`). El botón del encabezado alterna entre claro y oscuro
con **mode-watcher**, que guarda la preferencia en `localStorage`; en la primera visita se
usa la del sistema operativo. Un script en `app.html` aplica el tema antes del primer
pintado, así no hay parpadeo blanco al recargar.

## Accesibilidad

- HTML semántico: `header`, `nav`, `main`, `footer`, listas, tablas con `caption`,
  `th scope` y `aria-sort` en las columnas ordenables.
- Enlace "Saltar al contenido principal" como primer elemento enfocable.
- Formularios con `label` asociado a cada campo (componente `FormField`),
  `aria-describedby` para las ayudas, `aria-invalid` y errores vinculados al campo.
- Diálogos y menús sobre bits-ui: atrapan el foco, cierran con `Escape` y devuelven el
  foco al disparador.
- Avisos anunciados por regiones `aria-live` y toasts de sonner; el botón de tema expone
  su estado con `aria-pressed`.
- Barras de nivel de stock con rol de progreso y `aria-valuetext` descriptivo.
- Botones de solo icono con texto accesible oculto; iconos decorativos con `aria-hidden`.
- Foco visible en todos los controles y respeto por `prefers-reduced-motion`.
- `pnpm check` pasa sin errores ni advertencias.

## Responsive

- Hasta `lg` (1024px) la tabla de productos se reemplaza por tarjetas, sin scroll
  horizontal.
- Hasta `xl` los layouts de dos columnas pasan a una sola.
- Hasta `sm` los formularios y filtros pasan a una columna y el encabezado compacta la
  marca.

## Próximo paso: multi-tenant

La idea es que cada usuario pueda crear su propio negocio y ver solo su inventario. El
camino desde acá:

1. Activar **Supabase Auth** (email + contraseña) y una pantalla de login.
2. Agregar una tabla `businesses` y una `business_members` que relacione usuarios con
   negocios y su rol.
3. Agregar `business_id` a `categories`, `products` y `stock_movements`.
4. Reemplazar las políticas RLS abiertas de hoy (`using (true)`) por políticas que filtren
   por los negocios del usuario autenticado.
5. Un selector de negocio en el encabezado que fije el `business_id` activo.

El trabajo del lado del cliente es menor: toda la lectura y escritura pasa por
`lib/supabase/`, así que el filtro por negocio se agrega en un solo lugar.
