const { ipcRenderer } = require('electron');

// ═══════════════════════════════════════════════
//  CONSTANTES
// ═══════════════════════════════════════════════

const APP_PAGES = [
  'home','perfil','perfil-vendedor','tienda','carrito',
  'historial','pedidos','ajustes','mensajes','chat','admin','admin-ajustes'
];

const PRODUCTS = {
  zapatillas: { nombre:'Zapatillas Urban Red',          cat:'Calzado',    vendedor:'Carlos Martínez', precio:'$125.000', old:'$138.890', stock:'5 unidades', pct:'10%', img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',  txt:'Zapatillas de alto rendimiento con amortiguacion avanzada. Ideales para competencias de media distancia.' },
  audifonos:  { nombre:'Auriculares Studio Pro',        cat:'Tecnología', vendedor:'Elena Sanz',    precio:'$299.000', old:'',         stock:'12 unidades', pct:'0%',  img:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',  txt:'Auriculares profesionales con cancelación de ruido activa y sonido 360°.' },
  calzado:    { nombre:'Calzado Heritage High',         cat:'Calzado',    vendedor:'Carlos Martínez', precio:'$95.000',  old:'$126.670', stock:'20 unidades', pct:'25%', img:'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&q=80',  txt:'Calzado casual de alta calidad con suela resistente y diseño urbano.' },
  mochila:    { nombre:'Mochila City Stealth',          cat:'Accesorios', vendedor:'Elena Sanz',    precio:'$79.000',  old:'$83.160',  stock:'30 unidades', pct:'5%',  img:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',  txt:'Mochila urbana de material resistente al agua. Compartimentos organizados.' },
  reloj:      { nombre:'Reloj Elitist Gold',            cat:'Accesorios', vendedor:'Elena Sanz',    precio:'$345.000', old:'',         stock:'Agotado',    pct:'0%',  img:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80',  txt:'Reloj de lujo con acabados dorados y mecanismo suizo.' },
  planta:     { font:'Sora', nombre:'Set Botánico Urban', cat:'Hogar',      vendedor:'Carlos Martínez', precio:'$45.000',  old:'$56.250',  stock:'50 unidades', pct:'20%', img:'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80', txt:'Set de plantas decorativas de interior. Incluye 3 variedades.' },
  bolso:      { nombre:'Bolso Boutique',                cat:'Accesorios', vendedor:'Elena Sanz',    precio:'$125.000', old:'$138.880', stock:'18 unidades', pct:'10%', img:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80',  txt:'Bolso de cuero genuino con diseño moderno y elegante. Ideal para uso diario.' },
  cuadro:     { nombre:'Cuadro Decorativo',             cat:'Hogar',      vendedor:'Carlos Martínez', precio:'$25.000',  old:'$6.000',   stock:'40 unidades', pct:'25%', img:'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80', txt:'Cuadro decorativo minimalista para sala o habitación. Marco en madera natural.' },
  cuadromin:  { nombre:'Cuadro Decorativo Minimalista', cat:'Hogar',      vendedor:'Carlos Martínez', precio:'$29.000',  old:'',         stock:'25 unidades', pct:'0%',  img:'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80', txt:'Cuadro minimalista de líneas limpias, perfect para espacios modernos.' },
  bascula:    { nombre:'Bascula de Oro',                cat:'Hogar',      vendedor:'Elena Sanz',    precio:'$40.000',  old:'$4.000',   stock:'15 unidades', pct:'20%', img:'https://images.unsplash.com/photo-1578898886225-c7c894047899?w=400&q=80',  txt:'Bascula decorativa premium con acabados dorados. Diseño elegante para el hogar.' },
};

// USERS — se pueden agregar dinámicamente con doRegistro()
const USERS = {
  'juan_giraldo': { pass:'1234',     role:'comprador', name:'Juan_Giraldo', label:'Comprador' },
  'admin':        { pass:'admin123', role:'admin',     name:'Admin',        label:'Administrador' },
};

const SEGUIDOS = [
  { name:'Noth',                verified:true,  avatar:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80' },
  { name:'Andrea Valdiri',      verified:false, avatar:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80' },
  { name:'Paris Accesorios',    verified:false, avatar:'' },
  { name:'MARINO Cosme',        verified:false, avatar:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80' },
  { name:'Alex Castillo',       verified:false, avatar:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=80' },
  { name:'Asadero KIKE BRASAS', verified:false, avatar:'' },
  { name:'Lucas G.',            verified:false, avatar:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&q=80' },
];

const REPORTES = {
  'mario-alberto': {
    tipo:'Usuario', tipoCls:'badge-orange',
    reportado:'Mario Alberto – Vendedor',
    reportadoPor:'Alexa Perez – Comprador',
    motivo:'El vendedor me trató de forma irrespetuosa y utilizó lenguaje ofensivo durante nuestra conversación.',
    estado:'Pendiente', estadoCls:'badge-orange',
    fecha:'20 Oct, 2026',
    evidencias:[
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=60',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=60',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&q=60',
    ],
    respuesta: null,
    acciones:'usuario',
  },
  'nike-fi': {
    tipo:'Producto', tipoCls:'badge-blue',
    reportado:'Zapatillas NIKE F1 – Multigangas',
    reportadoPor:'Luis Arango – Vendedor',
    motivo:'Me dijeron que las zapatillas eran originales pero cuando las compre resultaron ser una replica, quiero que se hagan cargo de este producto y lo revisen.',
    estado:'Resuelto', estadoCls:'badge-green',
    fecha:'19 Oct, 2026',
    evidencias:[
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=60',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=60',
    ],
    respuesta:'Hola Luis Arango claro revisaremos el producto y veremos las acciones que vamos a aplicar sobre el producto o el vendedor.',
    acciones:'producto',
  },
};

let currentUser = null;

// ═══════════════════════════════════════════════
//  CARRITO — Estado reactivo
// ═══════════════════════════════════════════════

let cartItems = [
  { id:'zapatillas', nombre:'Zapatos Deportivos', cat:'Calzado',
    precio:79000, precioOld:95000,
    img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80',
    qty:1 },
  { id:'audifonos', nombre:'Auriculares Studio Pro', cat:'Tecnología',
    precio:598000, precioOld:0,
    img:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80',
    qty:2 },
];

const IVA_RATE      = 0.19;   // RF47: IVA Colombia
const COMISION_RATE = 0.10;   // RF131: 10% CommerCity, 90% vendedor

function fmtCOP(n) {
  return '$' + Math.round(n).toLocaleString('es-CO');
}

function calcCart() {
  const subtotal   = cartItems.reduce((s, i) => s + i.precio * i.qty, 0);
  const descuento  = cartItems.reduce((s, i) => s + (i.precioOld ? (i.precioOld - i.precio) * i.qty : 0), 0);
  const baseIVA    = subtotal - descuento;
  const iva        = Math.round(baseIVA * IVA_RATE);
  const total      = baseIVA + iva;
  // RF131: distribución
  const comision   = Math.round(total * COMISION_RATE);
  const vendedorNet = total - comision;
  return { subtotal, descuento, iva, total, comision, vendedorNet };
}

// RF131: calcular ganancia vendedor de una venta
function calcVendedorGanancia(precioTotal) {
  const comision    = Math.round(precioTotal * COMISION_RATE);
  const neto        = precioTotal - comision;
  return { comision, neto };
}

function renderCart() {
  const container = document.getElementById('cart-items-container');
  const emptyMsg  = document.getElementById('cart-empty');
  const summary   = document.getElementById('cart-summary-section');
  if (!container) return;

  if (cartItems.length === 0) {
    container.innerHTML = '';
    if (emptyMsg)  emptyMsg.style.display  = 'block';
    if (summary)   summary.style.display   = 'none';
    return;
  }

  if (emptyMsg) emptyMsg.style.display  = 'none';
  if (summary)  summary.style.display   = 'block';

  container.innerHTML = cartItems.map((item, idx) => `
    <div class="cart-item" id="cart-item-${idx}">
      <div class="cart-img"><img src="${item.img}" alt=""/></div>
      <div class="cart-info">
        <div class="cart-name">${item.nombre}</div>
        <div class="cart-cat">${item.cat}</div>
        <div class="cart-prices">
          ${item.precioOld ? `<div class="cart-old">${fmtCOP(item.precioOld)}</div>` : ''}
          <div class="cart-price">${fmtCOP(item.precio)}</div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:4px;margin:0 8px">
        <span style="font-size:9px;font-weight:700;color:var(--text2);letter-spacing:.06em;text-transform:uppercase">CANTIDAD</span>
        <div class="cart-qty">
          <button onclick="cartQty(${idx}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="cartQty(${idx}, 1)">+</button>
        </div>
      </div>
      <button class="cart-del" onclick="cartRemove(${idx})" title="Eliminar">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
          <path d="M3 5h14M8 5V3h4v2M6 5l1 12h6l1-12"/>
        </svg>
      </button>
    </div>
  `).join('');

  const { subtotal, descuento, iva, total } = calcCart();
  const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
  setTxt('sum-subtotal',  fmtCOP(subtotal));
  setTxt('sum-descuento', '– ' + fmtCOP(descuento));
  setTxt('sum-iva',       fmtCOP(iva));
  setTxt('sum-total',     fmtCOP(total));
}

function cartQty(idx, delta) {
  const item = cartItems[idx];
  const stock = STOCK_PRODUCTOS[item.id] !== undefined ? STOCK_PRODUCTOS[item.id] : 99;
  const targetQty = item.qty + delta;
  if (targetQty > stock) {
    showToast(`⚠️ Solo quedan ${stock} unidades disponibles de este producto.`);
    item.qty = stock;
  } else {
    item.qty = Math.max(1, targetQty);
  }
  renderCart();
}

function cartRemove(idx) {
  cartItems.splice(idx, 1);
  renderCart();
}

function addToCart(productKey, qty = 1) {
  const p = PRODUCTS[productKey]; if (!p) return;
  const stock = STOCK_PRODUCTOS[productKey] !== undefined ? STOCK_PRODUCTOS[productKey] : 99;
  const existing = cartItems.find(i => i.id === productKey);
  const currentQty = existing ? existing.qty : 0;
  if (currentQty + qty > stock) {
    const allowed = stock - currentQty;
    if (allowed <= 0) {
      showToast(`⚠️ No puedes agregar más. Ya alcanzaste el stock disponible (${stock} uds).`);
      return;
    }
    if (existing) {
      existing.qty = stock;
    } else {
      cartItems.push({
        id: productKey, nombre: p.nombre, cat: p.cat,
        precio: parseInt(p.precio.replace(/[^0-9]/g,'')),
        precioOld: p.old ? parseInt(p.old.replace(/[^0-9]/g,'')) : 0,
        img: p.img, qty: stock
      });
    }
    showToast(`⚠️ Se limitó la cantidad al stock disponible de ${stock} unidades.`);
  } else {
    if (existing) {
      existing.qty += qty;
    } else {
      cartItems.push({
        id: productKey, nombre: p.nombre, cat: p.cat,
        precio: parseInt(p.precio.replace(/[^0-9]/g,'')),
        precioOld: p.old ? parseInt(p.old.replace(/[^0-9]/g,'')) : 0,
        img: p.img, qty
      });
    }
    showToast(`✅ Producto agregado al carrito.`);
  }
  renderCart();
}

// ── PASARELA ──────────────────────────────────────────────────────

function abrirPago() {
  if (cartItems.length === 0) return;
  const { total } = calcCart();
  const totalStr = fmtCOP(total);
  const btn  = document.getElementById('pago-btn-total');
  const disp = document.getElementById('pago-total-display');
  if (btn)  btn.textContent  = totalStr;
  if (disp) disp.textContent = totalStr;
  // Reset a estado formulario
  const formEl = document.getElementById('pago-form-state');
  const okEl   = document.getElementById('pago-ok-state');
  if (formEl) formEl.style.display = 'block';
  if (okEl)   okEl.style.display   = 'none';
  // Limpiar error
  const errEl = document.getElementById('pago-error');
  if (errEl) errEl.style.display = 'none';
  document.getElementById('pago-overlay').classList.add('show');
}

function cerrarPago(e) {
  if (!e || e.target === document.getElementById('pago-overlay')) {
    document.getElementById('pago-overlay').classList.remove('show');
  }
}

function formatCardNumber(inp) {
  let v = inp.value.replace(/\D/g,'').slice(0,16);
  inp.value = v.match(/.{1,4}/g)?.join('-') || v;
}

function formatExpiry(inp) {
  let v = inp.value.replace(/\D/g,'').slice(0,4);
  if (v.length >= 2) v = v.slice(0,2) + '/' + v.slice(2);
  inp.value = v;
}

function confirmarPago() {
  // RF116: solo número de tarjeta y nombre del titular
  const num    = document.getElementById('pago-numero')?.value.replace(/\D/g,'');
  const nombre = document.getElementById('pago-nombre')?.value.trim();
  const errEl  = document.getElementById('pago-error');

  if (!num || num.length < 16) {
    if (errEl) { errEl.textContent = 'Ingresa un número de tarjeta válido (16 dígitos).'; errEl.style.display = 'block'; }
    return;
  }
  if (!nombre) {
    if (errEl) { errEl.textContent = 'Ingresa el nombre del titular de la tarjeta.'; errEl.style.display = 'block'; }
    return;
  }
  if (errEl) errEl.style.display = 'none';

  const { total } = calcCart();
  const totalStr = fmtCOP(total);
  const cartItemsSnapshot = [...cartItems]; // guardar para historial

  // Mostrar estado confirmado
  const formEl = document.getElementById('pago-form-state');
  const okEl   = document.getElementById('pago-ok-state');
  const okTot  = document.getElementById('pago-ok-total');
  if (formEl) formEl.style.display = 'none';
  if (okEl)   okEl.style.display   = 'block';
  if (okTot)  okTot.textContent    = totalStr;

  // Vaciar carrito y agregar al historial (RF27)
  agregarCompraAlHistorial([...cartItemsSnapshot]);
  cartItems = [];
  renderCart();
}

function descargarComprobante() {
  const txt = "CommerCity - Comprobante de pago\nFecha: " + new Date().toLocaleDateString('es-CO') + "\nEstado: APROBADO\n\n¡Gracias por tu compra!";
  const blob = new Blob([txt], {type:'text/plain'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'comprobante-commercity.txt';
  a.click();
}

function volverAlInicio() {
  document.getElementById('pago-overlay').classList.remove('show');
  navigate('home');
}



// ═══════════════════════════════════════════════
//  SIDEBAR
// ═══════════════════════════════════════════════

function applyRoleSidebar(role) {
  ['sb-sec-principal','sb-sec-cuenta','sb-sec-admin','nav-tienda','nav-pedidos','nav-admin'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  if (role === 'admin') {
    ['sb-sec-admin','nav-admin'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = id === 'nav-admin' ? 'flex' : 'block';
    });
  } else {
    ['sb-sec-principal','sb-sec-cuenta'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'block';
    });
    if (role === 'vendedor') {
      ['nav-tienda','nav-pedidos'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'flex';
      });
    }
  }
}

// ═══════════════════════════════════════════════
//  LOGIN / LOGOUT
// ═══════════════════════════════════════════════

function doRegistro() {
  const username = document.getElementById('reg-user').value.trim().toLowerCase();
  const pass     = document.getElementById('reg-pass').value;
  const confirm  = document.getElementById('reg-confirm').value;
  const esVend   = document.getElementById('reg-vendedor').checked;
  const errEl    = document.getElementById('reg-error');

  if (!username || username.length < 3) { errEl.textContent = 'El nombre de usuario debe tener al menos 3 caracteres.'; errEl.style.display='block'; return; }
  if (USERS[username]) { errEl.textContent = 'Ese nombre de usuario ya existe.'; errEl.style.display='block'; return; }
  if (pass.length < 4) { errEl.textContent = 'La contraseña debe tener al menos 4 caracteres.'; errEl.style.display='block'; return; }
  if (pass !== confirm) { errEl.textContent = 'Las contraseñas no coinciden.'; errEl.style.display='block'; return; }

  errEl.style.display = 'none';
  const role  = esVend ? 'vendedor' : 'comprador';
  const label = esVend ? 'Vendedor' : 'Comprador';
  const name  = username.charAt(0).toUpperCase() + username.slice(1);

  // Registrar el usuario en memoria
  USERS[username] = { pass, role, name, label };

  // Limpiar campos
  ['reg-user','reg-pass','reg-confirm'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });

  // Auto-login
  currentUser = { pass, role, name, label, username };
  document.getElementById('sb-user-initial').textContent = name[0].toUpperCase();
  document.getElementById('sb-user-name').textContent    = name;
  document.getElementById('sb-user-role').textContent    = label;
  applyRoleSidebar(role);
  navigate(role === 'admin' ? 'admin' : (role === 'vendedor' ? 'perfil-vendedor' : 'home'));
}

function doLogin() {
  const username = document.getElementById('login-user').value.trim().toLowerCase();
  const pass     = document.getElementById('login-pass').value;
  const errEl    = document.getElementById('login-error');
  const found    = USERS[username];

  if (!found || found.pass !== pass) { errEl.style.display = 'block'; return; }
  errEl.style.display = 'none';
  currentUser = { ...found, username };

  document.getElementById('sb-user-initial').textContent = found.name[0].toUpperCase();
  document.getElementById('sb-user-name').textContent    = found.name;
  document.getElementById('sb-user-role').textContent    = found.label;

  // Actualizar nombre en perfiles
  ['prof-name-display','prof-name-vendedor'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = found.name;
  });
  ['prof-initial-comprador','prof-initial-vendedor'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = found.name[0].toUpperCase();
  });

  applyRoleSidebar(found.role);
  navigate(found.role === 'admin' ? 'admin' : 'home');
}

function cambiarFotoPerfil(event, tipo) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const src = e.target.result;
    // Actualizar imagen en perfil comprador y vendedor
    ['comprador','vendedor'].forEach(t => {
      const img = document.getElementById('prof-img-' + t);
      const ini = document.getElementById('prof-initial-' + t);
      if (img) { img.src = src; img.style.display = 'block'; }
      if (ini) ini.style.display = 'none';
    });
    // Actualizar avatar sidebar y topbar
    const sbAv = document.getElementById('sb-user-initial');
    if (sbAv && currentUser) sbAv.textContent = currentUser.name[0].toUpperCase();
  };
  reader.readAsDataURL(file);
}

function doLogout() {
  currentUser = null;
  const lu = document.getElementById('login-user');
  const lp = document.getElementById('login-pass');
  if (lu) lu.value = '';
  if (lp) lp.value = '';
  // Reset avatares
  ['comprador','vendedor'].forEach(t => {
    const img  = document.getElementById('prof-img-' + t);
    const init = document.getElementById('prof-initial-' + t);
    if (img)  { img.src = ''; img.style.display = 'none'; }
    if (init) init.style.display = 'flex';
  });
  // Reset sb-avatar
  const sbAv = document.querySelector('.sb-avatar');
  if (sbAv) { sbAv.innerHTML = ''; sbAv.textContent = 'J'; }
  document.getElementById('sidebar').classList.remove('show');
  navigate('login');
}


function doRegistro() {
  const username  = document.getElementById('reg-user')?.value.trim().toLowerCase();
  const pass      = document.getElementById('reg-pass')?.value;
  const esVendedor = document.getElementById('reg-vendedor')?.checked;
  const errEl     = document.getElementById('reg-error');

  if (!username || !pass) { if(errEl){errEl.textContent='Completa todos los campos.';errEl.style.display='block';} return; }
  if (USERS[username])   { if(errEl){errEl.textContent='Ese usuario ya existe. Elige otro nombre.';errEl.style.display='block';} return; }

  const role  = esVendedor ? 'vendedor' : 'comprador';
  const label = esVendedor ? 'Vendedor'  : 'Comprador';

  // Registrar usuario en memoria
  USERS[username] = { pass, role, name: username, label };

  if (errEl) errEl.style.display = 'none';

  // Login automático
  currentUser = { pass, role, label, name: username, username };
  document.getElementById('sb-user-initial').textContent = username[0].toUpperCase();
  document.getElementById('sb-user-name').textContent    = username;
  document.getElementById('sb-user-role').textContent    = label;

  // Actualizar nombre en perfiles
  ['prof-name-display','prof-name-vendedor'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = username;
  });
  ['prof-initial-comprador','prof-initial-vendedor'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = username[0].toUpperCase();
  });
  document.getElementById('tb-avatar-home') && (document.getElementById('tb-avatar-home').textContent = username[0].toUpperCase());

  applyRoleSidebar(role);
  navigate(role === 'vendedor' ? 'perfil-vendedor' : 'home');
}

function convertirAVendedor() {
  if (!currentUser) return;
  currentUser.role  = 'vendedor';
  currentUser.label = 'Vendedor';
  USERS[currentUser.username].role  = 'vendedor';
  USERS[currentUser.username].label = 'Vendedor';
  document.getElementById('sb-user-role').textContent = 'Vendedor';
  applyRoleSidebar('vendedor');
  navigate('perfil-vendedor');
}

// ═══════════════════════════════════════════════
//  NAVEGACIÓN
// ═══════════════════════════════════════════════

function navigate(page) {
  const role = currentUser?.role;

  // Vendedor va a su perfil correcto
  if (page === 'perfil' && role === 'vendedor') page = 'perfil-vendedor';

  // Protecciones
  if (page === 'admin' && role !== 'admin') return;
  if (role === 'admin' && !['admin','admin-ajustes','login'].includes(page)) return;
  if (role === 'comprador' && ['tienda','pedidos','perfil-vendedor'].includes(page)) return;

  // Cerrar todos los overlays al navegar
  ['prod-overlay','pago-overlay','detalle-overlay','reporte-overlay',
   'modal-producto','seguidores-modal'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('show');
  });

  // Activar página
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');

  // Sidebar — admin nunca
  const sb = document.getElementById('sidebar');
  if (APP_PAGES.includes(page) && !['admin','admin-ajustes'].includes(page)) {
    sb.classList.add('show');
  } else {
    sb.classList.remove('show');
  }

  // Nav activo
  document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));
  const navMap = {
    home:'nav-home', carrito:'nav-carrito',
    perfil:'nav-perfil', 'perfil-vendedor':'nav-perfil',
    tienda:'nav-tienda', pedidos:'nav-pedidos',
    historial:'nav-historial', ajustes:'nav-ajustes',
    admin:'nav-admin', 'admin-ajustes':'nav-admin',
    mensajes:'nav-perfil', chat:'nav-perfil',
  };
  const activeNav = document.getElementById(navMap[page]);
  if (activeNav) activeNav.classList.add('active');

  document.getElementById('notif-panel')?.classList.remove('show');
  // Renderizar vistas reactivas al navegar
  if (page === 'carrito')   renderCart();
  if (page === 'historial') renderHistorial();
  if (page === 'pedidos')   renderPedidos();
  if (page === 'tienda')    renderTiendaStats();
  if (page === 'admin')     renderAdminStats();
  if (page === 'mensajes')  renderNotifPanel();
}

