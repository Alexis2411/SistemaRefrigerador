//Constantes de acceso a elementos del documento HTML
const dispositivo = document.getElementById("dispositivo");
const iniciar = document.getElementById("iniciar");
const detener = document.getElementById("detener");
const refri = document.getElementById("refri");

//Opciones para conexion del publicador
const options = {
  connectTimeout: 4000,
  clientId: dispositivo.value,
  keepalive: 60,
  clean: true,
};

//Constante para url API ubidots CAMBIE LOS DATOS POR SU TOKEN PERSONAL
const brokerURL = "ws://www.grupocarjo.com:8083/mqtt";
const tasaRequest = 2500;

//Variables para manipulacion del emulador
var data;
var edoRefri = 0;
var bandIniciar = true;

//Eventos WS de MQTT
const client = mqtt.connect(brokerURL, options);

client.on("connect", () => {
  console.log("CLIENTE CONECTADO A BROKER 👌");

  client.subscribe("iot-device", function (err) {
    if (!err) {
      console.log("SUBSCRIBE - SUCCESS");
    } else {
      console.log("SUBSCRIBE - ERROR");
    }
  });
});

client.on("message", function (toipc, message) {
  console.log(message.toString());
  //console.log("Te topic is " + topic + " and the message is " + message.toString());
});

client.on("reconnect", (error) => {
  console.log("reconnecting:", error);
});

client.on("error", (error) => {
  console.log("Connect Error:", error);
});

//Manejador de Evento click del boton que inica el emulador
iniciar.addEventListener("click", () => {
  if (bandIniciar) {
    console.log(":::: INICA EMULACION :::");
    data = setInterval(generarDatos, tasaRequest);
    bandIniciar = false;
  }
});

//funcion para generar datos de prueba aleatorios para lectura de variables del emulador
function generarDatos() {
  let d = new Date();
  let t = d.toLocaleTimeString();

  let temperatura = parseFloat((Math.random() * (36 - 22) + 22).toFixed(2));
  let humedad = parseFloat((Math.random() * (90 - 65) + 65).toFixed(2));

  //uso axios para enviar datos al api de ubidots
  const payload = {
      name: dispositivo.value,
      temp: temperatura,
      hum: humedad
  };
  client.publish("t", JSON.stringify(payload), {
    quos: 0,
    retain: false,
  });

  console.log(t,' - ', 'temp: ', temperatura, 
                    '; humedad: ', humedad);
}

//Evento para encender/apagar refrigeracion
refri.addEventListener("click", () => {
    console.log("REFRIGERACION : ", edoRefri);
});


// Funcion que simula el cambio de estado de las luces
function switchLuz(tipo) {
  if (tipo === "int") {
    return edoRefri === 0 ? (edoRefri = 1) : (edoRefri = 0);
  }
}

//Manejador de eventos  para detener el emulador
detener.addEventListener("click", () => {
  clearInterval(data);
  bandIniciar = true;
  console.log(":::: EMULACION DETENIDA ::::");
});