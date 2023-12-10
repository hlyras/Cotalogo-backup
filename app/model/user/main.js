import db from '../../../config/connection.js';
import lib from '../../lib/main.js';
import bcrypt from 'bcrypt';

const User = function (user) {
  this.id;
  this.email = user.email;
  this.business = user.business;
  this.password = user.password;
  this.name = user.name;
  this.access = '30days';
  this.balance = 0;
  this.token = "";

  this.save = () => {
    if (!this.business || this.business.length < 1 || lib.string.hasForbidden(user.business)) { return { err: "O nome da empresa é inválido!" }; }
    if (!lib.validateEmail(this.email)) { return { err: "Email inválido!" }; }
    if (!this.password) { return { err: "Senha inválida!" }; }
    if (this.password.length < 8) { return { err: "A senha deve conter mais de 8 caracteres." }; }

    this.password = bcrypt.hashSync(this.password, null, null);

    let obj = lib.convertTo.object(this);
    let { query, values } = lib.Query.save(obj, 'cms_cotalogo.user');

    return db(query, values);
  };

  this.token = (token) => {
    let query = `UPDATE cms_cotalogo.user SET token = ? WHERE id = ?;`;
    return db(query, [token, this.id]);
  }
};

User.filter = (props, inners, params, strict_params, order_params) => {
  let { query, values } = new lib.Query().select().props(props).table("cms_cotalogo.user user")
    .inners(inners).params(params).strictParams(strict_params).order(order_params).build();
  return db(query, values);
};

User.findById = id => {
  let query = `SELECT * FROM cms_cotalogo.user WHERE id = ?;`;
  return db(query, [id]);
};

User.findByToken = token => {
  let query = `SELECT id FROM cms_cotalogo.user WHERE token = ?;`;
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

export default User;

// import { DataTypes, Op } from 'sequelize'
// import sequelize from '../../../config/sequelize.js'
// import ORM from '../../lib/orm.js'

// const User = sequelize.define('User', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   business: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   name: DataTypes.STRING,
//   access: DataTypes.STRING,
//   balance: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     defaultValue: 0.00
//   },
//   token: DataTypes.STRING,
// }, {
//   tableName: 'user',
//   timestamps: false,
// });

// User.filter = async function (props, inners, conditions, order) {
//   let query = ORM.select({ props, inners, conditions, order }, Op);
//   return await User.findAll({ raw: true, query });
// };

// setTimeout(async () => {
//   let conditions = [];
//   ORM.fill({ field: 'id', operator: 'in', value: [1, 2], Op }, conditions);

//   let users = await User.filter([], [], conditions, []);
//   console.log(users);
// }, 1000);

// export default User;