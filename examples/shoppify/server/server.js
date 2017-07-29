var express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userController = require('./userController.js');

mongoose.connect('mongodb://localhost/solo-Project');
mongoose.connection.once('open', () => {
  console.log('Connected to Database yo');
});

app.use(cookieParser(), bodyParser.urlencoded({ extended: true }));
app.use('/client', express.static(__dirname +'./../client')); 
app.use('/build', express.static(__dirname +'./../build'));


app.get('/signup', userController.checkCookie, (req, res, next) => {
	res.sendFile(__dirname+'/html/signup.html');
}); 
app.get('/showUsers', userController.showAll);

app.get('/getData', userController.findList);

app.post('/editData', userController.editData);

app.post('/signup', userController.createUser, (req, res, next) => {
	console.log('post singup');
	res.redirect('/showList?' + res.locals.username);
}); 

app.get('/login', userController.checkCookie, (req, res, next) => {
	console.log('got login');
	res.sendFile(__dirname+'/html/login.html');
}); 

app.post('/login', userController.verifyUser, (req, res, next) => {
	console.log('user verified');
	res.redirect('/showList?' + res.locals.username);
})

app.get('/', userController.checkCookie, (req, res, next) => {
	console.log('got index');
	res.redirect('/signup');
}); 

app.get('/showList', userController.verifyCookie, (req, res, next) => {
	res.sendFile(__dirname+'/html/index.html');
}); 

app.get('/logout', (req, res, next) => {
	res.clearCookie('ssid');
	res.redirect('/signup');
});

app.get('/callback', userController.verifyOAuth,
 (req, res) => res.redirect('/showList'));


// app.get('/listView', (req, res) => {
//   console.log('list view');
//   express.static(__dirname +'./../'); 
// });

//serves the index.html

//app.use(express.static(__dirname +'./../')); //serves the index.html

app.listen(3000); //listens on port 3000 -> http://localhost:3000/

