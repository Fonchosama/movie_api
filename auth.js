/**
 * Secret key used to sign JWT tokens.
 * @constant {string}
 */
const jwtSecret = 'your_jwt_secret'; // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport'); // Your local passport file

let generateJWTToken = (user) => {
  /**
 * Generates a JWT token for a given user.
 * @function
 * @param {Object} user - The user object.
 * @param {string} user.Username - The username to encode in the JWT.
 * @returns {string} The signed JWT token.
 */
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // This is the username you’re encoding in the JWT
    expiresIn: '7d', // This specifies that the token will expire in 7 days
    algorithm: 'HS256', // This is the algorithm used to “sign” or encode the values of the JWT
  });
};

//POST login.
/**
 * Defines the login route using Passport authentication.
 * @function
 * @param {Object} router - The Express router instance.
 */
module.exports = (router) => {
    /**
   * POST /login
   * @name Login
   * @function
   * @memberof module:routes
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Object} JSON object containing the user and JWT token.
   */
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
