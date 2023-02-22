import React from "react";
import '../css/MusicRallySpeedometer.css';

export default function MusicRallySpeedometer(props) {
    const {speed, gear, throttle, brake} = props;
    return(
        <>
            <div id="musicrallyspeedo-container">
                <div id="left-area">
                    <div id="brake-container">
                        <div id="brake-value"></div>
                    </div>
                    <div id="throttle-container">
                        <div id="throttle-value" style={{height: throttle+'%'}}></div>
                    </div>
                </div>
                <div id="right-area">
                    <p id="gear">{gear}</p>
                    <p id="speed">{speed}</p>
                </div>
            </div>
        </>
    )
}