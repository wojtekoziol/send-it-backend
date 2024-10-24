const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');

// Register
router.post('/:email/:password/:phone_number', async (req, res) => {
  try {
    const email = req.params['email'];
    const password = req.params['password'];
    const phoneNumber = req.params['phone_number'];

    const user = await controller.register(email, password, phoneNumber);

    res.json(user);
  } catch (e) {
    res.status(400);
    res.json({ error: e.toString() });
  }
});

// Login
router.get('/:email/:password', async (req, res) => {
  try {
    const email = req.params['email'];
    const password = req.params['password'];

    const user = await controller.login(email, password);

    res.json(user);
  } catch (e) {
    res.status(400);
    res.json({ error: e.toString() });
  }
});

module.exports = router;
