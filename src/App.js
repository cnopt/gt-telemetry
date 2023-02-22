import React, { useState, useEffect } from 'react';
import socketIO from 'socket.io-client';
import Button from './client/comps/Button.jsx';
import MusicRallySpeedometer from './client/comps/MusicRallySpeedometer.jsx';
import './App.css';

const socket = socketIO.connect('http://192.168.1.107:1337') // connect to my server


export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [gettingData, setGettingData] = useState(false);
  const [carMessage, setCar] = useState(0);  
  const [lapMessage, setLap] = useState(0);  
  const [speedMessage, setSpeed] = useState(0);  
  const [rpmMessage, setRPM] = useState(0);  
  const [throttleMessage, setThrottle] = useState(0);  
  const [brakeMessage, setBrake] = useState(0);  
  const [gearMessage, setGear] = useState(0);

  function mapToRange(value, sourceRangeMin, sourceRangeMax, targetRangeMin, targetRangeMax) {
    let targetRange = targetRangeMax - targetRangeMin;
    let sourceRange = sourceRangeMax - sourceRangeMin;
    return (value - sourceRangeMin) * targetRange / sourceRange + targetRangeMin;
  } 

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
      setSpeed(Math.round(msg.data.speed*2.236936)); // convert to mph
      setRPM(msg.data.rpm);
      setThrottle(msg.data.throttle);
      setBrake(msg.data.brake);
      setGear(msg.data.gear);
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
      <Button>Test Button</Button>
      <p>Connected to server: {'' + isConnected}</p>
      <p>Receiving data: {'' + gettingData}</p>

      <MusicRallySpeedometer 
        gear={gearMessage} 
        speed={speedMessage}
        throttle={mapToRange(throttleMessage, 0, 255, 0, 100)}
        brake={mapToRange(brakeMessage, 0, 255, 0, 100)}>
      </MusicRallySpeedometer>

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

