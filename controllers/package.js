const { insert, select, update } = require('../db/db');

function generatePickupCode() {
  return Math.floor(Math.random() * 9000) + 1000;
}

async function getReceiverIdForEmail(receiverEmail) {
  const sql = `
    SELECT id FROM users
    WHERE email = ?;
  `;
  const rows = await select(sql, [receiverEmail]);
  const receiverId = rows.length == 0 ? null : rows[0];
  return receiverId;
}

async function getCourierIdForStreet(streetId) {
  const sql = `
    SELECT courier_id FROM streets
    WHERE id = ?;
  `;
  const rows = await select(sql, [streetId]);
  const courierId = rows.length == 0 ? null : rows[0];
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
  receiverEmail,
  streetId,
  weight,
  maxSize
) {
  const sql = `
    INSERT INTO packages (sender_id, receiver_first_name, receiver_last_name, receiver_id, street_id, weight, max_size, courier_id, pickup_code)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const receiverId = await getReceiverIdForEmail(receiverEmail);
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
  ]);

  const package = await getPackage(packageId);
  return package;
}

async function getUserPackages(userId) {
  const sql = `
    SELECT * FROM packages
    WHERE receiver_id = ?;
  `;

  const packages = await select(sql, [userId]);
  return packages;
}

async function getCourierPackages(userId) {
  const sql = `
    SELECT * FROM packages
    WHERE courier_id = ?;
  `;

  const packages = await select(sql, [userId]);
  return packages;
}

async function changePackageStatus(packageId, status) {
  const sql = `
    UPDATE packages
    SET status = ?
    WHERE id = ?;
  `;

  await update(sql, [status, packageId]);
  const package = await getPackage(packageId);
  return package;
}

module.exports = {
  addPackage,
  changePackageStatus,
  getUserPackages,
  getCourierPackages,
};
