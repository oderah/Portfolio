const path = require('path')

module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    tel: DataTypes.STRING,
    email: DataTypes.STRING
  })

  const Title = sequelize.import(path.join(__dirname, 'Title'))
  const Program = sequelize.import(path.join(__dirname, 'Program'))
  const Skill = sequelize.import(path.join(__dirname, 'Skill'))
  const Tech = sequelize.import(path.join(__dirname, 'Tech'))
  const About = sequelize.import(path.join(__dirname, 'About'))
  const Social = sequelize.import(path.join(__dirname, 'Social'))
  const Project = sequelize.import(path.join(__dirname, 'Project'))

  Profile.hasMany(Title, {joinTableName: 'Titles', foreignKey: 'ProfileId'})
  Profile.hasMany(Program, {joinTableName: 'Programs', foreignKey: 'ProfileId'})
  Profile.hasMany(Skill, {joinTableName: 'Skills', foreignKey: 'ProfileId'})
  Profile.hasMany(Tech, {joinTableName: 'Teches', foreignKey: 'ProfileId'})
  Profile.hasMany(About, {joinTableName: 'Abouts', foreignKey: 'ProfileId'})
  Profile.hasMany(Social, {joinTableName: 'Socials', foreignKey: 'ProfileId'})
  Profile.hasMany(Project, {joinTableName: 'Projects', foreignKey: 'ProfileId'})

  return Profile
}
