require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

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

