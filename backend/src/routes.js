const AuthenticationController = require('./controllers/AuthenticationController')
const ProfileController = require('./controllers/ProfileController')

var path = require('path')

const multer = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, callBack) {
    callBack(null, path.join(__dirname, '..', 'pictures'))
  },

  filename: function (req, file, callBack) {
    callBack(null, Date.now() + '##' + file.originalname)
  }
})

var upload = multer({
  storage: storage,
  onParseStart: function (file) {
    console.log(`PARSING ${file.originalname} ...`)
  },
  onFileUploadStart: function (file) {
    console.log(`UPLOADING ${file.originalname} ...`)
  }
})

console.log('Auth ==> ', AuthenticationController)

module.exports = (app) => {
  app.post('/admin/login', upload.none(), AuthenticationController.login)
  app.get('/about', ProfileController.getProfile)
  app.post('/about', upload.none(), ProfileController.setProfile)
  app.post('/about/pic', ProfileController.setProfilePic)
  app.get('/about/pic', ProfileController.getProfilePic)
  app.get('/portfolio', ProfileController.getProjects)
  app.post('/portfolio/:id', ProfileController.deleteProject)
  app.get('/portfolio/:id', ProfileController.getProject)
  app.post('/portfolio', upload.array('pictures', 20), ProfileController.addProject)
  app.post('/portfolio/edit/:id', upload.array('photos', 20), ProfileController.editProject)
  app.get('/image', ProfileController.loadImage)
  app.get('/techs', ProfileController.getAllTechs)
  app.get('/techs/:id', ProfileController.getProjectTechs)
  // app.post('/portfolio', function (req, res) {
  //   console.log('BACKEND API /portfolio... ')
  //   let up = upload.array('pictures', 20)
  //   up(req, res, function (err) {
  //     console.log('up req', req.body)
  //     if (err instanceof multer.MulterError) {
  //       console.log(err)
  //       res.send(false)
  //     } else {
  //       console.log('bruhh', req.files)
  //
  //       if (req.files.length > 0) {
  //         console.log('beast', req.files[0])
  //       } else {
  //         console.log('bruhhhhh')
  //       }
  //
  //       res.send(true)
  //     }
  //   })
  // })
}
