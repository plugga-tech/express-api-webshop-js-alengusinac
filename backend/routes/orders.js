var express = require('express');
var router = express.Router();
const OrderModel = require('../models/Order');

router.post('/add', async (req, res) => {
  try {
    const order = await OrderModel.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

router.get('/all', async (req, res) => {
  try {
    const orders = await OrderModel.find();
    if (orders.length > 0) {
      res.status(200).json(orders);
    } else {
      res.status(204).send('Could not find orders.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
