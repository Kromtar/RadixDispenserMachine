require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const zbar = require('node-zbarimg'); //Ojo que es necesario instalar por apt-get el paquete zbar-tools (si no estoy mal)
const fs = require('fs');
const { StillCamera } = require("pi-camera-connect");

const app = express();

global.processFree = true;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('webapp/build'));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'webapp', 'build', 'index.html'));
});

app.listen(process.env.PORT, () => {
    console.log('Server ON, port:', process.env.PORT);
});

require('./routes/routes')(app);

function saveImage(stream, image){
  return new Promise((resolve, reject) =>{
    stream.once('open', (fd) => {
      stream.write(image);
      stream.end();
    });
    stream.once('finish', resolve);
    stream.once('error', reject);
  })
}

function viewCode(pathImage){
  return new Promise(resolve=>{
    zbar(pathImage, (err, code) => {
      if (!err) {
        console.log('code', code);
      }
      resolve();
    });
  })
}

async function timeLapse(){
  const stillCamera = new StillCamera({
    width: 300,
    height: 300
  });
  const pathImage = `./images/image.jpg`
  if(processFree){
    processFree = false;
    console.log('New Frame');
    const image = await stillCamera.takeImage();
    var stream = fs.createWriteStream(pathImage);
    await saveImage(stream, image);
    await viewCode(pathImage);
    processFree = true;
  }  
}

//Este proceso se tendira que repetir hasta detectar un codigo o que pase un tiempo maximo
//var timeLapse = setInterval(timeLapse,300);
//9iF1TUhWqL9wHXXuPrbiDGyrHCBw1KNH3fk45HtYEfwZRY6wHXv
