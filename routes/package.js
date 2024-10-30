const express = require('express');
const router = express.Router();
const controller = require('../controllers/package');

// Add package
router.post(
  '/:sender_id/:receiver_first_name/:receiver_last_name/:receiver_phone/:street_id/:street_no/:apartment_no/:weight/:max_size',
  async (req, res) => {
    try {
      const senderId = req.params['sender_id'];
      const receiverFirstName = req.params['receiver_first_name'];
      const receiverLastName = req.params['receiver_last_name'];
      const receiverPhone = req.params['receiver_phone'];
      const streetId = req.params['street_id'];
      const streetNo = req.params['street_no'];
      const apartmentNo = req.params['apartment_no'];
      const weight = req.params['weight'];
      const maxSize = req.params['max_size'];

      const package = await controller.addPackage(
        senderId,
        receiverFirstName,
        receiverLastName,
        receiverPhone,
        streetId,
        streetNo,
        apartmentNo,
        weight,
        maxSize
      );

      res.json(package);
    } catch (e) {
      console.log(e.toString());

      res.status(400);
      res.json({ error: e.toString() });
    }
  }
);

// Get user packages
router.get('/:user_id', async (req, res) => {
  try {
    const userId = req.params['user_id'];

    const packages = await controller.getUserPackages(userId);

    res.json(packages);
  } catch (e) {
    console.log(e.toString());

    res.status(400);
    res.json({ error: e.toString() });
  }
});

// Get courier packages
router.get('/courier/:user_id', async (req, res) => {
  try {
    const userId = req.params['user_id'];

    const packages = await controller.getCourierPackages(userId);

    res.json(packages);
  } catch (e) {
    console.log(e.toString());

    res.status(400);
    res.json({ error: e.toString() });
  }
});

// Change package status
router.patch('/:package_id/:status/', async (req, res) => {
  try {
    const packageId = req.params['package_id'];
    const status = req.params['status'];

    const package = await controller.changePackageStatus(packageId, status);

    res.json(package);
  } catch (e) {
    console.log(e.toString());
    res.status(400);
    res.json({ error: e.toString() });
  }
});

// To pickup point
router.patch('/pickup/:package_id/:pickup_point_id', async (req, res) => {
  try {
    const packageId = req.params['package_id'];
    const pickupPointId = req.params['pickup_point_id'];

    const package = await controller.changePackageStatusToPickupPoint(
      packageId,
      pickupPointId
    );

    res.json(package);
  } catch (e) {
    console.log(e.toString());
    res.status(400);
    res.json({ error: e.toString() });
  }
});

// Deliver
router.patch('/deliver/:package_id/:pickup_code', async (req, res) => {
  try {
    const packageId = req.params['package_id'];
    const pickupCode = req.params['pickup_code'];

    const package = await controller.changePackageStatusToDelivered(
      packageId,
      pickupCode
    );

    res.json(package);
  } catch (e) {
    console.log(e.toString());
    res.status(400);
    res.json({ error: e.toString() });
  }
});

module.exports = router;
