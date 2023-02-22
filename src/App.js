import React, { useState, useEffect } from 'react';
import socketIO from 'socket.io-client';
import Button from './client/comps/Button.jsx';
import './App.css';

const socket = socketIO.connect('http://localhost:1337') // connect to my server


export default function App() {

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [gettingData, setGettingData] = useState(false);
  const [carMessage, setCar] = useState(null);  
  const [lapMessage, setLap] = useState(null);  
  const [speedMessage, setSpeed] = useState(null);  
  const [rpmMessage, setRPM] = useState(null);  
  const [throttleMessage, setThrottle] = useState(null);  
  const [brakeMessage, setBrake] = useState(null);  

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });
    socket.on('disconnect', () => {
      setIsConnected(false);
      setGettingData(false);
    });

    socket.on('sendData', (msg) => {
      setGettingData(true);
      setCar(msg.data.car);
      setLap(msg.data.lap);
      setSpeed(msg.data.speed);
      setRPM(msg.data.rpm);
      setThrottle(msg.data.throttle);
      setBrake(msg.data.brake);
    })

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('sendData');
    };
  }, []);


  // socket.on('sendData', (msg) => {
  //   // do a React setState() thing here to update the text that's returned below?
  // })

  return (
    <div className="App">
      <Button>Testing Button</Button>
      <p>Connected to server: {'' + isConnected}</p>
      <p>Receiving data: {'' + gettingData}</p>
      <br/><br/>
      <table>
        <tr>
          <th>Car</th>
          <td>{'' + carMessage}</td>
        </tr>
        <tr>
          <th>Lap</th>
          <td>{'' + lapMessage}</td>
        </tr>
        <tr>
          <th>Speed</th>
          <td>{'' + speedMessage}</td>
        </tr>
        <tr>
          <th>RPM</th>
          <td>{'' + rpmMessage}</td>
        </tr>
        <tr>
          <th>Throttle</th>
          <td>{'' + throttleMessage}</td>
        </tr>
        <tr>
          <th>Brake</th>
          <td>{'' + brakeMessage}</td>
        </tr>
      </table>
    </div>
  );
}

