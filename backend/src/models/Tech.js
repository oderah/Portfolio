module.exports = (sequelize, DataTypes) => {
  const Tech = sequelize.define('Tech', {
    tech: DataTypes.STRING,
    ProfileId: DataTypes.INTEGER,
    ProjectId: DataTypes.INTEGER
  })

  return Tech
}
