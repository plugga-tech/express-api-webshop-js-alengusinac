var express = require('express');
var router = express.Router();
const CategoryModel = require('../models/Category');

router.post('/add', async (req, res) => {
  try {
    const category = await CategoryModel.create(req.body);
    if (req.body.token === process.env.APY_KEY) {
      res.status(201).json(category);
    } else {
      res.status(401).json({ message: 'Not authorised!' });
    }
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      res.status(400).send('Category already exists');
    } else {
      res.status(500).json({ error: err });
    }
  }
});

router.get('/', async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    if (categories.length > 0) {
      res.status(200).json(categories);
    } else {
      res.status(404).send('Could not find any categories.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
