//Area de Funciones

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

function Ofertar(Premios_Restantes) {
 OfertaBanca = Math.round((Premios_Restantes.reduce((a, b) => a + b, 0) / Premios_Restantes.length) * 0.8);
}

function BuenaDecision() {
  //Esta funcion puede ser utilizada en el futuro para evaluar si la decision del jugador fue buena o mala en base a la oferta de la banca y el premio final
    if (OfertaBanca > Maletines[MaletinDelParticipante - 1]) {
        console.log("El jugador tomo una buena decision al aceptar la oferta de la banca");
        return true;
    } else {
        console.log("El jugador tomo una mala decision al aceptar la oferta de la banca");
        return false
    }
}

//Aerea de codigo Principal

let NombreParticipante = prompt("Decinos tu Nombre:", "Invitado"); //Pide el nombre del usuario via Prompt

if (NombreParticipante !== null && NombreParticipante !== "") {
  console.log("El jugador eligio el nombre valido " + NombreParticipante);
} else {
  NombreParticipante = "Invitado";
  console.log("El Jugador no eligio un nombre valido o adopto el nombre default 'Invitado'"); //Si no ingresa un nombre, lo vamos a llamar invitado
}
  
alert("Hola " + NombreParticipante + "! Este es un simulador simplificado del programa de television trato Hecho.");
alert(
    "A tu disposicion se encontraran 5 maletines con diferentes montos en premios iniciando en el valor 1$ y multiplicando dicho valor x10 en cada maletin llegando al posible premio maximo de 10.000$.\n\n" +
    "El contenido de los maletines es totalmente aleatorio (se mezclan al inicio de cada partida) y el objetivo del juego es que el concursante elija un maletin y luego vaya abriendo los demas maletines para ir revelando los premios que no ha elegido.\n\n" +
    "Despues de abrir un maletin, el 'banquero' hara una oferta al concursante para comprar su maletin elegido por un monto basado en los premios restantes en juego.\n\n" +
    "El concursante puede aceptar la oferta y terminar el juego, o rechazarla y continuar abriendo maletines.\n\n" +
    "El juego continua hasta que el concursante acepte una oferta o hasta que solo quede un maletin sin abrir, en cuyo caso el concursante gana el premio dentro de su maletin elegido.\n\n" +
    "la decisión final depende del análisis del riesgo y del valor potencial del premio, y el éxito del juego radica en la habilidad del concursante para tomar la mejor decisión en función de las ofertas y las probabilidades.\n\n" 
);
alert("Suerte!! Comencemos!!");

let Maletines = [1, 10, 100, 1000, 10000];
let Maletines_Numero = [1, 2, 3, 4, 5];
console.log("este es el array inicial de maletines antes de mezclar");
console.log(Maletines);

shuffle(Maletines);

//la siguiente linesa es para ver el contenido de los maletines con la intencion de debuggear el codigo, ocultar en produccion
console.log("este es el array inicial de maletines mezclados");
console.log(Maletines);

let MaletinDelParticipante = parseInt(prompt("Los maletines se han mezclado. Elige un maletin del 1 al 5:", "1")); //Pide al usuario que elija un maletin, default 1

    while (isNaN(MaletinDelParticipante) || MaletinDelParticipante < 1 || MaletinDelParticipante > 5) { //Valida que el maletin elegido sea un numero entre 1 y 5
      MaletinDelParticipante = parseInt(prompt("Por favor, elige un maletin valido del 1 al 5:", "1"));
    }

console.log("Etapa 1 - Inicia las verdaderas elecciones. doble al rojo XD");

alert("Has elegido el maletin numero " + MaletinDelParticipante + ". Ahora, abre los otros maletines uno por uno.");

let Premios_Restantes = Maletines.slice(); //Crea una copia del array completo inicial de Maletines para ir llevando un control Interno, no mostrar al usuario
Premios_Restantes.splice(MaletinDelParticipante - 1, 1); //Remueve el maletin elegido por el participante del array de premios restantes posicion -1 por el tema del indice que empieza en 0

let Premios_Restantes_Visible = Maletines.slice(); //Crea una copia del array completo inicial de Maletines para ir llevando un control visible al participante, no mostrar al usuario
shuffle(Premios_Restantes_Visible); //Mezcla el array para que el usuario no pueda deducir la posicion del premio en base al maletin elegido

let Maletines_Sin_abrir_Numero = Maletines_Numero.slice(); //Crea una copia del array completo inicial de Maletines con su numero
Maletines_Sin_abrir_Numero.splice(MaletinDelParticipante - 1, 1); //Remueve el maletin elegido por el participante del array de premios restantes posicion -1 por el tema del indice que empieza en 0

//area de debuggeo

console.log("El maletin elegido por el participante es el " + MaletinDelParticipante); //Muestra al debugger info sobre la eleccion del participante
console.log("contiene un premio de $" + Maletines[MaletinDelParticipante - 1]); //Muestra al debugger info sobre la eleccion del participante
console.log("Posicion en array del Maletin es" + (MaletinDelParticipante - 1)); //Muestra al debugger info sobre la eleccion del participante
console.log("valores disponibles no visibles al jugador");
console.log(Premios_Restantes); //Muestra al debugger los premios restantes en consola no visibles al jugador
console.log("valores disponibles visibles al jugador");
console.log(Premios_Restantes_Visible); //Muestra al debugger los premios restantes en consola visibles al jugador
console.log("Maletines que el usuario aun puede seleccionar");
console.log(Maletines_Sin_abrir_Numero); //Muestra al debugger los numeros de maletines que el usuario aun puede seleccionar

//fin area de debuggeo

