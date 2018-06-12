module.exports = (sequelize, DataTypes) => {
  const About = sequelize.define('About', {
    paragraph: DataTypes.STRING
  })

  return About
}
