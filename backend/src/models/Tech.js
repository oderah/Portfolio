// const path = require('path')

module.exports = (sequelize, DataTypes) => {
  const Tech = sequelize.define('Tech', {
    tech: DataTypes.STRING,
    ProfileId: DataTypes.INTEGER
  })

  // const Project = sequelize.import(path.join(__dirname, 'Project'))
  // const ProjectsTechs = sequelize.import(path.join(__dirname, 'ProjectsTechs'))
  //
  // Tech.belongsToMany(Project, {through: ProjectsTechs})

  return Tech
}
