var express = require('express');
var router = express.Router();
const ProductModel = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const products = await ProductModel.find();
    if (products.length > 0) {
      res.status(200).json(products);
    } else {
      res.status(404).send('Could not find any products.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).send('Could not find product.');
    }
  } catch (err) {
    console.error(err);
    if (err.name === 'CastError') {
      res.status(400).send('ID format not recognised');
    } else {
      res.status(500).json({ error: err });
    }
  }
});

router.post('/add', async (req, res) => {
  try {
    const product = await ProductModel.create(req.body);
    if (req.body.token === process.env.APY_KEY) {
      res.status(201).json(product);
    } else {
      res.status(401).json({ message: 'Not authorised!' });
    }
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      res.status(400).send('Product name already exists');
    } else {
      res.status(500).json({ error: err });
    }
  }
});

router.get('/category/:id', async (req, res) => {
  try {
    const products = await ProductModel.find({ category: req.params.id });
    if (products.length > 0) {
      res.status(200).json(products);
    } else {
      res.status(404).send('Could not find any products');
    }
  } catch (err) {
    console.error(err);
    if (err.name === 'CastError') {
      res.status(400).send('ID format not recognised');
    } else {
      res.status(500).json({ error: err });
    }
  }
});

module.exports = router;
