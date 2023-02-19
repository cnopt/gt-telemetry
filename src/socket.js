
var socket = io.connect('http://localhost:1337');

socket.on('sendData', function (msg) {
    console.log("got: " + msg.info)
})