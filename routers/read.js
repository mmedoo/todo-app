const express = require('express');
const router = express.Router();
const { new_Connection, new_todo_model } = require('../models');

router.get('/tasks', async (req, res) => {

	const connection = await new_Connection();

	if (connection === null) {
		res.status(500).send('Internal Server Error');
		return;
	}

	const Todo = await new_todo_model(connection);

	if (Todo === null) {
		res.status(500).send('Internal Server Error');
		return;
	}

	const tasks = await Todo.findAll()
		.catch((e) => {
			console.log(e);
			res.status(500).send('Internal Server Error');
		});

	res.status(200).send(tasks);

	connection.close();
	console.log('Connection closed.');
	
});

module.exports = router;
