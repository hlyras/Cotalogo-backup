import User from '../../model/user/main.mjs';
import lib from '../../lib/main.mjs';
import GNAPI from '../../api/gerencianet.mjs';

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
    chave: "596eaf56-e3c0-4f88-8791-355d1bb6dd6e",
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

export default accountController;