const { insert, select } = require('../db/db');
const crypto = require('crypto');

async function getUser(id) {
  const sql = `
    SELECT * FROM users
    WHERE id = ?;
  `;
  const userList = await select(sql, [id]);
  const user = userList[0];

  delete user.password;
  user['is_courier'] = user['is_courier'] == 1;

  return user;
}

async function emailAlreadyInUse(email) {
  const sql = `
    SELECT * FROM users
    WHERE email = ?;
  `;
  const rows = await select(sql, [email]);
  return rows.length > 0;
}

async function phoneNumberAlreadyInUse(phoneNumber) {
  const sql = `
    SELECT * FROM users
    WHERE phone_number = ?;
  `;
  const rows = await select(sql, [phoneNumber]);

  return rows.length > 0;
}

function encryptPassword(email, password) {
  // Tworzenie klucza z emaila za pomocą SHA-256
  const key = crypto.createHash('sha256').update(email).digest();

  // Używanie szyfrowania AES-256-CBC z zerowym wektorem inicjującym dla deterministyczności
  const cipher = crypto.createCipheriv('aes-256-cbc', key, Buffer.alloc(16, 0));

  // Szyfrowanie hasła
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return encrypted;
}

async function register(email, password, phoneNumber, isCourier) {
  if (await emailAlreadyInUse(email)) {
    throw Error('Email already in use');
  } else if (await phoneNumberAlreadyInUse(phoneNumber)) {
    throw Error('Phone number already in use');
  }

  const sql = `
    INSERT INTO users (email, phone_number, password, is_courier)
    VALUES (?, ?, ?, ?);
  `;
  var encryptedPassword = encryptPassword(email, password);
  const id = await insert(sql, [
    email,
    phoneNumber,
    encryptedPassword,
    isCourier,
  ]);
  return await getUser(id);
}

async function login(email, password) {
  if (!(await emailAlreadyInUse(email))) {
    throw Error('No user with this email');
  }

  const sql = `
    SELECT * FROM users
    WHERE email = ? AND password = ?
  `;

  const encryptedPassword = encryptPassword(email, password);
  const rows = await select(sql, [email, encryptedPassword]);

  if (rows.length != 1) throw Error('Access denied');
  const { id } = rows[0];
  return await getUser(id);
}

module.exports = {
  register,
  login,
};
