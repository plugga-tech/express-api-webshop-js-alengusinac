var express = require('express');
var router = express.Router();
const UserModel = require('../models/User');

router.get('/', async (req, res) => {
  try {
    const users = await UserModel.find().select('name email');
    if (users.length > 0) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ error: 'Could not find users.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

router.post('/', async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'Could not find user.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

router.post('/add', async (req, res) => {
  try {
    const user = await UserModel.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      res.status(400).json({ message: 'E-mail adressen används redan.' });
    } else {
      res.status(500).json({ error: err });
    }
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await UserModel.findOne(req.body);
    if (user) {
      console.log(user);
      res.status(200).json(user);
    } else {
      res.status(401).send({ message: "Email and password don't match." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
