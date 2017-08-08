const cookieController = {};
const User = require('./../model/userModel')

cookieController.setSSIDCookie = (req, res, next) => {
  console.log('setting SSID cookie!!!', res.locals.userId);
    res.cookie('ssid', res.locals.userId, { httpOnly: true, maxAge: 300000 });
    // console.log('set the cookie', res.locals.userId);
    next();
}

module.exports = cookieController;
