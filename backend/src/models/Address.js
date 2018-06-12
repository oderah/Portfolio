const path = require('path')

module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
    unit: DataTypes.STRING,
    street: DataTypes.STRING,
    pCode: DataTypes.STRING,
    province: DataTypes.STRING,
    country: DataTypes.STRING
  })

  const Profile = sequelize.import(path.join(__dirname, 'Profile'))

  Address.belongsTo(Profile)

  return Address
}
