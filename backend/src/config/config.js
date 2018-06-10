module.exports = {
  port: process.env.PORT || 8081,
  db: {
    database: process.env.DB_NAME || 'portfolio',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'root',
    options: {
      dialect: process.env.DIALECT || 'mysql',
      host: process.env.HOST || 'localhost',
      storage: './portfolio.mysql',
      socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
      operatorsAliases: false
    }
  }
}
