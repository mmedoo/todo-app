const router = require('express').Router();
const { new_Connection, user_model } = require('../models');
const crypto = require('node:crypto');

function hash(password) {
	return crypto.createHash('sha256').update(password).digest('hex');
}


router.post('/init/:way', async (req, res) => {
		
	const connection = await new_Connection();

	if (connection === null) {
		res.status(500).send('Internal Server Error');
		return;
	}

	const User = await user_model(connection);

	if (User === null) {
		res.status(500).send('Internal Server Error');
		return;
	}

	const { username, password } = req.body;
	const way = req.params.way;

	if (way === "login") {

		const user = await User.findOne({
			where: { username }
		}).catch((e) => {
			console.log(e);
			res.status(500).send('Internal Server Error');
		});

		if (user === null) {
			res.status(404).send('Not Found. Try Signup');
			connection.close();
			return;
		}

		if (hash(password) !== user.password) {
			res.status(401).send('Wrong Password');
			connection.close();
			return;
		}
		
		res.status(200).send(String(user.userID));

	} else if (way === "signup") {

		await User.create({
			userID: Math.floor(Math.random() * 90000) + 10000,
			password: hash(password),
			username: username
		}).then(() => {
			res.status(201).send('Created');
		}).catch((e) => {
			console.log(e);
			res.status(500).send('Internal Server Error');
		});

	} else {
		res.status(400).send('Bad Request');
	}

	connection.close();
});

module.exports = router;