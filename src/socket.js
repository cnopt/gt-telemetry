
// document needs to be ready to get element
// TODO convert this to react application
$(document).ready(function () {

    var socket = io.connect('http://localhost:1337');
    var carDisplay = document.getElementById('car');
    var lapDisplay = document.getElementById('lap');
    var speedDisplay = document.getElementById('speed');
    var throttleDisplay = document.getElementById('throttle');
    var brakeDisplay = document.getElementById('brake');
    var rpmDisplay = document.getElementById('rpm');

    // use react sendeffect here or something to update the ui
    socket.on('sendData', (msg) => {
        // let formattedString = '<p>' + msg.data + '</p>'
        // print msg info contents to log
        carDisplay.innerHTML = "<img src='./car-img/" + msg.data.car + "/thumbnail/73_00.png'/>";
        lapDisplay.innerHTML = '<p>' + msg.data.lap + '</p>';
        speedDisplay.innerHTML = '<p>' + msg.data.speed + '</p>';
        throttleDisplay.innerHTML = '<p>' + msg.data.throttle + '</p>';
        brakeDisplay.innerHTML = '<p>' + msg.data.brake + '</p>';
        rpmDisplay.innerHTML = '<p>' + msg.data.rpm + '</p>';
    })


})