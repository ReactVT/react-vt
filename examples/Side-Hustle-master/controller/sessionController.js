const Session = require('./../model/sessionModel');

const sessionController = {};

sessionController.isLoggedIn = (req, res, next) => {
  // needs to change react state auth back to false
  console.log('checking if logged in...');
  console.log(req.cookies.ssid);
  if (!req.cookies.ssid) {
    res.redirect('/');
  } else {
    Session.findOne({ cookieId: req.cookies.ssid }, (err, cookie) => {
      if (err) res.redirect('/');
      next();
    });
  }
};

sessionController.startSession = (req, res, next) => {
  console.log('starting session');
  // console.log(res.cookies.ssid);
  console.log(res.locals.userId);
  Session.create({ cookieId: res.locals.userId }, (err, session) => {
    if (err) {
      console.log('ERROR');
      res.redirect('/');
    }
    next();
  })
};

module.exports = sessionController;