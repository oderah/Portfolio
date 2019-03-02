const ADMIN = require('../models').Admin

module.exports = {
  async login (req, res) {
    try {
      const {email, password} = req.body
      // console.log('user pass ==>', email, password)
      // console.log('ADMIN ==>', ADMIN)
      const admin = await ADMIN.findOne({
        where: {email: email}
      })
      console.log('admin ==>', admin)
      if (!admin) {
        // return res.status(403).send({
        //   error: '!admin : Incorrect login info!'
        // })
        res.send(false)
      }

      if (!(admin.password === password)) {
        // return res.status(403).send({
        //   error: 'wrong password : Incorrect login info!'
        // })
        res.send(false)
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
