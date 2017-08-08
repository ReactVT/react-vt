const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const formController = require('./../controller/formController');
const cookieController = require('./../controller/cookieController');
const sessionController = require('./../controller/sessionController');
const userController = require('./../controller/userController');

const PORT = 3000;
if (process.env.NODE_ENV === 'test') {
  console.log('NODE_ENV: Test');
  mongoose.connect('mongodb://localhost/testDb');
} else {
  console.log('NODE_ENV: Development');
  mongoose.connect('mongodb://sidehustle:codesmith15@ds151752.mlab.com:51752/sidehustle');
}
mongoose.connection.once('open', () => {
  console.log('Connected to Database');
});

app.use('/build', express.static(__dirname +'./../build'));
app.use('/static', express.static(__dirname +'./../static'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + './../static/post.html'));
});


app.get('/api', formController.pullData);


app.post('/post', formController.createForm);

// app.get('/signup', (req, res) => {
//   res.render('./../client/signup', {error: null});
// });

app.post('/signup', 
  userController.createUser, 
  cookieController.setSSIDCookie, 
  sessionController.startSession,
  (req, res) => {
    res.sendStatus(200);
  }
);

// app.get('/login', (req, res) => {
//   res.render('./../client/index');
// });
/**
* login
*/

app.post('/login', 
  userController.verifyUser, 
  cookieController.setSSIDCookie, 
  sessionController.startSession, 
  (req, res) => {
  res.redirect('/jobs');
});
// , ((req, res, next) => {
//   res.sendFile(path.join(__dirname + './../static/post.html'));
// }));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + './../static/post.html'))
})

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));

// module.exports = db;
