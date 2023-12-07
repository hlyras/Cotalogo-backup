import axios from 'axios';
import fs from 'fs';
import path from 'path';
import https from 'https';
import __dirname from '../../config/__dirname.js';

const cert = fs.readFileSync(`./app/certs/${process.env.GN_CERT}`);

const agent = new https.Agent({
  pfx: cert,
  passphrase: "",
});

const authenticate = ({ clientId, clientSecret }) => {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  return axios({
    method: "POST",
    url: `${process.env.GN_ENDPOINT}/oauth/token`,
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    httpsAgent: agent,
    data: { grant_type: "client_credentials" },
  });
};

const GNAPI = async (credentials) => {
  const authResponse = await authenticate(credentials);
  const accessToken = authResponse.data?.access_token;

  return axios.create({
    baseURL: process.env.GN_ENDPOINT,
    httpsAgent: agent,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
};

export default GNAPI;