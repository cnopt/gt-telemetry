import { Socket, createSocket } from 'node:dgram'
import JSSalsa20  from 'js-salsa20'
import { TextEncoder, TextDecoder } from 'util';
import { gt7parser } from '../parser.js';
import { createWriteStream, readFileSync, writeFile } from 'fs';
import express from 'express';
import cors from 'cors' // use cors to allow localhost:1337 to send msg to localhost:3000
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();
const server = createServer(app);
app.use(cors())
app.use(express.json())

// could be vulnerable using *
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});
// why the FUCK doesnt this log??!?
io.listen(1337, () => console.log('1337 server started'));

//Below setup to fetch data from the ps4
const socket = createSocket('udp4');
const sendPort = 33739;
const receivePort = 33740;
// changed to my ip
const psIp = '192.168.1.225';
// send heartbeat every 13 seconds to keep connection alive and keep getting data
const heartbeat = 13;


socket.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    socket.close();
});

socket.on('message', (data, rinfo) => {
    console.log(`server got ${data.length} bytes from ${rinfo.address}:${rinfo.port}`);

    if (0x128 === data.length) {
        const packet = decrypt(data);
        const magic = packet.readInt32LE();
        if (magic != 0x47375330) {
            // 0S7G - G7S0
            console.log("Magic! error!", magic);
        } else {
            const message = gt7parser.parse(packet);

            // uncomment these lines to write to file
            // let stream = createWriteStream('C:/Users/TTGCh/Desktop/gt7-8.txt', {flags: 'a'});
            // stream.write(JSON.stringify(message));

            // send data to client socket
            io.emit('sendData', { 
                'method': 'GET', 'data': {
                    'car': message.carCode,
                    'lap': message.lapCount,
                    'speed': message.metersPerSecond,
                    'throttle': message.throttle,
                    'brake': message.brake,
                    'rpm': message.engineRPM
                }
            })
        }
    }

});

socket.on('listening', () => {
    const address = socket.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

socket.bind(receivePort);

// send heartbeat to GT server to keep connection alive
setInterval(function() {
    socket.send(Buffer.from('A'),0, 1, sendPort, psIp, (err) => {
        if (err) {
            socket.close();
            return;
        }
        console.log('heartbeat sent');
    });

    // send fake data every x seconds to test react client
    // io.emit('sendData', { 
    //     'method': 'GET', 'data':'2000'
    // })
    // end of dake data
}, heartbeat * 1000);



function decrypt(data) {
    const encoder = new TextEncoder();
    const key = encoder.encode('Simulator Interface Packet GT7 ver 0.0'); // 32 bytes key
    const nonce1 = data.readInt32LE(64);
    const nonce2 = nonce1 ^ 0xDEADBEAF;
    const nonce = Buffer.alloc(8);
    nonce.writeInt32LE(nonce2)
    nonce.writeInt32LE(nonce1, 4)
    const message = new JSSalsa20(key.slice(0, 32), nonce).decrypt(data);
    const newBuffer = Buffer.alloc(message.byteLength)
    for (var i = 0; i < message.length; i++)
        newBuffer[i] = message[i];

    return newBuffer;
}


// Listen for client connect & disconnect events, and log them
io.on("connection", socket => { console.log("New client connected" );
    socket.on('disconnect', () => { console.log('Client disconnected'); });
});

// send index at root
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})