const User = require('../../model/user/main');

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