// ═══════════════════════════════════════════════
//  SEGUIDORES / SIGUIENDO
// ═══════════════════════════════════════════════

function openSeguidores(tab) {
  const modal  = document.getElementById('seguidores-modal');
  const tabSeg = document.getElementById('tab-seguidores');
  const tabSig = document.getElementById('tab-siguiendo');
  const list   = document.getElementById('seguidores-list');
  if (!modal || !list) return;

  tabSeg.classList.toggle('active', tab === 'seguidores');
  tabSig.classList.toggle('active', tab === 'siguiendo');

  const data = tab === 'siguiendo' ? SEGUIDOS : SEGUIDOS.slice(0, 4);
  list.innerHTML = data.map(u => `
    <div class="seg-row">
      <div class="seg-av">${u.avatar ? `<img src="${u.avatar}" alt=""/>` : u.name[0]}</div>
      <span class="seg-name">${u.name}${u.verified ? ' 🟡' : ''}</span>
    </div>
  `).join('');

  modal.classList.add('show');
}

function closeSeguidores(e) {
  const modal = document.getElementById('seguidores-modal');
  if (!e || e.target === modal) modal.classList.remove('show');
}

// ═══════════════════════════════════════════════
//  ADMIN — REPORTES
// ═══════════════════════════════════════════════

