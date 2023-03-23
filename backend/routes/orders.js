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

router.get('/all/:token', async (req, res) => {
  try {
    const orders = await OrderModel.find();
    if (req.params.token === process.env.APY_KEY) {
      if (orders.length > 0) {
        res.status(200).json(orders);
      } else {
        res.status(404).send('Could not find orders.');
      }
    } else {
      res.status(401).json({ message: 'Not authorised!' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

router.post('/user', async (req, res) => {
  try {
    const order = await OrderModel.find({ user: req.body.user });
    if (req.body.token === process.env.APY_KEY) {
      if (order.length > 0) {
        res.status(200).json(order);
      } else {
        res.status(404).send('Could not find any orders.');
      }
    } else {
      res.status(401).json({ message: 'Not authorised!' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
