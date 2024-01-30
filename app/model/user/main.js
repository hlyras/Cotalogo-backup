const db = require('../../../config/connection');
const lib = require('jarmlib');
const bcrypt = require('bcrypt');

const User = function () {
  this.id;
  this.email;
  this.domain;
  this.business;
  this.password;
  this.name;
  this.access;
  this.balance;
  this.token;

  this.create = () => {
    if (!this.business) { return { err: "O Nome da empresa é inválido!" }; }
    if (!this.domain || this.domain.length < 1 || lib.string.hasForbidden(this.domain)) { return { err: "O domínio é inválido!" }; }
    if (!lib.validateEmail(this.email)) { return { err: "Email inválido!" }; }
    if (!this.password) { return { err: "Senha inválida!" }; }
    if (this.password.length < 8) { return { err: "A senha deve conter mais de 8 caracteres." }; }

    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));

    let obj = lib.convertTo.object(this);
    let { query, values } = lib.Query.save(obj, 'cms_cotalogo.user');

    return db(query, values);
  };

  this.update = () => {
    if (!this.id) { return { err: "O id do usuário é inválido" }; }
    if (this.token) { return { err: "Esta ação é inválida." }; }

    let obj = lib.convertTo.object(this);
    let { query, values } = lib.Query.update(obj, 'cms_cotalogo.user', 'id');

    return db(query, values);
  };

  this.token = (token) => {
    let query = `UPDATE cms_cotalogo.user SET token = ? WHERE id = ?;`;
    return db(query, [token, this.id]);
  }
};

User.filter = ({ props, inners, params, strict_params, order_params }) => {
  let { query, values } = new lib.Query().select().props(props).table("cms_cotalogo.user user")
    .inners(inners).params(params).strictParams(strict_params).order(order_params).build();
  return db(query, values);
};

User.findById = id => {
  let query = `SELECT * FROM cms_cotalogo.user WHERE id = ?;`;
  return db(query, [id]);
};

User.findByToken = token => {
  let query = `SELECT id, business, password FROM cms_cotalogo.user WHERE token = ?;`;
  return db(query, [token]);
};

User.destroyToken = token => {
  let query = `UPDATE cms_cotalogo.user SET token = ? WHERE token = ?;`;
  return db(query, [null, token]);
};

User.confirmEmail = (id) => {
  let query = `UPDATE cms_cotalogo.user SET status = ? WHERE id = ?;`;
  return db(query, ['Active', id]);
};

User.findByEmail = email => {
  let query = `SELECT * FROM cms_cotalogo.user WHERE email = ?;`;
  return db(query, [email]);
};

User.findByBusiness = business => {
  let query = `SELECT * FROM cms_cotalogo.user WHERE business = ?`;
  return db(query, [business]);
};

User.findByDomain = domain => {
  let query = `SELECT * FROM cms_cotalogo.user WHERE domain = ?`;
  return db(query, [domain]);
};

module.exports = User;