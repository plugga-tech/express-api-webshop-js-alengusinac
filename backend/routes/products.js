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
    res.status(500).send('Internal server error.');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    }
  } catch {
    res.status(404).send('Could not find product.');
  }
});

router.post('/add', async (req, res) => {
  try {
    const product = await ProductModel.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error.');
  }
});

module.exports = router;
