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
  const ProjectTechs = sequelize.import(path.join(__dirname, 'ProjectTechs'))

  Project.hasMany(Description, {joinTableName: 'Descriptions', foreignKey: 'ProjectId'})
  Project.belongsToMany(Tech, {through: ProjectTechs, foreignKey: 'ProjectId'})
  Tech.belongsToMany(Project, {through: ProjectTechs, foreignKey: 'TechId'})
  Project.hasMany(ImagePath, {joinTableName: 'ImagePaths', foreignKey: 'ProjectId'})

  return Project
}
