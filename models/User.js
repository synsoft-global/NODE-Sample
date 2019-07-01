"use strict"
//define a exportable module
// defines user structure in db which can be handle by sequilize. Any other field in db table will not affect with sequilize functions.
module.exports = function (sequelize, DataType) {
	var User = sequelize.define ("User", {
		userId: DataType.STRING,
		name: {
			type: DataType.STRING (100),
			allowNull: false
		},
		email: {
			type: DataType.STRING (50),
			allowNull: false
		},
		workEmail: DataType.STRING (50),
		password: {
			type: DataType.STRING (300),
			allowNull: false
		},
		address2latlon: DataType.STRING (200),
		fpToken: DataType.STRING (200),
		registration_token: DataType.STRING (255),
		preferredAddress: {
			type: DataType.INTEGER (11),
			defaultValue: 1
		}
		
	}, {
		paranoid: true,
		classMethods: {
			// It will defines how a user is associated with other modules.
			associate: function (models) {
				User.belongsTo (models.Subscription);
				User.belongsToMany(models.Menu, {through: { model: models.UserMenu, unique: false }});
				User.hasMany (models.Order);						
				User.belongsTo(models.State, { as: "WorkState" });
			}
		}
	});

	return User;
}
