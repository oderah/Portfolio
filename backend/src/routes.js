const AuthenticationController = require('./controllers/AuthenticationController')
const ProfileController = require('./controllers/ProfileController')

console.log('Auth ==> ', AuthenticationController)

module.exports = (app) => {
  app.post('/admin/login', AuthenticationController.login)
  app.get('/about', ProfileController.getProfile)
  app.post('/about', ProfileController.setProfile)
}
