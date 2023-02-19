
// document needs to be ready to get element
// TODO convert this to react application
$(document).ready(function () {

    var socket = io.connect('http://localhost:1337');
    var log = document.getElementById('log');

    // use react sendeffect here or something to update the ui
    socket.on('sendData', (msg) => {
        // let formattedString = '<p>' + msg.data + '</p>'
        // print msg info contents to log
        log.innerHTML = '<p>' + msg.data + '</p>';
    })


})