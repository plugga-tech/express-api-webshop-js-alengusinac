var express = require('express');
var router = express.Router();
const UserModel = require('../models/User');

/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    const users = await UserModel.find();
    if (users.length > 0) {
      res.status(200).json(users);
    } else {
      res.status(404).send('Kunde inte hitta några användare.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error.');
  }
});

router.post('/', async (req, res) => {
  try {
    const user = await UserModel.find({ _id: req.body.id });
    if (user.length > 0) {
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(404).send('User not found.');
  }
});

router.post('/add', async (req, res) => {
  try {
    const user = await UserModel.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error.');
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await UserModel.findOne(req.body);
    console.log(user);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send('E-mail och lösenord matchar inte.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error.');
  }
});

module.exports = router;
