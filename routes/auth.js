const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');

// Register
router.post('/:email/:password/:phone_number/:is_courier', async (req, res) => {
  try {
    const email = req.params['email'];
    const password = req.params['password'];
    const phoneNumber = req.params['phone_number'];
    const isCourier = req.params['is_courier'] == 'true' ? 1 : 0;

    const user = await controller.register(
      email,
      password,
      phoneNumber,
      isCourier
    );

    res.json(user);
  } catch (e) {
    console.log(e.toString());
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
    console.log(e.toString());
    res.status(400);
    res.json({ error: e.toString() });
  }
});

// Get user
router.get('/:id', async (req, res) => {
  try {
    const id = req.params['id'];

    const user = await controller.getUser(id);

    res.json(user);
  } catch (e) {
    console.log(e.toString());
    res.status(400);
    res.json({ error: e.toString() });
  }
});

module.exports = router;
