// test-server.js
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => {
  console.log('GET /ping');
  res.send('pong');
});

app.listen(port, () => {
  console.log(`Test-Server läuft auf http://localhost:${port}`);
});
