const User = require('./userModel');
const querystring = require('querystring');
const request = require('request');
const bcrypt = require('bcryptjs');

const userController = {};
const clientId = '186c9aa8e26e59d2affb';
const clientSecret = 'a64d1475d185bfc362ea10f2c7576ea4ff0a5047';

userController.getAllUsers = (next) => {
  User.find({}, next);
};

/**
* createUser - create a new User model and then save the user to the database.
*
* @param req - http.IncomingRequest
* @param res - http.ServerResponse
*/
userController.showAll = (req, res, next) => {
  User.find({}, (err, result) => {
    console.log(result);
    res.end();
  });
};

userController.editData = (req, res, next) => {
  console.log('req body', req.body);
  User.update({username: req.body.name}, {$set: {lists: req.body.list}}, () => {
    console.log('user updated!');
  }); 


  res.end();
};

userController.findList = (req, res, next) => {
    const name = req.url.slice(9);
    console.log('name is', name)
    User.findOne({username: name}, (err, result) => {
      if (result) res.json(result.lists);
      res.end();
    });
  };


userController.createUser = (req, res, next) => {
  const newUser = new User(req.body);
  console.log('req body is ', req.body);
  User.findOne({username: newUser.username}, (err, result) => {
  	if (err) return res.render('./../client/signup', {error: err});
    if (!result) {
    	newUser.save((err, newItem) => {
    	if (err) return console.log(err);
    	res.locals._id = newItem._id;
      res.locals.username = newItem.username;
      res.cookie('ssid', newItem._id, {maxAge: 30000, httpOnly: true});
      console.log('user added');
      next();
      });
    } else {
      console.log('user already exists');
    	return res.redirect('/signup');
    }
  });
};

userController.checkCookie = (req, res, next) => {
  if (req.cookies.ssid) {
    User.findOne({_id: req.cookies.ssid}, (err, result) => {
      if (result) {
        res.redirect('/showList?' + result.username);
      } else {
        next();
      }
    });
  } else {
    next();
  }
};

userController.verifyCookie = (req, res, next) => {

  const incomingurlIndex = req.url.indexOf('?'); 
    const urlParams = req.url.slice(incomingurlIndex + 1)
  if (req.cookies.ssid) {
    User.findOne({username: urlParams, _id: req.cookies.ssid}, (err, result) => {
      if (result) {
        next();
      } else {
        res.redirect('/signup');
      }
    });
  } else {
    console.log('redirect');
    res.redirect('/signup');
}
};

userController.verifyOAuth = (req, res, next) => {
  const obj = {
    grant_type: 'authorization_code', 
    code: req.query.code, 
    redirect_uri: 'http://localhost:3000/callback', 
    client_id: clientId, 
    client_secret: clientSecret
  };
  
  const endUrl = querystring.stringify(obj);
  const finalUrl = 'https://github.com/login/oauth/access_token?' + endUrl;
  const options = {
    url: finalUrl, 
    headers: {"User-Agent": 'teamAwesome'}
  }
  request.post(options, (error, response, body) => {
    var parsedResult = querystring.parse(body);
    console.log('parsed results is', parsedResult);
    const moreOptions = {
    url: 'https://api.github.com/user?access_token=' + parsedResult.access_token, 
    headers: {"User-Agent": 'teamAwesome'}
    };
    request.get(moreOptions, (error, response, body) => {
      const bodyObj = JSON.parse(body);
      var test = bodyObj.login;
      User.findOne({username: test}, (err, result) => {
        if (err) return res.render('./../client/signup', {error: err});
        if (result) {
          res.locals._id = result._id;
          res.cookie('ssid', result._id, {maxAge: 30000, httpOnly: true});
          next();
        }
        if (!result) {
          const pwd = bcrypt.hashSync('awesomepassword', 10);
          const contents = {username: bodyObj.login, password: pwd};
          const newUser = new User(contents);
          newUser.save((err, newresult) => {
            res.locals._id = newresult._id;
            res.cookie('ssid', result._id, {maxAge: 30000, httpOnly: true});
            next();
          });
        }  
    });
  });
});
}


userController.verifyUser = (req, res, next) => {
  const newUser = new User(req.body);
  // if (!newUser.username || !newUser.password) return res.redirect('/signup');
  User.findOne({username: newUser.username}, (err, result) => {
  	if (err) return res.render('./../client/signup', {error: err});
    if (result) {
      // User Found, check Password
      if (newUser.comparePassword(result.password)) {
        res.locals._id = result._id;
        res.locals.username = result.username;
        res.cookie('ssid', result._id, {maxAge: 30000, httpOnly: true});
        next();
      } else {
        return res.redirect('/signup');
      }
    } else {
    	return res.redirect('/signup');
    }
  });
};


module.exports = userController;
