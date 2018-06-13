module.exports = (sequelize, DataTypes) => {
  const About = sequelize.define('About', {
    paragraph: DataTypes.STRING,
    ProfileId: DataTypes.INTEGER
  })

  return About
}
