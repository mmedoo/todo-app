const express = require('express');
const router = express.Router();
const { new_Connection, new_todo_model } = require('../models');
const { body, validationResult } = require('express-validator');

router.post('/tasks', body().notEmpty(), async (req, res) => {

	if (!validationResult(req).isEmpty()) {
		return res.send({ errors: result.array() });
	}
	
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

	const { id, title, description, completed } = req.body;

	await Todo.create({
		id,
		title,
		description,
		completed
	}).then(() => {
		res.status(201).send('Created');
	}).catch((e) => {
		console.log(e);
		res.status(500).send('Internal Server Error');
	});

	connection.close();
	console.log('Connection closed.');
	
});

module.exports = router;
