"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ./expressjs-admin-server/models/user.server.model.ts
var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var SALT_WORK_FACTOR = 10;
var Schema = mongoose.Schema;
var userSchema = new Schema({
    email: {
        type: String, required: true,
        trim: true, unique: true,
        validate: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password: { type: String, required: true },
    username: {
        type: String
    },
    role: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
// Before saving the user, hash the password
userSchema.pre('save', function (next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password'))
        return next();
    //generate the salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err)
            return next(err);
        //hash a password along with your new salt
        bcrypt.hash(user.password, salt, function (error, hash) {
            if (error)
                return next(error);
            user.password = hash;
            next();
        });
    });
});
// Compare the passed password with the value in the database. A model method.
userSchema.methods.comparePassword = function (userPassword, cb) {
    bcrypt.compare(userPassword, this.password, function (err, isMatch) {
        if (err)
            return cb(err);
        cb(null, isMatch);
    });
};
// Omit the password when returning a user
userSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret.password;
        return ret;
    }
});
var User = mongoose.model('User', userSchema);
exports.default = User;
//# sourceMappingURL=user.server.model.js.map