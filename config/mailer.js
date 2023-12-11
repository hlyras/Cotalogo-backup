const nodemailer = require("nodemailer");
const mailConfig = require("./mail");

module.exports = nodemailer.createTransport(mailConfig);