function openReporte(key) {
  const r = REPORTES[key];
  if (!r) return;

  document.getElementById('rp-tipo').textContent       = r.tipo;
  document.getElementById('rp-tipo').className         = `badge ${r.tipoCls}`;
  document.getElementById('rp-reportado').textContent  = r.reportado;
  document.getElementById('rp-rep-por').textContent    = r.reportadoPor;
  document.getElementById('rp-motivo').textContent     = r.motivo;
  document.getElementById('rp-estado').textContent     = r.estado;
  document.getElementById('rp-estado').className       = `badge ${r.estadoCls}`;
  document.getElementById('rp-fecha').textContent      = r.fecha;
  document.getElementById('rp-evidencias').innerHTML   = r.evidencias
    .map(s => `<div class="rp-ev-thumb"><img src="${s}" alt=""/></div>`).join('');

  const respBox = document.getElementById('rp-respuesta-box');
  const respTxt = document.getElementById('rp-respuesta-txt');
  const respEnv = document.getElementById('rp-respuesta-enviada');
  if (r.respuesta) {
    respBox.style.display = 'none';
    respEnv.style.display = 'block';
    respTxt.textContent   = r.respuesta;
  } else {
    respBox.style.display = 'block';
    respEnv.style.display = 'none';
    respTxt.textContent   = '';
  }

  document.getElementById('rp-acciones-usuario').style.display  = r.acciones==='usuario'  ? 'block':'none';
  document.getElementById('rp-acciones-producto').style.display = r.acciones==='producto' ? 'block':'none';

  document.getElementById('reporte-overlay').classList.add('show');
}

function closeReporte(e) {
  const o = document.getElementById('reporte-overlay');
  if (!e || e.target === o) o.classList.remove('show');
}


function cambiarFotoPerfil(event, tipo) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const url = e.target.result;
    // Aplicar a ambos perfiles (comprador y vendedor comparten imagen)
    ['comprador','vendedor'].forEach(t => {
      const img  = document.getElementById('prof-img-' + t);
      const init = document.getElementById('prof-initial-' + t);
      if (img)  { img.src = url; img.style.display = 'block'; }
      if (init) init.style.display = 'none';
    });
    // Actualizar avatar del sidebar
    const sbAv = document.getElementById('sb-user-initial');
    if (sbAv && sbAv.tagName !== 'IMG') {
      // Cambiar el sb-avatar a imagen
      const sbAvDiv = document.querySelector('.sb-avatar');
      if (sbAvDiv) {
        sbAvDiv.innerHTML = '';
        const imgEl = document.createElement('img');
        imgEl.src = url;
        imgEl.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%';
        sbAvDiv.appendChild(imgEl);
      }
    }
  };
  reader.readAsDataURL(file);
}

// ═══════════════════════════════════════════════
//  MISC UI
// ═══════════════════════════════════════════════

function togglePass(id) {
  const el = document.getElementById(id);
  el.type = el.type === 'password' ? 'text' : 'password';
}

function toggleNotif() {
  document.getElementById('notif-panel').classList.toggle('show');
}

function closeProd(e)      { if (e.target === document.getElementById('prod-overlay')) closeProdDirect(); }
function closeProdDirect() { document.getElementById('prod-overlay').classList.remove('show'); }

function addToCartAndClose() {
  const key = document.getElementById("pd-nombre")?.textContent;
  const found = Object.entries(PRODUCTS).find(([k,v]) => v.nombre === key);
  if (found) addToCart(found[0], parseInt(document.getElementById("pd-qty")?.textContent || "1"));
  closeProdDirect();
}

function openDetalle()   { document.getElementById('detalle-overlay').classList.add('show'); }
function closeDetalle(e) { if (!e || e.target===document.getElementById('detalle-overlay')) document.getElementById('detalle-overlay').classList.remove('show'); }

// confirmPago reemplazado por confirmarPago (sistema dinámico)

function openMensajes() { navigate('mensajes'); }

function openChat(name, avatar, img, prod, price) {
  // Reset completo del chat para permitir re-entrar siempre
  document.getElementById('chat-user-name').textContent  = name;
  document.getElementById('chat-user-av').textContent    = avatar;
  document.getElementById('chat-prod-img').src           = img;
  document.getElementById('chat-prod-name').textContent  = prod;
  document.getElementById('chat-prod-price').textContent = price;
  document.getElementById('chat-input').value            = '';
  document.getElementById('chat-messages').innerHTML = `
    <div class="prod-card-msg">
      <img src="${img}" style="width:100%;aspect-ratio:4/3;object-fit:cover;display:block"/>
      <div class="prod-card-msg-body">
        <div class="prod-card-msg-name">${prod}</div>
        <div class="prod-card-msg-price">${price}</div>
        <button class="btn btn-orange btn-full btn-sm">Ver Producto</button>
      </div>
    </div>
    <div class="msg-bubble msg-in"><div class="msg-text">Hola, ¿todavía está disponible el teclado?</div><div class="msg-time">12:03 AM</div></div>
    <div class="msg-bubble msg-out"><div class="msg-text">Si, aún tenemos stock disponible.</div><div class="msg-time">12:31 AM</div></div>
    <div class="msg-bubble msg-in"><div class="msg-text">¿Tiene garantía?</div><div class="msg-time">12:03 AM</div></div>
    <div class="msg-bubble msg-out"><div class="msg-text">Si, garantía de 6 meses.</div><div class="msg-time">12:23 AM</div></div>
  `;
  // Activar chat directamente sin usar navigate() para evitar bloqueos
  // Esto garantiza que siempre funciona sin importar el estado previo
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const chatPage = document.getElementById('page-chat');
  if (chatPage) chatPage.classList.add('active');

  // Asegurar sidebar visible con perfil activo
  const sb = document.getElementById('sidebar');
  if (sb) sb.classList.add('show');
  document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));
  const navPerfil = document.getElementById('nav-perfil');
  if (navPerfil) navPerfil.classList.add('active');

  // Scroll al fondo del chat
  const msgs = document.getElementById('chat-messages');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;

  // Cerrar notif si está abierto
  document.getElementById('notif-panel')?.classList.remove('show');
}

