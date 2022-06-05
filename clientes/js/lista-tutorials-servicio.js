'use strict';
const tbody = document.querySelector('#tbl-tutorials tbody');
let mostrar_datos = async() => {
    let tutorials = await listar_tutorials();
    tbody.innerHTML = '';
    for (let i = 0; i < tutorials.length; i++) {
        let fila = tbody.insertRow();
        fila.insertCell().innerHTML = tutorials[i]['id'];
        fila.insertCell().innerHTML = tutorials[i]['nombreC'];
        fila.insertCell().innerHTML = tutorials[i]['temCent'];
        fila.insertCell().innerHTML = tutorials[i]['temSuDer'];
        fila.insertCell().innerHTML = tutorials[i]['temSulzq'];
        fila.insertCell().innerHTML = tutorials[i]['estadoP'];
        fila.insertCell().innerHTML = tutorials[i]['estadoR'];
        fila.insertCell().innerHTML = tutorials[i]['velocidad'];
        fila.insertCell().innerHTML = tutorials[i]['createdAt'];
        fila.insertCell().innerHTML = tutorials[i]['updatedAt'];
    }
};
mostrar_datos();