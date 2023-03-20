var express = require('express');
var router = express.Router();
const UserModel = require('../models/User');

/* GET users listing. */
router.get('/', async (req, res) => {
  const users = await UserModel.find();
  if (users.length > 0) {
    res.status(200).json(users);
  } else {
    res.status(404).send('Kunde inte hitta några användare.');
  }
});

router.post('/', async (req, res) => {
  const user = await UserModel.find({ _id: req.body.id });
  if (user.length > 0) {
    res.status(200).json(user);
  } else {
    res.status(404).send('Kunde inte hitta någon användare.');
  }
});

router.post('/add', async (req, res) => {
  const user = await UserModel.create(req.body);
  res.status(201).json(user);
});

router.post('/login', async (req, res) => {
  const user = await UserModel.findOne(req.body);
  console.log(user);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).send('E-mail och lösenord matchar inte.');
  }
});

module.exports = router;
