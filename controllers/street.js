const { select, insert } = require('../db/db');

async function getStreet(streetId) {
  const sql = `
    SELECT * FROM streets
    WHERE id = ?;
  `;
  const rows = await select(sql, [streetId]);
  const street = rows.length == 0 ? null : rows[0];
  return street;
}

async function getCourierIdForNewStreet() {
  const sql = `
    SELECT u.id AS courier_id
    FROM users u
    LEFT JOIN streets s ON u.id = s.courier_id
    WHERE u.is_courier = 1
    GROUP BY u.id
    ORDER BY COUNT(s.id) ASC
  `;
  const rows = await select(sql);
  return rows[0]['courier_id'];
}

async function addStreet(name) {
  const sql = `
    INSERT INTO streets (name, courier_id)
    VALUES (?, ?)
  `;

  const courierId = await getCourierIdForNewStreet();
  const streetId = await insert(sql, [name, courierId]);
  const street = await getStreet(streetId);
  return street;
}

async function getAllStreets() {
  const sql = `
    SELECT * FROM streets
  `;

  const streets = await select(sql, []);
  return streets;
}

module.exports = {
  addStreet,
  getAllStreets,
};
