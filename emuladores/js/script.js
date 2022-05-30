//Constantes de acceso a elementos del documento HTML
const dispositivo = document.getElementById("dispositivo");
const iniciar = document.getElementById("iniciar");
const detener = document.getElementById("detener");
const refri = document.getElementById("refri");
const puerta = document.getElementById("puerta");
const estado = document.getElementById("estado");
const lblGas = document.getElementById("lblGas");
const lblPuerta = document.getElementById("lblPuerta");

//Opciones para conexion del publicador
const options = {
    connectTimeout: 4000,
    clientId: dispositivo.value,
    keepalive: 60,
    clean: true,
};

//Constante para url API ubidots CAMBIE LOS DATOS POR SU TOKEN PERSONAL
const brokerURL = "ws://20.119.68.166:8083/mqtt";
const tasaRequest = 2500;

//Variables para manipulacion del emulador
var data;
var eP = true;
var eG = true;
var bandIniciar = true;
var x = true;

//Eventos WS de MQTT
const client = mqtt.connect(brokerURL, options);

client.on("connect", () => {
    console.log("CLIENTE CONECTADO A BROKER 👌");
});

client.on("message", function(topic, message) {
    console.log(message.toString());
    const x = JSON.parse(message.toString());
    if (x.action == "switchR") {
        switchGas(eG);
    }
    if (x.action == "switchP") {
        switchPuerta(eP);
    }
});

client.on("reconnect", (error) => {
    console.log("reconnecting:", error);
});

client.on("error", (error) => {
    console.log("Connect Error:", error);
});

//Manejador de Evento click del boton que inica el emulador
iniciar.addEventListener("click", () => {
    actualizarlbl();
    if (x) {
        inicia();
    } else {
        detene();
    }
});

//funcion para generar datos de prueba aleatorios para lectura de variables del emulador
function generarDatos() {
    let d = new Date();
    let t = d.toLocaleTimeString();
    let tem1 = parseFloat((Math.random() * (36 - 22) + 22).toFixed(2));
    let tem2 = parseFloat((Math.random() * (36 - 22) + 22).toFixed(2));
    let tem3 = parseFloat((Math.random() * (36 - 22) + 22).toFixed(2));
    let dv = parseFloat((Math.random() * (90 - 65) + 65).toFixed(2));
    //uso axios para enviar datos al api de ubidots
    const payload = {
        nombreC: dispositivo.value,
        temCent: tem1,
        temSuIzq: tem2,
        temSuDer: tem3,
        estadoP: eP,
        estadoR: eG,
        velocidad: dv
    };
    client.publish("iot/" + dispositivo.value, JSON.stringify(payload), {
        quos: 0,
        retain: false,
    });
    actualizarlbl();
    console.log(t, dispositivo.value, ' - ', 'temCent: ' + tem1, 'temSuIzq: ' + tem2, 'temSuDer: ' + tem3,
        'velocidad: ' + dv, 'estadoR: ' + eG, 'estadoP: ' + eP);
}

//Evento para encender/apagar refrigeracion
refri.addEventListener("click", () => {
    switchGas(eG);
});

puerta.addEventListener("click", () => {
    switchPuerta(eP);
});


// Funcion que simula el cambio de estado de las luces
function switchGas(tipo) {
    if (tipo === true) {
        eG = false;
    } else {
        eG = true;
    }
    const payload = {
        nombreC: dispositivo.value,
        estadoR: eG,
    };
    client.publish("sa/" + dispositivo.value + '/estadoR', JSON.stringify(payload), {
        quos: 0,
        retain: false,
    });
    console.log(dispositivo.value, ' - estadoR', eG);
    actualizarlbl();
    return eG;
}

function switchPuerta(tipo) {
    if (tipo === true) {
        eP = false;
    } else {
        eP = true;
    }
    const payload = {
        nombreC: dispositivo.value,
        estadoP: eP,
    };
    client.publish("sa/" + dispositivo.value + '/estadoP', JSON.stringify(payload), {
        quos: 0,
        retain: false,
    });
    console.log(dispositivo.value, ' - estadoP', eP);
    actualizarlbl();
    return eP;
}

function detene() {
    clearInterval(data);
    bandIniciar = true;
    client.unsubscribe("#");
    x = true;
    estado.textContent = "Desconectado 🔴";
    console.log(":::: EMULACION DETENIDA ::::");
}

function inicia() {
    if (bandIniciar) {
        console.log(":::: INICA EMULACION :::");
        data = setInterval(generarDatos, tasaRequest);
        bandIniciar = false;
    }
    client.subscribe("sa/" + dispositivo.value + "/switch");
    x = false;
    estado.textContent = "Conectado 🟢";

}

function actualizarlbl() {
    lblGas.textContent = eG;
    lblPuerta.textContent = eP;
}

//Manejador de eventos  para detener el emulador
/*detener.addEventListener("click", () => {
    clearInterval(data);
    bandIniciar = true;
    client.unsubscribe("iot/" + dispositivo.value + "/edo", function(err) {
        if (!err) {
            console.log("SUBSCRIBE - SUCCESS");
        } else {
            console.log("SUBSCRIBE - ERROR");
        }
    });
    estado.textContent = "Desconectado 🔴";
    console.log(":::: EMULACION DETENIDA ::::");
});*/