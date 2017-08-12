const express = require('express');
const bodyparser = require('body-parser');
const db = require('./server/db/games');

const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static(`${__dirname}/client`));

app.use(bodyparser.json());

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/games', (req, res) => {
  //object keys in req body, save as var
  let keys = Object.keys(req.body);
  // if length != 1 throw error
  if (!req.body.winner) res.status(400).json({ error: 'Must send winner.' });
  if (keys.length != 1) res.status(400).json({ error: 'Invalid request' });
  const game = db.create({
    winner: req.body.winner,
  });
  res.json(game);
});

app.get('/games', (req, res) => {
  res.json(db.find());
});

const port = process.env.PORT || 3000;

app.listen(port);
