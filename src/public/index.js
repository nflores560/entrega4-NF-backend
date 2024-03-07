const socket = io();
socket.emit('message', '¡¡Hola, bienvenido!!');

socket.on('evento_para_socket_individual', data => {
    console.log(data);
});

