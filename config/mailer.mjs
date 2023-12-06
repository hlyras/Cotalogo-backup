import nodemailer from 'nodemailer';
import mailConfig from './mail.mjs';

export default nodemailer.createTransport(mailConfig);