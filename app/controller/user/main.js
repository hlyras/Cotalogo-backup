// app/controller/user.js
import { findAll } from '../../model/user';

// Exemplo de consulta usando Sequelize
async function getUsers() {
  try {
    const users = await findAll();
    console.log(users);
  } catch (error) {
    console.error(error);
  }
};

export default getUsers;
// const User = require('../../model/user');

// const userController = {};

// userController.index = (req, res) => {
//   res.render('user/profile', { user: req.user });
// };

// module.exports = userController;