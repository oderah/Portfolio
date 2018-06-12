const path = require('path')

module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    fistName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    tel: DataTypes.STRING,
    email: DataTypes.STRING
  })

  const Title = sequelize.import(path.join(__dirname, 'Title'))
  const Program = sequelize.import(path.join(__dirname, 'Program'))
  const Skill = sequelize.import(path.join(__dirname, 'Skill'))
  const Tech = sequelize.import(path.join(__dirname, 'Tech'))
  const About = sequelize.import(path.join(__dirname, 'About'))

  Profile.hasMany(Title)
  Profile.hasMany(Program)
  Profile.hasMany(Skill)
  Profile.hasMany(Tech)
  Profile.hasMany(About)

  return Profile
}
