//Constantes de acceso a elementos del documento HTML
const dispositivo = document.getElementById("dispositivo");
const iniciar = document.getElementById("iniciar");
const detener = document.getElementById("detener");
const refri = document.getElementById("refri");
const puerta = document.getElementById("puerta");
const table = document.getElementById("tablaprueba");

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
//var eP = true;
//var eG = true;
var bandIniciar = true;

//Eventos WS de MQTT
const client = mqtt.connect(brokerURL, options);

client.on("connect", () => {
    console.log("CLIENTE CONECTADO A BROKER 👌");
});

client.on("message", function(topic, message) {
    const x = JSON.parse(message.toString());
    console.log(message.toString());
    agregarFila(x.nombreC, x.temCent, x.temSuIzq, x.temSuDer, x.velocidad, x.estadoR, x.estadoP);
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
    client.subscribe("iot/+/#", function(err) {
        if (!err) {
            console.log("SUBSCRIBE - SUCCESS");
        } else {
            console.log("SUBSCRIBE - ERROR");
        }
    });
});

refri.addEventListener("click", () => {
    const payload = {
        nombreC: dispositivo.value,
        action: "switchR",
    };
    client.publish("sa/" + dispositivo.value + "/switch", JSON.stringify(payload), {
        quos: 0,
        retain: false,
    });
    console.log(dispositivo.value, ' - action', "switchR");
});

puerta.addEventListener("click", () => {
    const payload = {
        nombreC: dispositivo.value,
        action: "switchP",
    };
    client.publish("sa/" + dispositivo.value + "/switch", JSON.stringify(payload), {
        quos: 0,
        retain: false,
    });
    console.log(dispositivo.value, ' - action', "switchP");
});

/*
//Evento para encender/apagar refrigeracion
refrion.addEventListener("click", () => {
        let eR = true;
        const payload = {
            nombreC: dispositivo.value,
            estadoR: eR,
        };
        client.publish("sa/" + dispositivo.value + '/estadoR', JSON.stringify(payload), {
            quos: 0,
            retain: false,
        });
        console.log(dispositivo.value, ' - estadoR', eR);
});

puertaon.addEventListener("click", () => {
    let eP = true;
    const payload = {
        nombreC: dispositivo.value,
        estadoP: eP,
    };
    client.publish("sa/" + dispositivo.value + '/estadoP', JSON.stringify(payload), {
        quos: 0,
        retain: false,
    });
    console.log(dispositivo.value, ' - estadoP', eP);
});

refrioff.addEventListener("click", () => {
    let eR = false;
    const payload = {
        nombreC: dispositivo.value,
        estadoR: eR,
    };
    client.publish("sa/" + dispositivo.value + '/estadoR', JSON.stringify(payload), {
        quos: 0,
        retain: false,
    });
    console.log(dispositivo.value, ' - estadoR', eR);
});

puertaoff.addEventListener("click", () => {
    let eP = false;
    const payload = {
        nombreC: dispositivo.value,
        estadoP: eP,
    };
    client.publish("sa/" + dispositivo.value + '/estadoP', JSON.stringify(payload), {
        quos: 0,
        retain: false,
    });
    console.log(dispositivo.value, ' - estadoR', eP);
});
*/

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
    return eP;
}

//Manejador de eventos  para detener el emulador
detener.addEventListener("click", () => {
    client.unsubscribe("#");
    console.log("Desconectado");
});

function agregarFila(nombreC, temCent, temSuIzq, temSuDer, velocidad, estadoR, estadoP) {
    document.getElementById("tablaprueba").insertRow(1).innerHTML = '<td>' + nombreC + '</td><td>' + temCent + '</td><td>' + temSuIzq + '</td><td>' + temSuDer + '</td><td>' + velocidad + '</td><td>' + estadoR + '</td><td>' + estadoP + '</td>';
}