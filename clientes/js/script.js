//Constantes de acceso a elementos del documento HTML
const dispositivo = document.getElementById("dispositivo");
const iniciar = document.getElementById("iniciar");
const detener = document.getElementById("detener");
const refri = document.getElementById("refri");
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
var eP = true;
var eG = true;
var bandIniciar = true;

//Eventos WS de MQTT
const client = mqtt.connect(brokerURL, options);

client.on("connect", () => {
    console.log("CLIENTE CONECTADO A BROKER 👌");
});

client.on("message", function(topic, message) {
    console.log(message.toString());
    const x = JSON.parse(message.toString());
    agregarFila(x.name, x.temCen, x.temSuIzq, x.temSuDer, x.velocidad, x.estadoR, x.estadoP);
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
    client.subscribe("iot/+/#", function(err) {
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


function switchGas(tipo) {
    if (tipo === true) {
        eG = false;
    } else {
        eG = true;
    }
    const payload = {
        name: dispositivo.value,
        estadoR: eG,
    };
    client.publish("iot/" + dispositivo.value + '/estadoR', JSON.stringify(payload), {
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
        name: dispositivo.value,
        estadoR: eP,
    };
    client.publish("iot/" + dispositivo.value + '/estadoP', JSON.stringify(payload), {
        quos: 0,
        retain: false,
    });
    console.log(dispositivo.value, ' - estadoP', eP);
    return eP;
}

//Manejador de eventos  para detener el emulador
detener.addEventListener("click", () => {
    client.unsubscribe("iot/+/#");
    console.log("Desconectado");
});

function agregarFila(name, temCen, temSuIzq, temSuDer, velocidad, estadoR, estadoP) {
    document.getElementById("tablaprueba").insertRow(1).innerHTML = '<td>' + name + '</td><td>' + temCen + '</td><td>' + temSuIzq + '</td><td>' + temSuDer + '</td><td>' + velocidad + '</td><td>' + estadoR + '</td><td>' + estadoP + '</td>';
}