let OfertaBanca = 0; // Inicializa la variable global OfertaBanca

while (Premios_Restantes.length > 1) { //Mientras queden mas de un maletin por abrir
  let MaletinAbierto = parseInt(prompt(
                                        "Por favor, elige un maletin valido para abrir del 1 al 5 (excepto el " + MaletinDelParticipante + " que es el tuyo):\n\n" +
                                        "Pista!! Maletines que aun puedes abrir: " + Maletines_Sin_abrir_Numero + "\n\n" +
                                        "Pista!! Premios que aun no han sido descubiertos: " + Premios_Restantes_Visible + "\n\n"));
    while (isNaN(MaletinAbierto) || MaletinAbierto < 1 || MaletinAbierto > 5 || MaletinAbierto === MaletinDelParticipante || !Premios_Restantes.includes(Maletines[MaletinAbierto - 1])) { //Valida que el maletin elegido sea un numero entre 1 y 5, que no sea el maletin del participante y que no haya sido abierto ya
      MaletinAbierto = parseInt(prompt(
                                        "Por favor, elige un maletin valido para abrir del 1 al 5 (excepto el " + MaletinDelParticipante + " que es el tuyo):\n\n" +
                                        "Pista!! Maletines que aun puedes abrir: " + Maletines_Sin_abrir_Numero + "\n\n" +
                                        "Pista!! Premios que aun no han sido descubiertos: " + Premios_Restantes_Visible + "\n\n"));
    }
    alert("Has abierto el maletin numero " + MaletinAbierto + ". El premio de $" + Maletines[MaletinAbierto - 1] + " Ya no esta mas disponible."); //Informa al usuario del premio encontrado
    Premios_Restantes.splice(Premios_Restantes.indexOf(Maletines[MaletinAbierto - 1]), 1); //Remueve el maletin abierto del array de premios restantes
    //la siguiente linesa es para ver el contenido de los maletines con la intencion de debuggear el codigo , ocultar en produccion
    
    console.log("Maletines aun sin descubrir:");
    console.log(Premios_Restantes);

    console.log("Maletines aun sin descubrir Visibles al jugador:");
    Premios_Restantes_Visible.splice(Premios_Restantes_Visible.indexOf(Maletines[MaletinAbierto - 1]), 1); //Remueve el maletin abierto del array de premios restantes visibles
    shuffle(Premios_Restantes_Visible); //Mezcla el array para que el usuario no pueda deducir la posicion del premio en base al maletin elegido
    console.log(Premios_Restantes_Visible); //Muestra al debugger los premios restantes en consola visibles al jugador

    console.log("Maletines que el usuario aun puede seleccionar:");
    Maletines_Sin_abrir_Numero.splice(Maletines_Sin_abrir_Numero.indexOf(MaletinAbierto), 1); //Remueve el maletin abierto del array de numeros de maletines que el usuario aun puede seleccionar
    console.log(Maletines_Sin_abrir_Numero); //Muestra al debugger los numeros de maletines que el usuario aun puede seleccionar

    alert("Premios aun sin descubrir: " + Premios_Restantes_Visible); //Muestra al usuario los premios restantes en un alert
    
    Ofertar(Premios_Restantes); //Calcula la oferta de la banca
    
    console.log("El banquero realiza una oferta al jugador de $" + OfertaBanca); //Muestra al debugger la oferta de la banca);

    let RespuestaOferta = prompt("El banquero te ofrece $" + OfertaBanca + " por tu maletin. ¿Aceptas la oferta? (si/no)", "no").toLowerCase(); //Pide al usuario que responda si acepta o no la oferta, default no
      
    while (RespuestaOferta !== "si" && RespuestaOferta !== "no") { //Valida que la respuesta sea si o no
        RespuestaOferta = prompt("Por favor, responde si o no.  ¿Aceptas la oferta de $" + OfertaBanca + " por tu maletin? (si/no)", "no").toLowerCase();
      }
    if (RespuestaOferta === "si") { //Si el usuario acepta la oferta
      console.log("El Jugador Decidio Aceptar la oferta de la banca de $" + OfertaBanca); //Muestra al debugger la decision del jugador
      alert("Has aceptado la oferta de $" + OfertaBanca + ". Tu juego ha terminado.");
      alert("El maletin que elegiste al principio contenia un premio de $" + Maletines[MaletinDelParticipante - 1] + "."); //Informa al usuario del premio en su maletin
      if (BuenaDecision()){
        alert("Felicidades, " + NombreParticipante + "! Tomaste una buena decision.");
      }
        else {
        alert("Lo siento, " + NombreParticipante + ". Tomaste una mala decision.");
        }
      alert("Gracias por jugar, " + NombreParticipante + "!");
      break; //Termina el juego
    } else { //Si el usuario no acepta la oferta
        console.log("El Jugador Decidio Rechazar la oferta de la banca de $" + OfertaBanca); //Muestra al debugger la decision del jugador
        alert("Has rechazado la oferta. El juego continua.");
    }
}

console.log("Etapa Final - Queda un solo maletin por abrir o el jugador acepto la oferta de la banca");

if (Premios_Restantes.length === 1) { //Si queda un solo maletin por abrir
  alert("Tu maletin contiene un premio de $" + Maletines[MaletinDelParticipante - 1] + "."); //Informa al usuario del premio en su maletin
  
    if (BuenaDecision()){
    alert("Felicidades, " + NombreParticipante + "! Tomaste una buena decision.");
    }
     else {
    alert("Lo siento, " + NombreParticipante + ". Tomaste una mala decision.");
    }

    alert("Gracias por jugar, " + NombreParticipante + "!");
}
