const estado = {
    paso: 1,
    pedido: {
        tortas: [],  // Array para almacenar múltiples tortas
        fecha: null,
        total: 0
    }
};

// Funciones de inicialización
document.addEventListener('DOMContentLoaded', () => {
    inicializarAplicacion();
    cargarEventos();
});

function inicializarAplicacion() {
    actualizarIndicadorProgreso();
    mostrarPantalla(1);
    inicializarFechas();
    cargarDatosFormulario();
}

// Función para cargar los datos del catálogo almacenados en el archivo db en los formularios
function cargarDatosFormulario() {
    // Cargar tipos de torta
    const selectTipo = document.getElementById('tipo');
    if (selectTipo) {
        selectTipo.innerHTML = '<option value="">Selecciona un tipo</option>' +
            DB.tipos.map(tipo => `<option value="${tipo.id}">${tipo.nombre}</option>`).join('');
    }

    // Cargar tamaños con precios dinámicos
    const selectTamaño = document.getElementById('tamaño');
    if (selectTamaño) {
        selectTamaño.innerHTML = '<option value="">Selecciona un tamaño</option>' +
            DB.tamaños.map(tamaño => `<option value="${tamaño.id}">${tamaño.nombre}</option>`).join('');
    }

    // Actualizar precios cuando cambia el tipo o tamaño
    selectTipo?.addEventListener('change', actualizarPrecioMostrado);
    selectTamaño?.addEventListener('change', actualizarPrecioMostrado);

    // Cargar opcionales
    const opcionalesContainer = document.getElementById('opcionalesContainer');
    if (opcionalesContainer) {
        opcionalesContainer.innerHTML = DB.opcionales.map(opcional => `
            <div class="opcional">
                <input type="checkbox" id="opcional-${opcional.id}" name="opcionales" value="${opcional.id}">
                <label for="opcional-${opcional.id}">${opcional.nombre} (+$${opcional.precio})</label>
            </div>
        `).join('');
        agregarEventosOpcionales();
    }
}

// Función para actualizar el precio mostrado según la selección
function actualizarPrecioMostrado() {
    const tipo = document.getElementById('tipo').value;
    const tamaño = document.getElementById('tamaño').value;
    const opcionales = Array.from(document.querySelectorAll('input[name="opcionales"]:checked')).map(cb => cb.value);
    const precioElement = document.getElementById('subtotalTorta');
    
    if (tipo && tamaño) {
        const subtotal = calcularSubtotalTorta(tipo, tamaño, opcionales);
        precioElement.textContent = subtotal.toFixed(2);
    } else {
        precioElement.textContent = '0.00';
    }
}

// Asegurar que los checkboxes de opcionales actualicen el subtotal
function agregarEventosOpcionales() {
    document.querySelectorAll('input[name="opcionales"]').forEach(cb => {
        cb.addEventListener('change', actualizarPrecioMostrado);
    });
}

function cargarEventos() {
    // Eventos de navegación para la pantalla inicial
    document.querySelector('.pantalla-1 .btn-siguiente')?.addEventListener('click', avanzarPaso);

    // Eventos de navegación para botones "anterior"
    document.querySelectorAll('.btn-anterior').forEach(btn => {
        btn.addEventListener('click', retrocederPaso);
    });

    // Eventos de selección
    const formTorta = document.getElementById('formTorta');
    if (formTorta) {
        formTorta.addEventListener('submit', procesarSeleccionTorta);
        
        // Eventos para actualizar subtotal en tiempo real
        formTorta.querySelectorAll('select, input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', actualizarSubtotalForm);
        });
    }

    // Botón continuar en selección de tortas
    document.getElementById('btnContinuar')?.addEventListener('click', avanzarPaso);

    // Formulario de fecha
    const formFecha = document.getElementById('formFecha');
    if (formFecha) {
        formFecha.addEventListener('submit', procesarSeleccionFecha);
    }

    // Botones de la pantalla de resumen
    document.getElementById('btnConfirmar')?.addEventListener('click', confirmarPedido);
    document.getElementById('btnModificarPedido')?.addEventListener('click', modificarPedido);

    // Botón continuar en resumen (pantalla 4)
    document.getElementById('btnContinuarDatos')?.addEventListener('click', function(e) {
        e.preventDefault();
        estado.paso = 5;
        actualizarIndicadorProgreso();
        mostrarPantalla(5);
    });
    
    // Formulario de datos personales (pantalla 5)
    const formDatos = document.getElementById('formDatosPersonales');
    if (formDatos) {
        formDatos.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validarDatosPersonales()) {
                guardarDatosPersonales();
                estado.paso = 6;
                actualizarIndicadorProgreso();
                mostrarPantalla(6);
            }
        });
    }
}

// Función para volver a la pantalla de selección de tortas manteniendo los datos
function modificarPedido() {
    estado.paso = 2;
    actualizarIndicadorProgreso();
    mostrarPantalla(2);
    
    // Actualizar la vista de tortas existentes
    actualizarVistasTortas();
    
    // Mostrar el botón de continuar ya que hay tortas en el pedido
    document.getElementById('btnContinuar').style.display = 'block';
}

