module.exports = (sequelize, DataTypes) => {
  const Social = sequelize.define('Social', {
    name: DataTypes.STRING,
    social: DataTypes.STRING,
    ProfileId: DataTypes.INTEGER
  })

  return Social
}
