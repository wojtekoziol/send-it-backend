const express = require('express');
const router = express.Router();
const controller = require('../controllers/street');

// Add street
router.post('/:name', async (req, res) => {
  try {
    const name = req.params['name'];

    const street = await controller.addStreet(name);

    res.json(street);
  } catch (e) {
    res.status(400);
    res.json({ error: e.toString() });
  }
});

// Get all streets
router.get('/', async (req, res) => {
  try {
    const streets = await controller.getAllStreets();

    res.json(streets);
  } catch (e) {
    res.status(400);
    res.json({ error: e.toString() });
  }
});

module.exports = router;
