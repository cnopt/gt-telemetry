import { Socket, createSocket, RemoteInfo } from 'node:dgram'
import * as JSSalsa20  from 'js-salsa20'
import { TextEncoder, TextDecoder } from 'util';
import { gt7parser } from './parser';

import express = require('express')
const app = express();
const socketio = require('socket.io')

app.use(express.json())
app.use(express.static(__dirname + '/'));

const socketserver = app.listen(1337, () => console.log('1337 server started'));
const io = require('socket.io')(socketserver)

import { createWriteStream, readFileSync, writeFile } from 'fs';


//Below setup to fetch data from the ps4
const socket: Socket = createSocket('udp4');
const sendPort: number = 33739;
const receivePort: number = 33740;
// changed to my ip
const psIp: string = '192.168.1.225';
// send heartbeat every 13 seconds to keep connection alive and keep getting data
const heartbeat = 13;

socket.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    socket.close();
});


// maybe here send a socket.io emit event, then on the client listen for this emit event
// and update html data whhen got this emit
socket.on('message', (data: Buffer, rinfo: RemoteInfo) => {
    console.log(`server got ${data.length} bytes from ${rinfo.address}:${rinfo.port}`);

    if (0x128 === data.length) {
        const packet: Buffer = decrypt(data);

        const magic = packet.readInt32LE();
        if (magic != 0x47375330) {
            // 0S7G - G7S0
            console.log("Magic! error!", magic);
        } else {
            const message = gt7parser.parse(packet);
            const rpm = message.metersPerSecond;

            // let stream = createWriteStream('C:/Users/TTGCh/Desktop/gt7-8.txt', {flags: 'a'});
            // stream.write(JSON.stringify(message));

            // send data to client socket
            // for now only send the rpm data
            io.emit('sendData', { 
                'method': 'GET', 'data': JSON.stringify(rpm)
            })
        }
    }

});

socket.on('listening', () => {
    const address = socket.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

socket.bind(receivePort);

setInterval(function() {
    socket.send(Buffer.from('A'),0, 1, sendPort, psIp, (err) => {
        if (err) {
            socket.close();
            return;
        }
    
        console.log('heartbeat send!');
    });
    }, heartbeat * 1000);



/**
 * This works!
 * @param data
 */
function decrypt(data: Buffer): Buffer {
    const encoder: TextEncoder = new TextEncoder();
    const key: Uint8Array = encoder.encode('Simulator Interface Packet GT7 ver 0.0'); // 32 bytes key

    const nonce1: number = data.readInt32LE(64);
    const nonce2: number = nonce1 ^ 0xDEADBEAF;

    const nonce: Buffer = Buffer.alloc(8);
    nonce.writeInt32LE(nonce2)
    nonce.writeInt32LE(nonce1, 4)

    const message: Uint8Array = new JSSalsa20(key.slice(0, 32), nonce).decrypt(data);

    const newBuffer: Buffer = Buffer.alloc(message.byteLength)
    for (var i = 0; i < message.length; i++)
        newBuffer[i] = message[i];

    return newBuffer;
}



// Listen for client connect & disconnect events, and log them
io.on("connection", socket => {
    console.log("New client connected");

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})