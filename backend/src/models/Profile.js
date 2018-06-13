const path = require('path')

module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    // id: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true
    // },
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

  Profile.hasMany(Title, {joinTableName: 'Titles', foreignKey: 'ProfileId'})
  Profile.hasMany(Program, {joinTableName: 'Programs', foreignKey: 'ProfileId'})
  Profile.hasMany(Skill, {joinTableName: 'Skills', foreignKey: 'ProfileId'})
  Profile.hasMany(Tech, {joinTableName: 'Teches', foreignKey: 'ProfileId'})
  Profile.hasMany(About, {joinTableName: 'Abouts', foreignKey: 'ProfileId'})
  // Profile.hasMany(Title)
  // Profile.hasMany(Program)t
  // Profile.hasMany(Skill)
  // Profile.hasMany(Tech)
  // Profile.hasMany(About)

  return Profile
}
