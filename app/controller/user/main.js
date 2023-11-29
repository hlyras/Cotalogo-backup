// app/controller/user.js
const User = require('../../model/user');

// Exemplo de consulta usando Sequelize
async function getUsers() {
  try {
    const users = await User.findAll();
    console.log(users);
  } catch (error) {
    console.error(error);
  }
}

// module.exports = getUsers;

// const User = require('../../model/user');

// const userController = {};

// userController.index = (req, res) => {
//   res.render('user/profile', { user: req.user });
// };

// module.exports = userController;