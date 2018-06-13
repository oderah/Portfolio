module.exports = (sequelize, DataTypes) => {
  const Title = sequelize.define('Title', {
    title: DataTypes.STRING,
    ProfileId: DataTypes.INTEGER
  })

  return Title
}
