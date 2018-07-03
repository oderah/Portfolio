module.exports = (sequelize, DataTypes) => {
  const ImagePath = sequelize.define('ImagePath', {
    imagePath: DataTypes.TEXT,
    ProjectId: DataTypes.INTEGER
  })

  return ImagePath
}