function sendMsg() {
  const inp = document.getElementById('chat-input');
  const txt = inp.value.trim(); if (!txt) return;
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'msg-bubble msg-out';
  div.innerHTML = `<div class="msg-text">${txt}</div><div class="msg-time">Ahora</div>`;
  container.appendChild(div);
  inp.value = '';
  container.scrollTop = container.scrollHeight;
}

// ═══════════════════════════════════════════════
//  EVENTOS GLOBALES
// ═══════════════════════════════════════════════

document.addEventListener('click', e => {
  const panel = document.getElementById('notif-panel');
  if (panel?.classList.contains('show') && !panel.contains(e.target) && !e.target.closest('.tb-icon-btn')) {
    panel.classList.remove('show');
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('page-chat')?.classList.contains('active')) sendMsg();
});

// ════════════════════════════════════════════════════════════
// RF3/4 — Recuperar y restablecer contraseña
// ════════════════════════════════════════════════════════════

let recoveryUser = null;

function doRecuperar() {
  const username = document.getElementById('rec-user')?.value.trim().toLowerCase();
  const errEl    = document.getElementById('rec-error');
  const formEl   = document.getElementById('rec-form');
  const okEl     = document.getElementById('rec-ok');
  if (!username || !USERS[username]) {
    if (errEl) errEl.style.display = 'block'; return;
  }
  recoveryUser = username;
  if (errEl)  errEl.style.display  = 'none';
  if (formEl) formEl.style.display = 'none';
  if (okEl)   okEl.style.display   = 'block';
}

function checkPasswordStrength(pass) {
  const bars  = ['str-1','str-2','str-3'].map(id => document.getElementById(id));
  const label = document.getElementById('str-label');
  let score = 0;
  if (pass.length >= 6) score++;
  if (pass.length >= 10) score++;
  if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score++;
  const colors = ['var(--red)','var(--orange)','var(--green)'];
  const labels = ['Débil','Regular','Fuerte'];
  bars.forEach((b, i) => { if (b) b.style.background = i < score ? colors[score-1] : 'var(--bg4)'; });
  if (label) { label.textContent = pass ? labels[score-1]||'Débil' : 'Ingresa una contraseña'; label.style.color = pass ? colors[score-1] : 'var(--text3)'; }
}

function doRestablecer() {
  const p1    = document.getElementById('reset-p1')?.value;
  const p2    = document.getElementById('reset-p2')?.value;
  const errEl = document.getElementById('reset-error');
  if (!p1 || p1.length < 6) { if (errEl) { errEl.textContent='La contraseña debe tener al menos 6 caracteres.'; errEl.style.display='block'; } return; }
  if (p1 !== p2)             { if (errEl) { errEl.textContent='Las contraseñas no coinciden.'; errEl.style.display='block'; } return; }
  if (errEl) errEl.style.display = 'none';
  if (recoveryUser && USERS[recoveryUser]) USERS[recoveryUser].pass = p1;
  document.getElementById('reset-p1').value = '';
  document.getElementById('reset-p2').value = '';
  ['str-1','str-2','str-3'].forEach(id => { const el=document.getElementById(id); if(el) el.style.background='var(--bg4)'; });
  recoveryUser = null;
  showToast('✅ Contraseña restablecida. Ya puedes iniciar sesión.');
  navigate('login');
}

// ════════════════════════════════════════════════════════════
// RF16/17 — Editar descripción personal del perfil
// ════════════════════════════════════════════════════════════

function toggleBioEdit(tipo) {
  const editDiv = document.getElementById('bio-edit-' + tipo);
  const bioTxt  = document.getElementById(tipo === 'comprador' ? 'prof-bio-display' : 'prof-bio-vendedor');
  const input   = document.getElementById('bio-input-' + tipo);
  if (!editDiv) return;
  const isOpen = editDiv.style.display !== 'none';
  editDiv.style.display = isOpen ? 'none' : 'block';
  if (!isOpen && input && bioTxt) input.value = bioTxt.textContent;
}

function guardarBio(tipo) {
  const input  = document.getElementById('bio-input-' + tipo);
  const val    = input?.value.trim();
  if (!val) { showToast('⚠️ La descripción no puede estar vacía'); return; }
  document.querySelectorAll('.prof-bio-txt').forEach(el => el.textContent = val);
  const ajustesBio = document.getElementById('ajustes-bio');
  if (ajustesBio) ajustesBio.value = val;
  userBio = val;
  toggleBioEdit(tipo);
  showToast('✅ Descripción actualizada');
}

// ════════════════════════════════════════════════════════════
// RF59 / RF141 — Base de Datos de Ganancias, IVA y Auditoría Fiscal
// ════════════════════════════════════════════════════════════

const ADMIN_DB = {
  vendedoresTotales: 1248,
  compradoresTotales: 8902,
  comisionesTotales: 45280050, // en COP (10% de ventas)
  ivaTotal: 86032095,          // en COP (19% de IVA recaudado)
  devolucionesTotal: 0,
  transacciones: [
    { id:'TX-091', ref:'HC-001', concepto:'Venta MacBook Air (Alex Rivera)', fecha:'24 Oct, 2026', bruto:1299000, iva:246810, comision:154581, estado:'Liquidado' },
    { id:'TX-090', ref:'HC-002', concepto:'Venta TV LG 45 pulgadas (Elena Sanz)', fecha:'23 Oct, 2026', bruto:1900000, iva:361000, comision:226100, estado:'En tránsito' },
    { id:'TX-089', ref:'HC-003', concepto:'Venta iPhone 15 Pro (Julian Thorne)', fecha:'22 Oct, 2026', bruto:3000000, iva:570000, comision:357000, estado:'Liquidado' },
    { id:'TX-088', ref:'HC-004', concepto:'Venta iPad Pro 11" (Marco Rossi)', fecha:'21 Oct, 2026', bruto:2799000, iva:531810, comision:333081, estado:'Pendiente' },
  ]
};

function renderAdminStats() {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('admin-stat-vendedores', ADMIN_DB.vendedoresTotales.toLocaleString('es-CO'));
  set('admin-stat-compradores', ADMIN_DB.compradoresTotales.toLocaleString('es-CO'));
  set('admin-stat-comisiones', fmtCOP(ADMIN_DB.comisionesTotales));
  set('admin-stat-iva', fmtCOP(ADMIN_DB.ivaTotal));
  set('admin-stat-devoluciones', fmtCOP(ADMIN_DB.devolucionesTotal));

  const tbody = document.getElementById('admin-ganancias-tbody');
  if (tbody) {
    tbody.innerHTML = ADMIN_DB.transacciones.map(t => {
      const isDev = t.estado === 'Reembolsado' || t.comision < 0;
      const cls = isDev ? 'badge-red' : (t.estado === 'Liquidado' ? 'badge-green' : 'badge-orange');
      return `<tr>
        <td style="font-family:monospace;font-weight:700">${t.id} <span style="font-size:10px;color:var(--text3)">(${t.ref})</span></td>
        <td style="font-size:12px;font-weight:600">${t.concepto}</td>
        <td style="font-size:11px;color:var(--text2)">${t.fecha}</td>
        <td style="font-size:12px;${isDev ? 'color:var(--red)' : ''}">${isDev ? '– ' + fmtCOP(Math.abs(t.bruto)) : fmtCOP(t.bruto)}</td>
        <td style="font-size:12px;color:var(--orange);${isDev ? 'text-decoration:line-through' : ''}">${isDev ? '– ' + fmtCOP(Math.abs(t.iva)) : fmtCOP(t.iva)}</td>
        <td style="font-size:12px;font-weight:700;${isDev ? 'color:var(--red)' : 'color:var(--green)'}">${isDev ? '– ' + fmtCOP(Math.abs(t.comision)) : fmtCOP(t.comision)}</td>
        <td><span class="badge ${cls}" style="font-size:10px">${t.estado}</span></td>
      </tr>`;
    }).join('') || '<tr><td colspan="7" style="text-align:center;padding:16px;color:var(--text2)">Sin registros fiscales</td></tr>';
  }
}

// ════════════════════════════════════════════════════════════
// RF27-31 — Historial de compras dinámico con IVA
// ════════════════════════════════════════════════════════════

let historialCompras = [
  { id:'HC-001', pedidoId:'PED-002', productKeys:[{key:'mochila', qty:1, precio:1299000, nombre:'MacBook Air'}], vendedor:'Alex Rivera',   av:'AR', producto:'MacBook Air',       dir:'Cll 80 # 45-12, Bogotá',        fecha:'24 Oct, 2026', estado:'Entregado', qty:1, precioUnit:1299000, subtotal:1299000, iva:246810, total:1545810 },
  { id:'HC-002', pedidoId:'PED-001', productKeys:[{key:'audifonos', qty:2, precio:950000, nombre:'TV LG 45 pulgadas'}], vendedor:'Elena Sanz',    av:'ES', producto:'TV LG 45 pulgadas', dir:'Carrera 7 # 12-34, Medellín',   fecha:'23 Oct, 2026', estado:'En Camino', qty:2, precioUnit:950000,  subtotal:1900000, iva:361000, total:2261000 },
  { id:'HC-003', pedidoId:'PED-004', productKeys:[{key:'zapatillas', qty:1, precio:3000000, nombre:'iPhone 15 Pro'}], vendedor:'Julian Thorne', av:'JT', producto:'iPhone 15 Pro',     dir:'Cll 10 # 5-20, Cali',           fecha:'22 Oct, 2026', estado:'Entregado', qty:1, precioUnit:3000000, subtotal:3000000, iva:570000, total:3570000 },
  { id:'HC-004', pedidoId:'PED-003', productKeys:[{key:'cuadromin', qty:1, precio:2799000, nombre:'iPad Pro 11"'}], vendedor:'Marco Rossi',   av:'MR', producto:'iPad Pro 11"',      dir:'Av. El Dorado # 68-10, Bogotá', fecha:'21 Oct, 2026', estado:'Pendiente', qty:1, precioUnit:2799000, subtotal:2799000, iva:531810, total:3330810 },
];
let histFiltroActual = 'Todo';