// Funciones de navegación
function avanzarPaso(e) {
    e.preventDefault();
    if (validarPasoActual()) {
        estado.paso++;
        actualizarIndicadorProgreso();
        mostrarPantalla(estado.paso);
    }
}

function retrocederPaso(e) {
    e.preventDefault();
    if (estado.paso > 1) {
        estado.paso--;
        actualizarIndicadorProgreso();
        mostrarPantalla(estado.paso);
    }
}

// Funciones de validación y procesamiento
// Función de validación para la selección de torta
function validarSeleccionTorta() {
    if (estado.pedido.tortas.length === 0) {
        alert('Por favor agrega al menos una torta al pedido');
        return false;
    }
    return true;
}

// Función de validación para la fecha
function validarSeleccionFecha() {
    const fecha = document.getElementById('fecha')?.value;
    if (!fecha) {
        alert('Por favor selecciona una fecha de entrega');
        return false;
    }
    return true;
}

// Validación de datos personales
function validarDatosPersonales() {
    const nombre = document.getElementById('nombre')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const telefono = document.getElementById('telefono')?.value.trim();
    if (!nombre || !email || !telefono) {
        alert('Por favor completa todos los campos de datos personales.');
        return false;
    }
    // Validación básica de email
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        alert('Por favor ingresa un correo electrónico válido.');
        return false;
    }
    return true;
}

function validarPasoActual() {
    switch(estado.paso) {
        case 1:
            return true; // Pantalla de inicio
        case 2:
            return validarSeleccionTorta();
        case 3:
            return validarSeleccionFecha();
        case 4:
            return true; // Pantalla de resumen
        case 5:
            return validarDatosPersonales();
        default:
            return false;
    }
}

function calcularSubtotalTorta(tipo, tamaño, opcionales) {
    const tortaBase = DB.tipos.find(t => t.id === parseInt(tipo));
    const tamañoId = parseInt(tamaño);
    let subtotal = 0;

    if (tortaBase && tamañoId) {
        // Obtener el precio específico para el tipo de torta y tamaño seleccionado
        subtotal = tortaBase.precios[tamañoId];
        
        // Sumar los opcionales
        opcionales.forEach(opcionalId => {
            const opcional = DB.opcionales.find(o => o.id === parseInt(opcionalId));
            if (opcional) {
                subtotal += opcional.precio;
            }
        });
    }

    return subtotal;
}

function actualizarSubtotalForm() {
    const tipo = document.getElementById('tipo').value;
    const tamaño = document.getElementById('tamaño').value;
    const opcionales = Array.from(document.querySelectorAll('input[name="opcionales"]:checked')).map(cb => cb.value);
    
    const subtotal = calcularSubtotalTorta(tipo, tamaño, opcionales);
    document.getElementById('subtotalTorta').textContent = subtotal.toFixed(2);
}

function procesarSeleccionTorta(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const nuevaTorta = {
        tipo: parseInt(formData.get('tipo')),
        tamaño: parseInt(formData.get('tamaño')),
        opcionales: Array.from(formData.getAll('opcionales')).map(Number),
        subtotal: calcularSubtotalTorta(
            formData.get('tipo'),
            formData.get('tamaño'),
            formData.getAll('opcionales')
        )
    };
    
    estado.pedido.tortas.push(nuevaTorta);
    actualizarVistasTortas();
    guardarEnLocalStorage();
    
    // Resetear el formulario
    e.target.reset();
    document.getElementById('subtotalTorta').textContent = '0';
    
    // Mostrar el botón de continuar si hay al menos una torta
    document.getElementById('btnContinuar').style.display = estado.pedido.tortas.length > 0 ? 'block' : 'none';
}

function eliminarTorta(index) {
    estado.pedido.tortas.splice(index, 1);
    actualizarVistasTortas();
    guardarEnLocalStorage();
    document.getElementById('btnContinuar').style.display = estado.pedido.tortas.length > 0 ? 'block' : 'none';
}

function actualizarVistasTortas() {
    const container = document.getElementById('tortasContainer');
    const totalElement = document.getElementById('totalPedido');
    
    container.innerHTML = estado.pedido.tortas.map((torta, index) => {
        const tipoTorta = DB.tipos.find(t => t.id === torta.tipo);
        const tamañoTorta = DB.tamaños.find(t => t.id === torta.tamaño);
        const opcionalesTexto = torta.opcionales
            .map(id => DB.opcionales.find(o => o.id === id)?.nombre)
            .filter(Boolean)
            .join(', ');
            
        return `
            <div class="torta-item">
                <button class="eliminar-torta" onclick="eliminarTorta(${index})">×</button>
                <h4>${tipoTorta?.nombre} - ${tamañoTorta?.nombre}</h4>
                <p>${opcionalesTexto ? 'Adicionales: ' + opcionalesTexto : 'Sin adicionales'}</p>
                <p class="subtotal">Subtotal: $${torta.subtotal.toFixed(2)}</p>
            </div>
        `;
    }).join('');
    
    const total = estado.pedido.tortas.reduce((sum, torta) => sum + torta.subtotal, 0);
    totalElement.textContent = total.toFixed(2);
}

