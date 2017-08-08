'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SALT_WORK_FACTOR = 11;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
});

userSchema.pre('save', function(next) {
  const user = this;
  console.log('hashing pw')
  console.log('user', user)
  //if (!user.isModified('password')) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    console.log('salted', err)
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      console.log('hashed', err)
      if (err) return next(err);

      user.password = hash;
      console.log(user.password)
      next();
    });
  })
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  console.log(this.password, candidatePassword);
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);



