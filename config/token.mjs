import JWT from 'jsonwebtoken';

const generate = data => (
  new Promise((resolve) => {
    JWT.sign(data, process.env.SECRET_KEY, (err, token) => {
      if (err) {
        console.error(err);
      }

      resolve(token);
    });
  })
);

export default {
  generate
};