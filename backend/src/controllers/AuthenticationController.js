const ADMIN = require('../models').Admin

module.exports = {
  async login (req, res) {
    try {
      const {username, password} = req.body
      // console.log('user pass ==>', username, password)
      // console.log('ADMIN ==>', ADMIN)
      const admin = await ADMIN.findOne({
        where: {username: username}
      })
      console.log('admin ==>', admin)
      if (!admin) {
        return res.status(403).send({
          error: '!admin : Incorrect login info!'
        })
      }

      if (!(admin.password === password)) {
        return res.status(403).send({
          error: 'wrong password : Incorrect login info!'
        })
      }

      res.send({
        admin: admin.toJSON()
      })
    } catch (err) {
      console.log(err)
      res.status(403).send({
        error: 'Incorrect login info!'
      })
    }
  }
}
