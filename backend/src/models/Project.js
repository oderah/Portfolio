const path = require('path')

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    title: DataTypes.STRING,
    _link: DataTypes.STRING,
    tag: DataTypes.STRING,
    img_src: DataTypes.STRING
  })

  const Description = sequelize.import(path.join(__dirname, 'Description'))
  const Tech = sequelize.import(path.join(__dirname, 'Tech'))

  Project.hasMany(Description)
  Project.hasMany(Tech)

  return Project
}
