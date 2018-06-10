const AuthenticationController = require('./controllers/AuthenticationController')

console.log('Auth ==> ', AuthenticationController)

module.exports = (app) => {
  app.post('/admin/login', AuthenticationController.login)
}
