const express = require('express');
const mongoose = require('mongoose');
// const passportLocalMongoose = require('passport-local-mongoose');


const connect = require('../Config/connect');

const registerSchema = mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    confirmPassword: String
});

// registerSchema.plugin(passportLocalMongoose);

const Register = mongoose.model('Register', registerSchema);

module.exports = Register;












