const User = require('../../model/user');

const lib = require('jarmlib');

const GNAPI = require('../../api/gerencianet');

const accountController = {};

accountController.index = async (req, res) => {
  let props = ["user.id", "user.name", "user.business", "user.email", "user.status", "user.balance"];
  let strict_params = { keys: [], values: [] };
  lib.Query.fillParam("user.id", req.user.id, strict_params);
  let user = await User.filter(props, [], [], strict_params, []);

  res.render('user/account/index', { user: user[0] });
};

accountController.genCob = async (req, res) => {
  const reqGN = await GNAPI({
    clientId: process.env.GN_CLIENT_ID,
    clientSecret: process.env.GN_CLIENT_SECRET
  });

  const dataCob = {
    calendario: {
      expiracao: 3600
    },
    valor: {
      original: `${parseFloat(req.body.value).toFixed(2)}`
    },
    chave: "hhlyras2011@gmail.com",
    solicitacaoPagador: "Informe o número ou identificador do pedido."
  };

  const cobResponse = await reqGN.post('/v2/cob', dataCob);
  const qrcodeResponse = await reqGN.get(`/v2/loc/${cobResponse.data.loc.id}/qrcode`);

  res.send({ qrcodeImage: qrcodeResponse.data.imagemQrcode });
};

accountController.webhooks = async (req, res) => {
  console.log(req.body);
  res.send(200);
};

module.exports = accountController;

// const GNAPI = require('../api/gerencianet');

// const reqGN = await GNAPI({
//   clientId: process.env.GN_CLIENT_ID,
//   clientSecret: process.env.GN_CLIENT_SECRET
// });

// const dataCob = {
//   calendario: {
//     expiracao: 3600
//   },
//   devedor: {
//     cpf: '12345678909',
//     nome: "Francisco da Silva"
//   },
//   valor: {
//     original: '119.97'
//   },
//   chave: "596eaf56-e3c0-4f88-8791-355d1bb6dd6e",
//   solicitacaoPagador: "Informe o número ou identificador do pedido."
// };

// const cobResponse = await reqGN.post('/v2/cob', dataCob);
// const qrcodeResponse = await reqGN.get(`/v2/loc/${cobResponse.data.loc.id}/qrcode`);

// res.render('index', { qrcodeImage: qrcodeResponse.data.imagemQrcode });

// -----------------

// data: {
//   calendario: { criacao: '2023-02-01T02:28:53.221Z', expiracao: 3600 },
//   txid: 'ca990d92dfe740258bb6507f8dbed4a0',
//   revisao: 0,
//   loc: {
//     id: 40,
//     location: 'qrcodes-pix-h.gerencianet.com.br/v2/301b7d1203cf473f9def502f657d78b1',
//     tipoCob: 'cob',
//     criacao: '2023-02-01T02:28:53.282Z'
//   },
//   location: 'qrcodes-pix-h.gerencianet.com.br/v2/301b7d1203cf473f9def502f657d78b1',
//   status: 'ATIVA',
//   devedor: { cpf: '12345678909', nome: 'Francisco da Silva' },
//   valor: { original: '119.97' },
//   chave: '596eaf56-e3c0-4f88-8791-355d1bb6dd6e',
//   solicitacaoPagador: 'Informe o número ou identificador do pedido.'
