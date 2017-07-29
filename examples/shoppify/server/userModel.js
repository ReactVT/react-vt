const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const SALT_WORK_FACTOR = 10;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  username: {type: String, required: true}, 
  password: {type: String, required: true},
  lists: { type: Array, default: [] }
});

userSchema.pre('save', function(next) {
    let hash = bcrypt.hashSync(this.password, SALT_WORK_FACTOR);
    this.password = hash;
    next();
});

userSchema.methods.comparePassword = function(passw) {
  return bcrypt.compareSync(this.password, passw);
};

module.exports = mongoose.model('user', userSchema);