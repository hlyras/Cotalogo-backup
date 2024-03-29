const axios = require("axios");
const fs = require("fs");
const path = require("path");
const https = require("https");

const cert = fs.readFileSync(path.resolve(__dirname, `../certs/${process.env.GN_CERT}`));
// const credentials = Buffer.from(`${process.env.GN_CLIENT_ID}:${process.env.GN_CLIENT_SECRET}`).toString('base64');

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

module.exports = GNAPI;