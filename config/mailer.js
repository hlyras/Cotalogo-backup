import nodemailer from 'nodemailer';
import mailConfig from './mail.js';

export default nodemailer.createTransport(mailConfig);