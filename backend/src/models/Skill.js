module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define('Skill', {
    skill: DataTypes.STRING,
    ProfileId: DataTypes.INTEGER
  })

  return Skill
}
