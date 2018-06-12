module.exports = (sequelize, DataTypes) => {
  const Progam = sequelize.define('Progam', {
    institution: DataTypes.STRING,
    title: DataTypes.STRING,
    credential: DataTypes.STRING,
    start: DataTypes.DATEONLY,
    end: DataTypes.DATEONLY
  })

  return Progam
}
