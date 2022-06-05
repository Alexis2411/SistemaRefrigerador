'use strict';
let listar_tutorials = async() => {
    let tutorials;
    await axios({
            method: 'get',
            url: 'http:52.188.161.154:8080/api/tutorials',
            responseType: 'json'
        }).then(function(res) {
            tutorials = res.data;
            console.log(res.data);
        })
        .catch(function(err) {
            console.log(err);
        });
    return tutorials;
};