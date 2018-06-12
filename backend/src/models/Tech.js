module.exports = (sequelize, DataTypes) => {
  const Tech = sequelize.define('Tech', {
    tech: DataTypes.STRING
  })

  return Tech
}