// fmtCOP definido en línea 93

function renderHistorial() {
  const tbody = document.getElementById('historial-tbody');
  if (!tbody) return;
  const data = histFiltroActual === 'Todo' ? historialCompras : historialCompras.filter(h => h.estado === histFiltroActual);
  tbody.innerHTML = data.map(h => {
    const subtotal = h.subtotal || (h.precioUnit * h.qty);
    const iva   = h.iva || Math.round(subtotal * IVA_RATE);
    const total = h.total || (subtotal + iva);
    const cls   = h.estado==='Entregado'?'badge-green':h.estado==='En Camino'?'badge-orange':'badge-red';
    
    // RF35: Botón Cancelar solo visible cuando el estado es 'Pendiente'
    const cancelBtn = h.estado === 'Pendiente'
      ? `<button class="btn btn-sm" style="background:var(--red-bg);color:var(--red);border:1px solid rgba(239,68,68,.3);padding:4px 8px;font-size:11px" onclick="cancelarPedidoComprador('${h.id}')" title="Cancelar pedido y recibir devolución">Cancelar</button>`
      : '';

    return `<tr>
      <td><div class="seller-cell"><div class="seller-av">${h.av}</div>${h.vendedor}</div></td>
      <td style="font-size:13px;font-weight:600">${h.producto}</td>
      <td style="font-size:11px;color:var(--text2);max-width:130px">${h.dir}</td>
      <td style="font-size:11px;color:var(--text2)">${h.fecha}</td>
      <td><span class="badge ${cls}">${h.estado}</span></td>
      <td style="text-align:center">${h.qty}</td>
      <td style="font-size:12px;color:var(--text2)">${fmtCOP(h.precioUnit)}</td>
      <td style="font-size:12px;color:var(--orange)">${fmtCOP(iva)}</td>
      <td style="font-weight:700">${fmtCOP(total)}</td>
      <td>
        <div style="display:flex;align-items:center;gap:6px">
          <button class="btn btn-ghost btn-sm" style="padding:4px 8px;font-size:11px" onclick="verDetalleHistorial('${h.id}')">Ver</button>
          ${cancelBtn}
        </div>
      </td>
    </tr>`;
  }).join('') || '<tr><td colspan="10" style="text-align:center;padding:24px;color:var(--text2)">Sin compras en este filtro</td></tr>';
}

