const express = require('express');
const router = express.Router();
const { new_Connection, new_todo_model } = require('../models');
const { validationResult, param } = require('express-validator');

router.delete('/tasks/:id', param('id').notEmpty(), async (req, res) => {
	
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

	const id = req.params.id;

	const row = await Todo.findOne({ where: { id } });

	if (row === null) {
		res.status(404).send('Not Found');
		connection.close();
		console.log('Connection closed.');
		return;
	}

	await row.destroy()
		.then(() => {
			res.status(201).send('Deleted');
		}).catch((e) => {
			console.log(e);
			res.status(500).send('Internal Server Error');
		});

	connection.close();
	console.log('Connection closed.');
});

module.exports = router;