;(function() {
    'use strict';

    console.log('marko.js')
    var startButton = document.querySelector('button#startButton');
    var nameInput = document.querySelector('input#name');

    startButton.onclick = createConnection;




    function createConnection() {
        let name = nameInput.value;
        console.log('create connection', nameInput, nameInput.value, name)

        let socket = io();

        socket.on('rooms', data => {
            console.log('rooms', data);
        });
        socket.on('users', data => {
            console.log('users', data);
        });

        socket.emit('aaa', nameInput.value);
    }

}());
