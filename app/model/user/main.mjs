import { DataTypes, Op } from 'sequelize'
import sequelize from '../../../config/sequelize.mjs'
import ORM from '../../lib/orm.mjs'

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  business: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: DataTypes.STRING,
  access: DataTypes.STRING,
  balance: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 0.00
  },
  token: DataTypes.STRING,
}, {
  tableName: 'user',
  timestamps: false,
});

User.filter = async function (props, inners, conditions, order) {
  let query = ORM.select({ props, inners, conditions, order }, Op);
  return await User.findAll({ raw: true, query });
};

setTimeout(async () => {
  let conditions = [];
  ORM.fill({ field: 'id', operator: 'in', value: [1, 2], Op }, conditions);
  // lib.Query.fill({ field: 'name', operator: 'like', value: 'John' }, conditions);
  // lib.Query.fill({ field: 'age', operator: 'strict', value: 25 }, conditions);
  // lib.Query.fill({ field: 'birth', operator: 'between', value: [1980, 2000] }, conditions);
  // lib.Query.fill({ field: 'height', operator: 'greater', value: 170 }, conditions);

  // let users = await User.filter([], [], conditions, []);
  // console.log(users);
}, 1000);

export default User;