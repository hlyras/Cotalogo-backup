const JWT = require('jsonwebtoken');

const generate = data => (
  new Promise((resolve, reject) => {
    JWT.sign(data, process.env.JWT_SECRET_KEY, (err, token) => {
      if (err) { reject(console.error(err)); }

      resolve(token);
    });
  })
);

module.exports = {
  generate,
};