function procesarSeleccionFecha(e) {
    e.preventDefault();
    estado.pedido.fecha = document.getElementById('fecha').value;
    
    guardarEnLocalStorage();
    avanzarPaso(e);
}

// Guardar datos personales en el estado
function guardarDatosPersonales() {
    estado.pedido.datosPersonales = {
        nombre: document.getElementById('nombre').value.trim(),
        email: document.getElementById('email').value.trim(),
        telefono: document.getElementById('telefono').value.trim()
    };
    guardarEnLocalStorage();
}

// Funciones de UI
function mostrarPantalla(paso) {
    console.log('Mostrando pantalla:', paso);
    document.querySelectorAll('.pantalla').forEach(p => p.style.display = 'none');
    const pantallaActual = document.querySelector(`.pantalla-${paso}`);
    if (pantallaActual) {
        pantallaActual.style.display = 'block';
    } else {
        console.error('No se encontró la pantalla:', paso);
    }
    
    if (paso === 4) {
        actualizarResumen();
    }
    if (paso === 6) {
        mostrarNombreConfirmacion();
    }
}

function mostrarNombreConfirmacion() {
    const nombre = estado.pedido.datosPersonales?.nombre || '';
    const nombreSpan = document.getElementById('nombreConfirmacion');
    if (nombreSpan) {
        nombreSpan.textContent = nombre;
    }
}

function actualizarIndicadorProgreso() {
    const progreso = document.querySelector('.progreso');
    if (progreso) {
        const porcentaje = ((estado.paso - 1) / 4) * 100;
        progreso.style.width = `${porcentaje}%`;
    }
}

// Funciones de fecha
function inicializarFechas() {
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        const hoy = new Date();
        const minDate = new Date(hoy.setDate(hoy.getDate() + DB.configFechas.diasMinimos));
        const maxDate = new Date(hoy.setDate(hoy.getDate() + DB.configFechas.diasMaximos));
        
        fechaInput.min = minDate.toISOString().split('T')[0];
        fechaInput.max = maxDate.toISOString().split('T')[0];
    }
}

// Funciones de localStorage
function guardarEnLocalStorage() {
    localStorage.setItem('pedidoTorta', JSON.stringify(estado.pedido));
}

function cargarDeLocalStorage() {
    const pedidoGuardado = localStorage.getItem('pedidoTorta');
    if (pedidoGuardado) {
        estado.pedido = JSON.parse(pedidoGuardado);
    }
}

// Funciones de cálculo
function calcularTotal() {
    let total = 0;
    
    // Precio base de la torta
    const torta = DB.tipos.find(t => t.id === estado.pedido.tipo);
    const tamaño = DB.tamaños.find(t => t.id === estado.pedido.tamaño);
    
    if (torta && tamaño) {
        total = torta.precio * tamaño.factor;
    }
    
    // Sumar opcionales
    estado.pedido.opcionales.forEach(opcionalId => {
        const opcional = DB.opcionales.find(o => o.id === opcionalId);
        if (opcional) {
            total += opcional.precio;
        }
    });
    
    return total;
}

function actualizarResumen() {
    const resumenElement = document.getElementById('resumen');
    if (!resumenElement) return;

    const tortasHtml = estado.pedido.tortas.map((torta, index) => {
        const tipoTorta = DB.tipos.find(t => t.id === torta.tipo);
        const tamañoTorta = DB.tamaños.find(t => t.id === torta.tamaño);
        const opcionalesSeleccionados = torta.opcionales
            .map(id => DB.opcionales.find(o => o.id === id))
            .filter(Boolean);

        return `
            <div class="torta-resumen">
                <h4>Torta ${index + 1}</h4>
                <p><strong>Tipo:</strong> ${tipoTorta?.nombre}</p>
                <p><strong>Tamaño:</strong> ${tamañoTorta?.nombre}</p>
                <p><strong>Opcionales:</strong> ${opcionalesSeleccionados.length ? 
                    opcionalesSeleccionados.map(o => o.nombre).join(', ') : 
                    'Ninguno'}</p>
                <p><strong>Subtotal:</strong> $${torta.subtotal.toFixed(2)}</p>
            </div>
        `;
    }).join('');

    const total = estado.pedido.tortas.reduce((sum, torta) => sum + torta.subtotal, 0);

    const html = `
        <h3>Resumen de tu pedido</h3>
        ${tortasHtml}
        <div class="resumen-total">
            <p><strong>Fecha de entrega:</strong> ${estado.pedido.fecha || 'No seleccionada'}</p>
            <h3>Total del pedido: $${total.toFixed(2)}</h3>
        </div>
    `;
    
    resumenElement.innerHTML = html;
}

// Función de confirmación (ahora solo para pantalla 6)
function confirmarPedido() {
    guardarEnLocalStorage();
    estado.paso = 6;
    actualizarIndicadorProgreso();
    mostrarPantalla(6);
}