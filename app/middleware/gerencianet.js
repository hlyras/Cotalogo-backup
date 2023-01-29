const gerencianet = require('gerencianet');

const axios = require("axios");
const fs = require("fs");
const path = require("path");
const https = require("https");

const cert = fs.readFileSync(path.resolve(__dirname, `../certs/${process.env.GN_CERT}`));
const credentials = Buffer.from(`${process.env.GN_CLIENT_ID}:${process.env.GN_CLIENT_SECRET}`).toString('base64');

const agent = new https.Agent({
  pfx: cert,
  passphrase: "",
});

var config = {
  method: "POST",
  url: `${process.env.GN_ENDPOINT}/oauth/token`,
  headers: {
    Authorization: "Basic " + credentials,
    "Content-Type": "application/json",
  },
  httpsAgent: agent,
  data: { grant_type: "client_credentials" },
};

axios(config)
  .then(function (response) {
    // console.log(JSON.stringify(response.data));

    const accessToken = response.data?.access_token;

    console.log(accessToken);

    const reqGN = axios.create({
      baseURL: process.env.GN_ENDPOINT,
      httpsAgent: agent,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const dataCob = {
      calendario: {
        expiracao: 3600
      },
      devedor: {
        cpf: '12345678909',
        nome: "Francisco da Silva"
      },
      valor: {
        original: '119.97'
      },
      chave: "596eaf56-e3c0-4f88-8791-355d1bb6dd6e",
      solicitacaoPagador: "Informe o número ou identificador do pedido."
    };

    reqGN.post('/v2/cob', dataCob).then(response => console.log(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });

return;

// const agent = new https.Agent({
//   key: credentials,
//   cert: cert,
// });

// axios({
//   method: "POST",
//   url: `${process.env.GN_ENDPOINT}/oauth/token`,
//   headers: {
//     Authorization: `Basic ${credentials}`,
//     "Content-Type": "application/json"
//   },
//   httpsAgent: agent,
//   data: {
//     grant_type: "client_credentials"
//   }
// }).then(console.log);

// const options = {
//   sandbox: true,
//   clientId: `${process.env.GN_CLIENT_ID}`,
//   clientSecret: `${process.env.GN_CLIENT_SECRET}`,
//   certificate: cert,
// };

// console.log(options);
// const GNAPI = gerencianet(options);

// console.log(GNAPI);

// module.exports = GNAPI;