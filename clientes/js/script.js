//Constantes de acceso a elementos del documento HTML
const dispositivo = document.getElementById("dispositivo");
const iniciar = document.getElementById("iniciar");
const detener = document.getElementById("detener");
const refri = document.getElementById("refri");
const puerta = document.getElementById("puerta");
const table = document.getElementById("tablaprueba");
const estado = document.getElementById("estado");

//Opciones para conexion del publicador
const options = {
    connectTimeout: 4000,
    clientId: dispositivo.value,
    keepalive: 60,
    clean: true,
};

//Constante para url API ubidots CAMBIE LOS DATOS POR SU TOKEN PERSONAL
//const brokerURL = "ws://20.119.68.166:8083/mqtt";
const brokerURL = "ws://52.188.161.154:8083/mqtt";

//Variables para manipulacion del emulador
var x = true;

//Eventos WS de MQTT
const client = mqtt.connect(brokerURL, options);

client.on("connect", () => {
    console.log("CLIENTE CONECTADO A BROKER 👌");
});

client.on("message", function(topic, message) {
    const x = JSON.parse(message.toString());
    console.log(message.toString());
    agregarFila(x.nombreC, x.temCent, x.temSulzq, x.temSuDer, x.velocidad, x.estadoR, x.estadoP);
});

client.on("reconnect", (error) => {
    console.log("reconnecting:", error);
});

client.on("error", (error) => {
    console.log("Connect Error:", error);
});

//Manejador de Evento click del boton que inica el emulador
//Manejador de Evento click del boton que inica el emulador
iniciar.addEventListener("click", () => {
    if (x) {
        inicia();
    } else {
        detene();
    }
});

//Inicia la emulacion
function inicia() {
    console.log("Inicia Conexion");
    client.subscribe("iot/+/#", function(err) {
        if (!err) {
            console.log("SUBSCRIBE - SUCCESS");
        } else {
            console.log("SUBSCRIBE - ERROR");
        }
    });
    x = false;
    estado.textContent = "Conectado 🟢";
};


//Manejador de eventos  para detener
function detene() {
    client.unsubscribe("#");
    console.log("Desconectado");
    x = true;
    estado.textContent = "Desconectado 🔴";
};


//Boton que envia la solicitud de cambio de esado del Refri
refri.addEventListener("click", () => {
    const payload = {
        nombreC: dispositivo.value,
        action: "switchR",
    };
    //publica la accion de cambio de refir
    client.publish("sa/" + dispositivo.value + "/switch", JSON.stringify(payload), {
        quos: 0,
        retain: false,
    });
    console.log(dispositivo.value, ' - action', "switchR");
});

//Boton que envia la solicitud de cambio de esado del Refri
puerta.addEventListener("click", () => {
    const payload = {
        nombreC: dispositivo.value,
        action: "switchP",
    };
    //publica la accion de cambio de puertas
    client.publish("sa/" + dispositivo.value + "/switch", JSON.stringify(payload), {
        quos: 0,
        retain: false,
    });
    console.log(dispositivo.value, ' - action', "switchP");
});

//Agrega datos a la tabla
function agregarFila(nombreC, temCent, temSulzq, temSuDer, velocidad, estadoR, estadoP) {
    document.getElementById("tablaprueba").insertRow(1).innerHTML = '<td>' + nombreC + '</td><td>' + temCent + '</td><td>' + temSulzq + '</td><td>' + temSuDer + '</td><td>' + velocidad + '</td><td>' + estadoR + '</td><td>' + estadoP + '</td>';
}