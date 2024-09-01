const { Sequelize, DataTypes } = require('sequelize');
const { all } = require('./routers/create');
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
	}},
	{
		freezeTableName: true
	});


	try {
		await Todo.sync();
		console.log('Todo table created successfully.');
		return Todo;
	} catch (error) {
		console.error('Unable to create Todo table:', error);
		return null;
	}
	
	
}

module.exports = {
	new_Connection,
	new_todo_model
}