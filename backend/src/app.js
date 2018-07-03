const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const {sequelize} = require('./models')
const config = require('./config/config')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

// app.set('port', 8080)

app.get('/status', (req, res) => {
  res.send({
    msg: 'hello world!'
  })
})

require('./routes')(app)

sequelize.query('SET FOREIGN_KEY_CHECKS = 0', {raw: true}).then(() => {
  sequelize.sync().then(() => {
    app.listen(config.port)
    console.log(`Server started on port ${config.port}`)
  })
})
