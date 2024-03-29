module.exports = (sequelize, DataTypes) => {
  const Coupon = sequelize.define(
    'Coupon',
    {
      key: DataTypes.STRING,
      used: DataTypes.BOOLEAN
    },
    {
      classMethods: {
        associate(models) {
          Coupon.belongsTo(models.Subscription);
          Coupon.belongsTo(models.Product);
        }
      }
    }
  );
  return Coupon;
};
