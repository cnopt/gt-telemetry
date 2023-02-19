import { createWriteStream, readFile, readFileSync, writeFile } from 'fs';

function wait(milleseconds) {
    return new Promise(resolve => setTimeout(resolve, milleseconds))
  }

readFile('C:/Users/TTGCh/Desktop/gt7telemetry.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.error(err)
    }
    try {
        let data = JSON.parse(jsonString);
        for (let i=0;i<data.length;i++) {
            console.log(data[i].engineRPM)
        }
    } catch(err) {
        console.error(err)
    }
});
