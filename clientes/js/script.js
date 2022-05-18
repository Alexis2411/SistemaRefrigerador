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
const brokerURL = "ws://localhost:8083/mqtt";
const tasaRequest = 2500;

//Variables para manipulacion del emulador
var data;
var edoRefri = true;
var bandIniciar = true;

//Eventos WS de MQTT
const client = mqtt.connect(brokerURL, options);

client.on("connect", () => {
    console.log("CLIENTE CONECTADO A BROKER 👌");
});

client.on("message", function(topic, message) {
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
        bandIniciar = false;
    };
    client.subscribe("iot/" + dispositivo.value + "/#", function(err) {
        if (!err) {
            console.log("SUBSCRIBE - SUCCESS" + dispositivo.value);
        } else {
            console.log("SUBSCRIBE - ERROR");
        }
    });

});


//Evento para encender/apagar refrigeracion
refri.addEventListener("click", () => {
    switchGas();
});


// Funcion que simula el cambio de estado de las luces
function switchGas() {
    if (edoRefri === true) {
        edoRefri = false;
    } else {
        edoRefri = true;
    }
    const payload = {
        edo: edoRefri
    };
    client.publish("iot/" + dispositivo.value + "/edo", JSON.stringify(payload), {
        quos: 0,
        retain: false,
    });
    console.log("REFRIGERACION : ", edoRefri);
}

//Manejador de eventos  para detener el emulador
detener.addEventListener("click", () => {
    client.unsubscribe("iot/" + dispositivo.value + "/#");
    console.log("Desconectado de: ", dispositivo.value);
});