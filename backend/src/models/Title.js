module.exports = (sequelize, DataTypes) => {
  const Title = sequelize.define('Title', {
    title: DataTypes.STRING
  })

  return Title
}
