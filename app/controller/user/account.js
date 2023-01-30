const User = require('../../model/user');

const lib = require('jarmlib');

const accountController = {};

accountController.index = async (req, res) => {
  let props = ["user.id", "user.name", "user.business", "user.email", "user.status", "user.balance"];
  let strict_params = { keys: [], values: [] };
  lib.Query.fillParam("user.id", req.user.id, strict_params);
  let user = await User.filter(props, [], [], strict_params, []);

  console.log(user);

  res.render('user/account', { user: user });
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