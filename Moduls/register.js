const express = require('express');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


const connect = require('../Config/connect');

const registerSchema = mongoose.Schema({
    fullName: String,
    // username and password are added by passport-local-mongoose automatically
});

registerSchema.plugin(passportLocalMongoose);

const Register = mongoose.model('Register', registerSchema);

module.exports = Register;












