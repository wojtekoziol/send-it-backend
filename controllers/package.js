const { insert, select, update } = require('../db/db');

function generatePickupCode() {
  return Math.floor(Math.random() * 9000) + 1000;
}

async function getReceiverIdForPhone(receiverPhone) {
  const sql = `
    SELECT * FROM users
    WHERE phone_number = ?;
  `;
  const rows = await select(sql, [receiverPhone]);
  const receiverId = rows.length == 0 ? null : rows[0]['id'];
  return receiverId;
}

async function getCourierIdForStreet(streetId) {
  const sql = `
    SELECT * FROM streets
    WHERE id = ?;
  `;
  const rows = await select(sql, [streetId]);
  const courierId = rows.length == 0 ? null : rows[0]['courier_id'];
  return courierId;
}

async function getPackage(packageId) {
  const sql = `
    SELECT * FROM packages
    WHERE id = ?;    
  `;

  const rows = await select(sql, [packageId]);
  const package = rows.length == 0 ? null : rows[0];
  return package;
}

async function addPackage(
  senderId,
  receiverFirstName,
  receiverLastName,
  receiverPhone,
  streetId,
  weight,
  maxSize
) {
  const sql = `
    INSERT INTO packages (sender_id, receiver_first_name, receiver_last_name, receiver_id, street_id, weight, max_size, courier_id, pickup_code, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const receiverId = await getReceiverIdForPhone(receiverPhone);
  const courierId = await getCourierIdForStreet(streetId);
  if (courierId == null) throw Error('There is no courier for this street');

  const packageId = await insert(sql, [
    senderId,
    receiverFirstName,
    receiverLastName,
    receiverId,
    streetId,
    weight,
    maxSize,
    courierId,
    generatePickupCode(),
    0,
  ]);

  const package = await getPackage(packageId);
  return package;
}

async function getUserPackages(userId) {
  const sql = `
    SELECT * FROM packages
    WHERE receiver_id = ? OR sender_id = ?;
  `;

  const packages = await select(sql, [userId, userId]);
  return packages;
}

async function getCourierPackages(userId) {
  const sql = `
    SELECT * FROM packages
    WHERE status != 3 AND courier_id = ?;
  `;

  const packages = await select(sql, [userId]);
  return packages;
}

async function changePackageStatus(packageId, status, pickupCode) {
  if (pickupCode == null) {
    const sql = `
    UPDATE packages
    SET status = ?
    WHERE id = ?;
  `;
    await update(sql, [status, packageId]);
  } else {
    const sql = `
      UPDATE packages
      SET status = ?
      WHERE id = ? AND pickup_code = ?;
    `;
    await update(sql, [status, packageId, pickupCode]);
  }

  const package = await getPackage(packageId);
  return package;
}

module.exports = {
  addPackage,
  changePackageStatus,
  getUserPackages,
  getCourierPackages,
};
