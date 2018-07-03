module.exports = (sequelize, DataTypes) => {
  const Program = sequelize.define('Program', {
    institution: DataTypes.STRING,
    title: DataTypes.STRING,
    credential: DataTypes.STRING,
    start: DataTypes.STRING,
    end: DataTypes.STRING,
    ProfileId: DataTypes.INTEGER
  })

  return Program
}
