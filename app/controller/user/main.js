const userController = {};

userController.index = (req, res) => {
  res.render('user/profile', { user: req.user });
};

module.exports = userController;