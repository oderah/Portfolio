module.exports = (sequelize, DataTypes) => {
  const ProjectTechs = sequelize.define('ProjectTechs', {
    ProjectId: DataTypes.INTEGER,
    TechId: DataTypes.INTEGER
  })

  return ProjectTechs
}
