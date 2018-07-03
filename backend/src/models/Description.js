// const path = require('path')

module.exports = (sequelize, DataTypes) => {
  const Description = sequelize.define('Description', {
    description: DataTypes.TEXT,
    ProjectId: DataTypes.INTEGER
  })

  // const Profile = sequelize.import(path.join(__dirname, 'Profile'))
  //
  // Description.belongsTo(Profile)

  return Description
}
