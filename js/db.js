// Catálogo de productos
const DB = {
    // Tipos de torta con precios base por tamaño
    tipos: [
        { 
            id: 1, 
            nombre: "Torta Brownie", 
            precios: {
                1: 17000, // Precio para tamaño pequeño
                2: 22500, // Precio para tamaño mediano
                3: 26500  // Precio para tamaño grande
            }
        },
        { 
            id: 2, 
            nombre: "Brownie Oreo", 
            precios: {
                1: 19500, // Precio para tamaño pequeño
                2: 26500, // Precio para tamaño mediano
                3: 33500  // Precio para tamaño grande
            }
        },
        { 
            id: 3, 
            nombre: "Brownie Frutos Rojos", 
            precios: {
                1: 21500, // Precio para tamaño pequeño
                2: 29500, // Precio para tamaño mediano
                3: 36500  // Precio para tamaño grande
            }
        },
        { 
            id: 4, 
            nombre: "Chocotorta", 
            precios: {
                1: 16000, // Precio para tamaño pequeño
                2: 22500, // Precio para tamaño mediano
                3: 27500  // Precio para tamaño grande
            }
        }
    ],
    // Tamaños disponibles
    tamaños: [
        { id: 1, nombre: "Pequeña (16 CM, rinde 4/5 Porciones)" },
        { id: 2, nombre: "Mediana (20 CM, rinde 7/8 Porciones)" },
        { id: 3, nombre: "Grande (26 CM, rinde 14/16 Porciones)" }
    ],
    // Opcionales/Adicionales
    opcionales: [
        { id: 1, nombre: "Servilletas x50u", precio: 5870 },
        { id: 2, nombre: "Decoración personalizada", precio: 4000 },
        { id: 3, nombre: "Relleno especial", precio: 4000 },
        { id: 4, nombre: "Velas personalizadas", precio: 2000 }
    ],
    // Configuración de fechas
    configFechas: {
        diasMinimos: 2, // Mínimo de días para hacer un pedido
        diasMaximos: 30 // Máximo de días para hacer un pedido
    }
};