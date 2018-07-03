const path = require('path')

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    title: DataTypes.STRING,
    _link: DataTypes.STRING,
    tag: DataTypes.STRING,
    release_date: DataTypes.DATEONLY,
    ProfileId: DataTypes.INTEGER
  })

  const Description = sequelize.import(path.join(__dirname, 'Description'))
  const ImagePath = sequelize.import(path.join(__dirname, 'ImagePath'))
  const Tech = sequelize.import(path.join(__dirname, 'Tech'))

  Project.hasMany(Description, {joinTableName: 'Descriptions', foreignKey: 'ProjectId'})
  Project.hasMany(Tech, {joinTableName: 'Teches', foreignKey: 'ProjectId'})
  Project.hasMany(ImagePath, {joinTableName: 'ImagePaths', foreignKey: 'ProjectId'})

  return Project
}
