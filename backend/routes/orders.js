var express = require('express');
var router = express.Router();
const OrderModel = require('../models/Order');

router.post('/add', async (req, res) => {
  try {
    const order = await OrderModel.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error.');
  }
});

router.get('/all', async (req, res) => {
  try {
    const orders = await OrderModel.find();
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error.');
  }
});

module.exports = router;
