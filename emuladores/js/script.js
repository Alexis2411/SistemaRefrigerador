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
    console.log("Te topic is " + topic + " and the message is " + message.edo.toString());
    edoRefri = (message.toString());
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
    client.subscribe("iot/" + dispositivo.value + "/edo", function(err) {
        if (!err) {
            console.log("SUBSCRIBE - SUCCESS");
        } else {
            console.log("SUBSCRIBE - ERROR");
        }
    });
});

//funcion para generar datos de prueba aleatorios para lectura de variables del emulador
function generarDatos() {
    let d = new Date();
    let t = d.toLocaleTimeString();
    let temperatura = parseFloat((Math.random() * (36 - 22) + 22).toFixed(2));
    let velocidad = parseFloat((Math.random() * (90 - 65) + 65).toFixed(2));
    let estado = edoRefri;
    //uso axios para enviar datos al api de ubidots
    const payload = {
        name: dispositivo.value,
        temp: temperatura,
        vel: velocidad,
        edo: estado
    };
    client.publish("iot/" + dispositivo.value, JSON.stringify(payload), {
        quos: 0,
        retain: false,
    });

    console.log(t, dispositivo.value, ' - ', 'temp: ', temperatura,
        '; velocidad: ', velocidad, '; estado gas: ', estado);
}

//Evento para encender/apagar refrigeracion
refri.addEventListener("click", () => {
    switchGas(edoRefri);
    console.log("REFRIGERACION : ", edoRefri);
});


// Funcion que simula el cambio de estado de las luces
function switchGas(tipo) {
    if (tipo === true) {
        return edoRefri = false;
    } else {
        return edoRefri = true;
    }
}

//Manejador de eventos  para detener el emulador
detener.addEventListener("click", () => {
    clearInterval(data);
    bandIniciar = true;
    client.unsubscribe("iot/" + dispositivo.value + "/edo", function(err) {
        if (!err) {
            console.log("SUBSCRIBE - SUCCESS");
        } else {
            console.log("SUBSCRIBE - ERROR");
        }
    });
    console.log(":::: EMULACION DETENIDA ::::");
});