function filtroHistorial(estado, el) {
  histFiltroActual = estado;
  document.querySelectorAll('.hist-ftab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
  renderHistorial();
}

function verDetalleHistorial(id) {
  const h = historialCompras.find(x => x.id === id);
  if (!h) return;
  const subtotal = h.subtotal || (h.precioUnit * h.qty);
  const desc     = Math.round(subtotal * 0.05);
  const iva      = h.iva || Math.round((subtotal - desc) * 0.19);
  const total    = h.total || (subtotal - desc + iva);
  const cls      = h.estado==='Entregado'?'badge-green':h.estado==='En Camino'?'badge-orange':'badge-red';
  const body     = document.getElementById('hist-detalle-body');
  const actions  = document.getElementById('hist-detalle-actions');
  if (!body) return;
  body.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
      <div><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px">Pedido</div><div style="font-size:13px;font-weight:600">${h.id}</div></div>
      <div><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px">Estado</div><span class="badge ${cls}">${h.estado}</span></div>
      <div><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px">Vendedor</div><div style="font-size:13px">${h.vendedor}</div></div>
      <div><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px">Fecha</div><div style="font-size:13px;color:var(--text2)">${h.fecha}</div></div>
      <div style="grid-column:1/-1"><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px">Dirección</div><div style="font-size:13px;color:var(--text2)">${h.dir}</div></div>
      <div style="grid-column:1/-1"><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px">Producto</div><div style="font-size:13px;font-weight:600">${h.producto} × ${h.qty}</div></div>
    </div>
    <div style="background:var(--bg3);border-radius:12px;padding:14px 16px">
      <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:8px"><span style="color:var(--text2)">Subtotal</span><span>${fmtCOP(subtotal)}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:8px"><span style="color:var(--text2)">Descuento (5%)</span><span style="color:var(--blue)">– ${fmtCOP(desc)}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:10px"><span style="color:var(--text2)">IVA (19%)</span><span style="color:var(--orange)">${fmtCOP(iva)}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:16px;font-weight:800;font-family:var(--font);border-top:1px solid var(--border);padding-top:10px"><span>Total pagado</span><span style="color:var(--orange)">${fmtCOP(total)}</span></div>
    </div>`;

  if (actions) {
    if (h.estado === 'Pendiente') {
      actions.innerHTML = `
        <button class="btn btn-sm" style="background:var(--red-bg);color:var(--red);border:1px solid rgba(239,68,68,.3);padding:10px;font-weight:700;font-size:13px" onclick="cancelarPedidoComprador('${h.id}')">
          ✕ Cancelar Pedido y Solicitar Devolución
        </button>
        <button class="btn btn-ghost btn-full" onclick="document.getElementById('hist-detalle-overlay').classList.remove('show')">Cerrar</button>
      `;
    } else {
      actions.innerHTML = `
        <button class="btn btn-ghost btn-full" onclick="document.getElementById('hist-detalle-overlay').classList.remove('show')">Cerrar</button>
      `;
    }
  }

  document.getElementById('hist-detalle-overlay')?.classList.add('show');
}

// ════════════════════════════════════════════════════════════
// RF35, RF36, RF59, RF89, RF129, RF137, RF141 — Cancelación de Pedidos Pendientes
// ════════════════════════════════════════════════════════════

function cancelarPedidoComprador(id) {
  const h = historialCompras.find(x => x.id === id);
  if (!h) {
    showToast('⚠️ No se encontró el pedido.');
    return;
  }

  // RF35: Solo si se encuentra en estado "Pendiente"
  if (h.estado !== 'Pendiente') {
    showToast(`⚠️ Solo se pueden cancelar pedidos en estado 'Pendiente'. (Estado actual: ${h.estado})`);
    return;
  }

  // Cálculo de montos de devolución
  const subtotal = h.subtotal || (h.precioUnit * h.qty);
  const iva = h.iva || Math.round(subtotal * IVA_RATE);
  const total = h.total || (subtotal + iva);
  const comision = Math.round(total * COMISION_RATE);  // RF59: 10% admin
  const vendedorNet = total - comision;                 // RF137: 90% vendedor

  // RF89: Restituir automáticamente el stock al producto
  if (h.productKeys && Array.isArray(h.productKeys)) {
    h.productKeys.forEach(pk => {
      if (STOCK_PRODUCTOS[pk.key] !== undefined) {
        STOCK_PRODUCTOS[pk.key] += pk.qty;
      }
    });
  } else {
    // Si no tiene productKeys estructurados, buscar coincidencia por nombre en PRODUCTS
    const foundEntry = Object.entries(PRODUCTS).find(([k, v]) => v.nombre.toLowerCase() === h.producto.toLowerCase());
    if (foundEntry && STOCK_PRODUCTOS[foundEntry[0]] !== undefined) {
      STOCK_PRODUCTOS[foundEntry[0]] += h.qty;
    }
  }

  // RF36: El pedido pendiente al ser cancelado desaparecerá del historial de compras
  historialCompras = historialCompras.filter(x => x.id !== id);

  // RF129: El pedido pendiente al ser cancelado desaparecerá de la sección pedidos
  if (h.pedidoIds && Array.isArray(h.pedidoIds)) {
    pedidosVendedor = pedidosVendedor.filter(p => !h.pedidoIds.includes(p.id));
  } else if (h.pedidoId) {
    pedidosVendedor = pedidosVendedor.filter(p => p.id !== h.pedidoId);
  } else {
    // Fallback por nombre y estado pendiente
    const idx = pedidosVendedor.findIndex(p => p.producto === h.producto && p.estado === 'Pendiente');
    if (idx !== -1) pedidosVendedor.splice(idx, 1);
  }

  // RF59: Se descuenta el 10% en estadísticas del administrador
  ADMIN_DB.comisionesTotales = Math.max(0, ADMIN_DB.comisionesTotales - comision);
  ADMIN_DB.devolucionesTotal += total;

  // RF141: El IVA del 19% será descontado desde la base de datos (sección Ganancias)
  ADMIN_DB.ivaTotal = Math.max(0, ADMIN_DB.ivaTotal - iva);

  // Registrar auditoría fiscal de la devolución en la base de datos del Admin
  ADMIN_DB.transacciones.unshift({
    id: 'DEV-' + String(ADMIN_DB.transacciones.length + 100).padStart(3, '0'),
    ref: h.id,
    concepto: `Devolución/Cancelación de pedido (${h.producto})`,
    fecha: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }),
    bruto: -subtotal,
    iva: -iva,
    comision: -comision,
    estado: 'Reembolsado'
  });

  // Cerrar modal de detalle si estaba abierto
  document.getElementById('hist-detalle-overlay')?.classList.remove('show');

  // Notificación reactiva
  notifications.unshift({
    id: Date.now(),
    tipo: '🛒',
    desc: `Reembolso exitoso: Pedido ${h.id} cancelado (${fmtCOP(total)} reembolsados)`,
    time: 'Ahora',
    read: false
  });

  // RF137 & RF129: Actualizar estadísticas de Mi Tienda (descuenta 90% y unidades vendidas)
  renderTiendaStats();
  renderPedidos();
  renderHistorial();
  renderAdminStats();
  renderProductsHome();
  renderNotifPanel();

  // RF35: Mensaje de éxito al comprador
  showToast(`✅ Pedido ${h.id} cancelado con éxito. Reembolso de ${fmtCOP(total)} completado y stock restituido.`);
}

// ════════════════════════════════════════════════════════════
// RF47/131 — IVA_RATE y COMISION_RATE definidos en línea 90-91
// calcCart() y calcVendedorGanancia() definidos en línea 97-114
// ════════════════════════════════════════════════════════════

function renderTiendaStats() {
  // RF126-130 + RF47/131: comisión 10% CommerCity, 90% vendedor
  const vendidas       = pedidosVendedor.reduce((s, p) => s + p.qty, 0);
  const ingresosBrutos = pedidosVendedor
    .filter(p => p.estado !== 'Pendiente')
    .reduce((s, p) => s + p.precio * p.qty, 0);
  const comision      = Math.round(ingresosBrutos * COMISION_RATE);  // RF131: 10%
  const ingresosNetos = ingresosBrutos - comision;                    // RF131: 90%
  const entregados    = pedidosVendedor.filter(p => p.estado === 'Entregado').length;
  const pendientes    = pedidosVendedor.filter(p => p.estado === 'Pendiente').length;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('tienda-ventas',     vendidas);
  set('tienda-ingresos',   fmtCOP(ingresosNetos));
  set('tienda-comision',   fmtCOP(comision));
  set('tienda-entregados', entregados);
  set('tienda-pendientes', pendientes);
}

// ════════════════════════════════════════════════════════════
// RF80 — Verificar stock al cambiar cantidad
// ════════════════════════════════════════════════════════════

const STOCK_PRODUCTOS = {
  zapatillas:5, audifonos:12, calzado:20, mochila:30, reloj:0, planta:50, bolso:18, cuadro:40, cuadromin:25, bascula:15
};

function changeQty(d) {
  const el  = document.getElementById('pd-qty');
  const key = document.getElementById('pd-nombre')?.dataset.key || '';
  const maxStock = STOCK_PRODUCTOS[key] !== undefined ? STOCK_PRODUCTOS[key] : 99;
  const cur = parseInt(el.textContent) || 1;
  const next = Math.max(1, Math.min(maxStock, cur + d));
  el.textContent = next;
  if (next >= maxStock && d > 0) showToast(`⚠️ Solo quedan ${maxStock} unidades en stock`);
}

// ════════════════════════════════════════════════════════════
// RF102 — Seguir y dejar de seguir a otros usuarios
// ════════════════════════════════════════════════════════════

function toggleFollowSeller(sellerName) {
  if (!sellerName) return;
  const index = SEGUIDOS.findIndex(s => s.name.toLowerCase() === sellerName.toLowerCase());
  if (index !== -1) {
    SEGUIDOS.splice(index, 1);
    showToast(`Dejaste de seguir a ${sellerName}`);
  } else {
    SEGUIDOS.push({ name: sellerName, verified: false, avatar: '' });
    showToast(`Ahora sigues a ${sellerName} 🎉`);
  }
  updateFollowButton(sellerName);
}

function updateFollowButton(sellerName) {
  const btn = document.getElementById('pd-follow-btn');
  if (!btn) return;
  const isFollowing = SEGUIDOS.some(s => s.name.toLowerCase() === sellerName.toLowerCase());
  btn.textContent = isFollowing ? 'Siguiendo' : 'Seguir';
  btn.className = isFollowing ? 'btn btn-orange btn-sm' : 'btn btn-ghost btn-sm';
}

// ════════════════════════════════════════════════════════════
// RF82/83 — Reportar producto (campos obligatorios)
// ════════════════════════════════════════════════════════════

let reportedProductKey = '';
let reportedProductEvidencia = '';

function openReportarProducto() {
  reportedProductKey = document.getElementById('pd-nombre')?.dataset.key || '';
  reportedProductEvidencia = '';
  const ubox = document.querySelector('#reportar-overlay .upload-box');
  if (ubox) ubox.textContent = '📎 Adjuntar foto';
  const imgInput = document.querySelector('#reportar-overlay input[type="file"]');
  if (imgInput) imgInput.value = '';
  document.getElementById('rep-motivo').value = '';
  closeProdDirect();
  document.getElementById('reportar-overlay')?.classList.add('show');
}

function handleEvidenciaUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    reportedProductEvidencia = e.target.result;
    const ubox = document.querySelector('#reportar-overlay .upload-box');
    if (ubox) ubox.textContent = `✓ Foto cargada (${file.name})`;
    showToast('✅ Evidencia cargada correctamente');
  };
  reader.readAsDataURL(file);
}

function closeReportarProducto(e) {
  const o = document.getElementById('reportar-overlay');
  if (!e || e.target === o) o?.classList.remove('show');
}

function enviarReporte() {
  const motivo = document.getElementById('rep-motivo')?.value.trim();
  if (!motivo) { showToast('⚠️ Campo obligatorio: Ingresa el motivo del reporte'); return; }
  if (!reportedProductEvidencia) { showToast('⚠️ Campo obligatorio: Adjunta una foto como evidencia'); return; }

  const p = PRODUCTS[reportedProductKey] || { nombre: 'Producto desconocido' };
  const key = 'rep-' + Date.now();
  REPORTES[key] = {
    tipo: 'Producto', tipoCls: 'badge-blue',
    reportedKey: reportedProductKey,
    reportado: `${p.nombre} – ${p.vendedor || 'Desconocido'}`,
    reportadoPor: (currentUser ? currentUser.name : 'Juan_Giraldo') + ' – Comprador',
    motivo: motivo,
    estado: 'Pendiente', estadoCls: 'badge-orange',
    fecha: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }),
    evidencias: [reportedProductEvidencia],
    respuesta: null,
    acciones: 'producto'
  };

  // Agregar notificación para Admin
  notifications.unshift({
    id: Date.now(),
    tipo: 'reporte',
    desc: `Nuevo reporte sobre "${p.nombre}"`,
    time: 'Ahora',
    read: false
  });
  renderNotifPanel();

  // Actualizar tabla admin si existe
  renderAdminReportesTable();

  document.getElementById('reportar-overlay')?.classList.remove('show');
  showToast('✅ Reporte enviado correctamente al administrador.');
}

function renderAdminReportesTable() {
  const tables = document.querySelectorAll('.admin-table');
  if (tables.length >= 3) {
    const reportesTable = tables[2];
    const tbody = reportesTable.querySelector('tbody');
    if (tbody) {
      tbody.innerHTML = Object.entries(REPORTES).map(([key, r]) => {
        return `
          <tr>
            <td><span class="badge ${r.tipoCls}" style="font-size:10px">${r.tipo}</span></td>
            <td style="font-size:12px">${r.reportado}</td>
            <td style="font-size:11px;color:var(--text2)">${r.fecha}</td>
            <td><span class="badge ${r.estadoCls}" style="font-size:10px">${r.estado}</span></td>
            <td><button class="btn btn-ghost btn-sm" style="padding:4px 12px;font-size:11px" onclick="openReporte('${key}')">${r.estado === 'Pendiente' ? 'Responder' : 'Ver'}</button></td>
          </tr>
        `;
      }).join('');
    }
  }
}

// ════════════════════════════════════════════════════════════
// RF85 — Deshabilitar "Agregar al carrito" si agotado
// ════════════════════════════════════════════════════════════

function openProd(key) {
  const p = PRODUCTS[key]; if (!p) return;
  const stock = STOCK_PRODUCTOS[key] !== undefined ? STOCK_PRODUCTOS[key] : 99;
  const agotado = stock === 0;

  document.getElementById('pd-img-src').src          = p.img;
  document.getElementById('pd-nombre').textContent   = p.nombre;
  document.getElementById('pd-nombre').dataset.key   = key;
  document.getElementById('pd-cat').textContent      = p.cat;
  document.getElementById('pd-precio').textContent   = p.precio;
  document.getElementById('pd-old').textContent      = p.old || '';
  document.getElementById('pd-stock').textContent    = agotado ? '⚠️ Agotado' : `${stock} unidades`;
  document.getElementById('pd-stock').style.color    = agotado ? 'var(--red)' : 'var(--text)';
  document.getElementById('pd-desc-pct').textContent = p.pct || '0%';
  document.getElementById('pd-desc-txt').textContent = p.txt;
  document.getElementById('pd-qty').textContent      = '1';

  // Mostrar el vendedor y configurar follow button (RF102)
  const sellerName = p.vendedor || 'CommerCity Store';
  const sellerAv = document.querySelector('.pd-seller-av');
  const sellerSpan = document.querySelector('.pd-seller span');
  if (sellerAv) sellerAv.textContent = sellerName[0].toUpperCase();
  if (sellerSpan) sellerSpan.textContent = sellerName;
  
  // Agregar o actualizar botón de seguir
  let followBtn = document.getElementById('pd-follow-btn');
  if (!followBtn) {
    const sellerContainer = document.querySelector('.pd-seller');
    if (sellerContainer) {
      followBtn = document.createElement('button');
      followBtn.id = 'pd-follow-btn';
      followBtn.style.marginLeft = 'auto';
      sellerContainer.appendChild(followBtn);
    }
  }
  if (followBtn) {
    followBtn.onclick = () => toggleFollowSeller(sellerName);
    updateFollowButton(sellerName);
  }

  // Estado del botón agregar (RF85)
  const addBtn = document.querySelector('#prod-detail-card .pd-actions .btn-orange');
  if (addBtn) {
    addBtn.disabled = agotado;
    addBtn.textContent = agotado ? 'Sin stock disponible' : 'Agregar al carrito';
    addBtn.style.opacity = agotado ? '0.5' : '1';
    addBtn.style.cursor  = agotado ? 'not-allowed' : 'pointer';
  }

  // Botón reportar
  const rptBtn = document.getElementById('pd-report-btn');
  if (rptBtn) rptBtn.style.display = 'flex';

  document.getElementById('prod-overlay').classList.add('show');
}

// ════════════════════════════════════════════════════════════
// RF95-100 — Notificaciones funcionales
// ════════════════════════════════════════════════════════════

let notifications = [
  { id:1, tipo:'🛒', desc:'Nueva compra recibida — "Reloj Casio" ha sido vendido', time:'Hace 5 min', read:false },
  { id:2, tipo:'💬', desc:'Nuevo mensaje de Juan — ¿Tienes stock del producto?',   time:'Hace 2 h',  read:false },
  { id:3, tipo:'📦', desc:'Pedido enviado — Audífonos Pro ya está en camino',       time:'1 día',     read:true  },
  { id:4, tipo:'🔒', desc:'Reporte de seguridad — inicio de sesión inusual',        time:'3 días',    read:true  },
];

function renderNotifPanel() {
  const list   = document.getElementById('notif-list');
  const unread = notifications.filter(n => !n.read).length;
  document.querySelectorAll('.notif-dot').forEach(d => d.style.display = unread > 0 ? 'block' : 'none');
  if (!list) return;
  if (!notifications.length) {
    list.innerHTML = '<div style="padding:24px;text-align:center;color:var(--text2);font-size:13px">Sin notificaciones 🎉</div>';
    return;
  }
  list.innerHTML = notifications.map(n => `
    <div class="notif-item" style="${!n.read?'background:rgba(239,153,24,.05)':''}" onclick="clickNotif(${n.id})">
      <div class="notif-icon">${n.tipo}</div>
      <div style="flex:1;min-width:0">
        <div class="notif-text">${n.desc}</div>
        <div class="notif-time">${n.time}</div>
      </div>
      <button onclick="event.stopPropagation();deleteNotif(${n.id})"
        style="background:none;border:none;cursor:pointer;color:var(--text3);font-size:14px;padding:2px 6px;border-radius:4px;transition:color .12s"
        onmouseover="this.style.color='var(--red)'" onmouseout="this.style.color='var(--text3)'">✕</button>
    </div>`).join('');
}

function toggleNotif() {
  const panel = document.getElementById('notif-panel');
  if (!panel) return;
  panel.classList.toggle('show');
  if (panel.classList.contains('show')) {
    notifications.forEach(n => n.read = true);
    renderNotifPanel();
  }
}

function deleteNotif(id) {
  notifications = notifications.filter(n => n.id !== id);
  renderNotifPanel();
}

function clearAllNotifs() {
  notifications = [];
  renderNotifPanel();
}

function clickNotif(id) {
  const n = notifications.find(x => x.id === id);
  if (!n) return;
  n.read = true;
  renderNotifPanel();
  document.getElementById('notif-panel')?.classList.remove('show');
  
  if (n.tipo === 'mensajes' || n.tipo === '💬') {
    navigate('mensajes');
  } else if (n.tipo === 'compra' || n.tipo === 'pedido' || n.tipo === '🛒' || n.tipo === '📦') {
    if (currentUser?.role === 'vendedor') navigate('pedidos');
    else navigate('historial');
  } else if (n.tipo === 'en camino' || n.tipo === 'entregado' || n.tipo === '✅') {
    navigate('historial');
  } else if (n.tipo === 'reporte' || n.tipo === '🔒') {
    if (currentUser?.role === 'admin') navigate('admin');
  }
}

// ════════════════════════════════════════════════════════════
// RF116 — Pasarela: solo número y nombre de tarjeta
// ════════════════════════════════════════════════════════════

function formatCardNumber(inp) {
  let v = inp.value.replace(/\D/g,'').slice(0,16);
  inp.value = v.match(/.{1,4}/g)?.join('-') || v;
}

function abrirPago() {
  if (!cartItems || cartItems.length === 0) return;
  const t = calcCart().total;
  const totalStr = fmtCOP(t);
  const btn  = document.getElementById('pago-btn-total');
  const disp = document.getElementById('pago-total-display');
  if (btn)  btn.textContent  = totalStr;
  if (disp) disp.textContent = totalStr;
  const formEl = document.getElementById('pago-form-state');
  const okEl   = document.getElementById('pago-ok-state');
  if (formEl) formEl.style.display = 'block';
  if (okEl)   okEl.style.display   = 'none';
  const errEl = document.getElementById('pago-error');
  if (errEl) errEl.style.display = 'none';
  
  // Reset rating interface
  const stars = document.querySelectorAll('.stars-rating span');
  stars.forEach(s => { s.textContent = '☆'; s.style.color = 'var(--text3)'; });
  const confirmMsg = document.getElementById('rating-confirm-msg');
  if (confirmMsg) confirmMsg.style.display = 'none';
  
  document.getElementById('pago-overlay').classList.add('show');
}

function cerrarPago(e) {
  if (!e || e.target === document.getElementById('pago-overlay'))
    document.getElementById('pago-overlay').classList.remove('show');
}

function rateSeller(stars) {
  const starElements = document.querySelectorAll('.stars-rating span');
  starElements.forEach((el, i) => {
    el.textContent = i < stars ? '★' : '☆';
    el.style.color = i < stars ? 'var(--orange)' : 'var(--text3)';
  });
  const confirmMsg = document.getElementById('rating-confirm-msg');
  if (confirmMsg) {
    confirmMsg.textContent = `¡Gracias por calificar con ${stars} estrellas!`;
    confirmMsg.style.display = 'block';
  }
  showToast(`✅ Calificación de ${stars} estrellas registrada.`);
}

function confirmarPago() {
  const num    = document.getElementById('pago-numero')?.value.replace(/\D/g,'');
  const nombre = document.getElementById('pago-nombre')?.value.trim();
  const errEl  = document.getElementById('pago-error');
  if (!num || num.length < 16 || !nombre) {
    if (errEl) errEl.style.display = 'block'; return;
  }
  if (errEl) errEl.style.display = 'none';

  const { subtotal, descuento, iva, total, comision } = calcCart();
  const newPedidoIds = [];
  const itemsSnapshot = cartItems.map(item => ({
    key: item.id,
    nombre: item.nombre,
    qty: item.qty,
    precio: item.precio
  }));

  // Disminuir de STOCK_PRODUCTOS y agregar a pedidosVendedor
  cartItems.forEach(item => {
    if (STOCK_PRODUCTOS[item.id] !== undefined) {
      STOCK_PRODUCTOS[item.id] = Math.max(0, STOCK_PRODUCTOS[item.id] - item.qty);
    }
    
    // Crear pedido para vendedor
    const pId = 'PED-' + String(pedidosVendedor.length + 1).padStart(3, '0');
    newPedidoIds.push(pId);
    pedidosVendedor.unshift({
      id: pId,
      cliente: currentUser ? currentUser.name : 'Juan_Giraldo',
      dir: document.getElementById('ajustes-dir')?.value || 'Calle 123 # 45-67, Cali',
      fecha: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }),
      producto: item.nombre,
      productKey: item.id,
      qty: item.qty,
      precio: item.precio,
      estado: 'Pendiente'
    });
  });

  // Agregar al historial del comprador
  const hcId = 'HC-' + String(historialCompras.length + 1).padStart(3,'0');
  const nuevaCompra = {
    id: hcId,
    pedidoIds: newPedidoIds,
    productKeys: itemsSnapshot,
    vendedor: 'CommerCity Store', av: 'CC',
    producto: cartItems.map(i => i.nombre).join(', '),
    dir: document.getElementById('ajustes-dir')?.value || 'Calle 123 # 45-67, Cali',
    fecha: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }),
    estado: 'Pendiente',
    qty: cartItems.reduce((s, i) => s + i.qty, 0),
    precioUnit: cartItems.length === 1 ? cartItems[0].precio : (subtotal - descuento),
    subtotal: subtotal - descuento,
    iva: iva,
    total: total
  };
  historialCompras.unshift(nuevaCompra);

  // Registrar en Base de Datos de Ganancias e IVA del Administrador (RF59, RF141)
  ADMIN_DB.comisionesTotales += comision;
  ADMIN_DB.ivaTotal += iva;
  ADMIN_DB.transacciones.unshift({
    id: 'TX-' + String(ADMIN_DB.transacciones.length + 90).padStart(3, '0'),
    ref: hcId,
    concepto: `Compra de ${nuevaCompra.producto} (${currentUser ? currentUser.name : 'Juan_Giraldo'})`,
    fecha: nuevaCompra.fecha,
    bruto: subtotal - descuento,
    iva: iva,
    comision: comision,
    estado: 'Pendiente'
  });

  // Notificación reactiva
  notifications.unshift({ id: Date.now(), tipo: '✅', desc: `Compra realizada por ${fmtCOP(total)}`, time: 'Ahora', read: false });
  renderNotifPanel();

  // Mostrar éxito
  const formEl = document.getElementById('pago-form-state');
  const okEl   = document.getElementById('pago-ok-state');
  const okTot  = document.getElementById('pago-ok-total');
  if (formEl) formEl.style.display = 'none';
  if (okEl)   okEl.style.display   = 'block';
  if (okTot)  okTot.textContent    = fmtCOP(total);
  cartItems = [];
  renderCart();
  renderProductsHome(); // Recargar grid para reflejar stock actualizado
  renderAdminStats();
  renderTiendaStats();
}

function descargarComprobante() {
  const txt = 'CommerCity — Comprobante de pago\nFecha: ' + new Date().toLocaleDateString('es-CO') + '\nEstado: APROBADO\n\n¡Gracias por tu compra!';
  const blob = new Blob([txt], {type:'text/plain'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'comprobante-commercity.txt'; a.click();
}

function volverAlInicio() {
  document.getElementById('pago-overlay').classList.remove('show');
  navigate('home');
}

// ════════════════════════════════════════════════════════════
// RF126-130 — Estadísticas de ventas en Mi Tienda
// ════════════════════════════════════════════════════════════

let pedidosVendedor = [
  { id:'PED-001', cliente:'Elena Sanz',    dir:'Carrera 7 # 12-34, Apt 201, Medellín', fecha:'23 Oct, 2026', producto:'TV LG 45 pulgadas', productKey:'audifonos', qty:2, precio:950000,  estado:'En camino' },
  { id:'PED-002', cliente:'Alex Rivera',   dir:'Cll 80 # 45-12, Bogotá',              fecha:'24 Oct, 2026', producto:'MacBook Air',        productKey:'mochila',   qty:1, precio:1299000, estado:'Entregado' },
  { id:'PED-003', cliente:'Marco Rossi',   dir:'Av. El Dorado # 68-10, Bogotá',       fecha:'21 Oct, 2026', producto:'iPad Pro 11"',       productKey:'cuadromin', qty:1, precio:2799000, estado:'Pendiente' },
  { id:'PED-004', cliente:'Julian Thorne', dir:'Cll 10 # 5-20, Cali',                 fecha:'22 Oct, 2026', producto:'iPhone 15 Pro',      productKey:'zapatillas',qty:1, precio:3000000, estado:'Entregado' },
];

let pedidoFiltroActual = 'Todo';

function renderTiendaStats() {
  // RF126-130 + RF47/131: comisión 10% CommerCity, 90% vendedor
  const vendidas       = pedidosVendedor.reduce((s, p) => s + p.qty, 0);
  const ingresosBrutos = pedidosVendedor
    .filter(p => p.estado !== 'Pendiente')
    .reduce((s, p) => s + p.precio * p.qty, 0);
  const comision      = Math.round(ingresosBrutos * COMISION_RATE);  // RF131: 10%
  const ingresosNetos = ingresosBrutos - comision;                    // RF131: 90%
  const entregados    = pedidosVendedor.filter(p => p.estado === 'Entregado').length;
  const pendientes    = pedidosVendedor.filter(p => p.estado === 'Pendiente').length;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('tienda-ventas',     vendidas);
  set('tienda-ingresos',   fmtCOP(ingresosNetos));
  set('tienda-comision',   fmtCOP(comision));
  set('tienda-entregados', entregados);
  set('tienda-pendientes', pendientes);

  // Renderizar historial de ventas en tienda (RF127, RF128, RF130)
  const tbody = document.getElementById('tienda-ventas-tbody');
  if (tbody) {
    tbody.innerHTML = pedidosVendedor.map(p => {
      const bruto = p.precio * p.qty;
      const com = Math.round(bruto * COMISION_RATE);
      const neto = bruto - com;
      const cls = p.estado==='Entregado'?'badge-green':p.estado==='En camino'?'badge-orange':'badge-red';
      return `<tr>
        <td style="font-weight:600">${p.producto} ×${p.qty}</td>
        <td>${p.cliente}</td>
        <td style="color:var(--text2);font-size:11px">${p.fecha}</td>
        <td>${fmtCOP(bruto)}</td>
        <td style="color:var(--red);font-size:11px">${fmtCOP(com)}</td>
        <td style="color:var(--green);font-weight:700">${fmtCOP(neto)}</td>
        <td><span class="badge ${cls}">${p.estado}</span></td>
      </tr>`;
    }).join('') || '<tr><td colspan="7" style="text-align:center;padding:20px;color:var(--text2)">No hay ventas registradas</td></tr>';
  }
}

function renderPedidos() {
  const tbody = document.getElementById('pedidos-tbody');
  if (!tbody) return;
  const data = pedidoFiltroActual === 'Todo' ? pedidosVendedor : pedidosVendedor.filter(p => p.estado === pedidoFiltroActual);
  tbody.innerHTML = data.map(p => {
    const cls = p.estado==='Entregado'?'badge-green':p.estado==='En camino'?'badge-orange':'badge-red';
    return `<tr>
      <td><div class="seller-cell"><div class="seller-av">${p.cliente[0]}${p.cliente.split(' ')[1]?.[0]||''}</div>${p.cliente}</div></td>
      <td style="font-size:11px;color:var(--text2);max-width:130px">${p.dir}</td>
      <td style="font-size:11px;color:var(--text2)">${p.fecha}</td>
      <td style="font-size:12px">${p.producto}</td>
      <td style="text-align:center">${p.qty}</td>
      <td><span class="badge ${cls}">${p.estado}</span></td>
      <td style="font-size:12px;color:var(--text2)">${fmtCOP(p.precio)}</td>
      <td style="font-weight:600">${fmtCOP(p.precio*p.qty)}</td>
      <td>
        <div style="display:flex;align-items:center;gap:6px">
          <select onchange="updatePedidoEstado('${p.id}',this.value)"
            style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:4px 8px;font-size:11px;color:var(--text);font-family:var(--ui);cursor:pointer;outline:none">
            <option value="Pendiente" ${p.estado==='Pendiente'?'selected':''}>Pendiente</option>
            <option value="En camino" ${p.estado==='En camino'?'selected':''}>En camino</option>
            <option value="Entregado" ${p.estado==='Entregado'?'selected':''}>Entregado</option>
          </select>
          <button class="btn btn-ghost btn-sm" style="padding:4px 8px;font-size:11px" onclick="openDetallePedido('${p.id}')">Detalle</button>
        </div>
      </td>
    </tr>`;
  }).join('') || '<tr><td colspan="9" style="text-align:center;padding:20px;color:var(--text2)">No hay pedidos</td></tr>';
}

function filtroPedido(estado, el) {
  pedidoFiltroActual = estado;
  document.querySelectorAll('.pedidos-ftab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
  renderPedidos();
}

function updatePedidoEstado(id, estado) {
  const p = pedidosVendedor.find(x => x.id === id);
  if (!p) return;
  p.estado = estado;
  renderPedidos();
  renderTiendaStats();
  notifications.unshift({ id:Date.now(), tipo: 'pedido', desc: `Pedido ${id} actualizado a "${estado}"`, time:'Ahora', read:false });
  renderNotifPanel();
  showToast(`✅ Estado actualizado a "${estado}"`);
}

function openDetallePedido(id) {
  const p = pedidosVendedor.find(x => x.id === id);
  if (!p) return;
  
  const overlay = document.getElementById('detalle-overlay');
  const panel = overlay.querySelector('.detalle-panel');
  const total = p.precio * p.qty;
  const cls = p.estado==='Entregado'?'badge-green':p.estado==='En camino'?'badge-orange':'badge-red';
  
  panel.innerHTML = `
    <div class="detalle-title">Detalle del pedido ${p.id} <span class="badge ${cls}" style="font-size:11px;margin-left:8px">${p.estado}</span></div>
    <div class="detalle-date">Fecha: ${p.fecha}</div>
    <div class="btn-seller-row">
      <div class="seller-av">${p.cliente[0]}</div>
      <div><div style="font-size:13px;font-weight:600">${p.cliente}</div></div>
    </div>
    <div class="detalle-lbl">Comprador</div><div class="detalle-val">${p.cliente}</div>
    <div class="detalle-lbl">Dirección de envío</div><div class="detalle-val">${p.dir}</div>
    <div class="detalle-lbl">Producto solicitado</div><div class="detalle-val">${p.producto}<br><span style="color:var(--text2)">Cantidad: ${p.qty} unidades</span></div>
    <div class="detalle-total">
      <span class="detalle-total-lbl">Precio total del pedido</span>
      <span class="detalle-total-val">${fmtCOP(total)}</span>
    </div>
    <button class="btn btn-ghost btn-full" onclick="closeDetalle()">Cerrar</button>
  `;
  overlay.classList.add('show');
}

function guardarCuentaBancaria() {
  showToast('✅ Cuenta bancaria guardada de forma segura.');
}

// ════════════════════════════════════════════════════════════
// TOAST global
// ════════════════════════════════════════════════════════════

function showToast(msg) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:var(--bg2);border:1px solid var(--orange);border-radius:12px;padding:12px 22px;font-size:13px;color:var(--text);z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,.4);transition:opacity .3s;pointer-events:none;white-space:nowrap';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

// ════════════════════════════════════════════════════════════
// Render al navegar
// ════════════════════════════════════════════════════════════

let currentCategoryFilter = 'Todos';

function renderProductsHome(customList = null) {
  const grid = document.getElementById('home-prod-grid');
  if (!grid) return;
  
  const listToRender = customList || Object.entries(PRODUCTS).map(([key, value]) => ({ key, ...value }));
  
  grid.innerHTML = listToRender.map(p => {
    const stock = STOCK_PRODUCTOS[p.key] !== undefined ? STOCK_PRODUCTOS[p.key] : 99;
    const isAgotado = stock === 0;
    const oldPriceHtml = p.old ? `<div class="prod-old">${p.old}</div>` : '';
    const discountHtml = p.pct && p.pct !== '0%' ? `<span class="prod-badge">${p.pct} desc.</span>` : '';
    const agotadoLabel = isAgotado ? `<span class="prod-badge" style="background:var(--red);color:#fff">AGOTADO</span>` : '';
    
    return `
      <div class="prod-card" onclick="openProd('${p.key}')" style="${isAgotado ? 'opacity: 0.75;' : ''}">
        <div class="prod-img">
          <img src="${p.img}" alt=""/>
          ${discountHtml}
          ${agotadoLabel}
        </div>
        <div class="prod-body">
          <div class="prod-name">${p.nombre}</div>
          <div style="font-size:11px;color:var(--text2);margin-bottom:4px">Vendedor: ${p.vendedor || 'CommerCity Store'}</div>
          ${oldPriceHtml}
          <div class="prod-price">${p.precio}</div>
        </div>
      </div>
    `;
  }).join('') || '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text2)">No se encontraron productos.</div>';
}

function filtrarProductos() {
  const q = document.getElementById('search-input')?.value.trim().toLowerCase() || '';
  const cat = document.getElementById('cat-filter')?.value || 'Todos';
  
  const filtered = Object.entries(PRODUCTS).map(([key, value]) => ({ key, ...value })).filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(q) || 
                          p.cat.toLowerCase().includes(q) || 
                          (p.vendedor && p.vendedor.toLowerCase().includes(q));
    const matchesCat = (cat === 'Todos' || p.cat === cat);
    return matchesSearch && matchesCat;
  });
  
  renderProductsHome(filtered);
}

function filtrarPorCategoria(cat) {
  const catText = document.getElementById('cat-selected-text');
  if (catText) {
    catText.textContent = cat === 'Todos' ? 'Categoría' : cat;
  }
  filtrarProductos();
}

document.addEventListener('DOMContentLoaded', () => {
  renderNotifPanel();
  renderProductsHome();
  renderAdminStats();
});

document.addEventListener('input', e => {
  if (e.target.id === 'reset-p1') checkPasswordStrength(e.target.value);
});
