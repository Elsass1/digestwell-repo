const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const User = sequelize.define(
  'user',
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Items = sequelize.define('items', {
  name: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  select: {
    type: DataTypes.ENUM('Food', 'Beverage', 'Medication', 'Supplement'),
    allowNull: true,
  },
  health_impact: {
    type: DataTypes.ENUM('Beneficial', 'Neutral', 'Avoid'),
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'user_id',
    },
  },
});

const Symptoms = sequelize.define('symptoms', {
  stool_type: {
    type: DataTypes.ENUM(
      'Type 1',
      'Type 2',
      'Type 3',
      'Type 4',
      'Type 5',
      'Type 6',
      'Type 7'
    ),
    allowNull: true,
  },
  is_bleeding: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  other_symptoms: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'user_id',
    },
  },
  itemId: {
    type: DataTypes.INTEGER,
    references: {
      model: Items,
      key: 'id',
    },
  },
});

User.hasMany(Items, { foreignKey: 'userId' });
Items.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Symptoms, { foreignKey: 'userId' });
Symptoms.belongsTo(User, { foreignKey: 'userId' });

Items.hasMany(Symptoms, { foreignKey: 'itemId' });
Symptoms.belongsTo(Items, { foreignKey: 'itemId' });

module.exports = { User, Items, Symptoms };
