const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const new_Connection = async () => {
	const connection = await new Sequelize({
		dialect: 'sqlite',
		storage: process.env.DB_PATH || "./tododb.sqlite3",
		logging: false,
	});

	try {
		await connection.authenticate();
		console.log('Connection has been established successfully.');
		return connection;
	} catch (error) {
		console.error('Unable to connect to the database:', error);
		return null;
	}
}

const new_todo_model = async (connection) => {
	const Todo = await connection.define('Todo', {
		userID: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true
		},
		completed: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	},
		{
			freezeTableName: true
		}
	);


	try {
		await Todo.sync();
		console.log('Todo table synced successfully.');
		return Todo;
	} catch (error) {
		console.error('Unable to sync Todo table:', error);
		return null;
	}
}


const user_model = async (connection) => {
	const User = await connection.define('User', {
		userID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
		{
			freezeTableName: true
		}
	);


	try {
		await User.sync();
		console.log('User table synced successfully.');
		return User;
	} catch (error) {
		console.error('Unable to sync User table:', error);
		return null;
	}
}

module.exports = {
	new_Connection,
	new_todo_model,
	user_model
}