const router = require('express').Router();
const { new_Connection, new_todo_model } = require('../models');

router.get('/tasks/:userid', async (req, res) => {
	
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

	const tasks = await Todo.findAll({
		where: {
			userID: Number(req.params.userid)
		}})
		.catch((e) => {
			console.log(e);
			res.status(500).send('Internal Server Error');
		});

	res.status(200).send(tasks);

	connection.close();

	console.log('Connection closed.');
	
});

module.exports = router;
