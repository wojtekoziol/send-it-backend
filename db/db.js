const sqlite3 = require('sqlite3').verbose();
const filepath = './db/sendit.db';

let db = getDB();

function getDB() {
  const db = new sqlite3.Database(filepath, (error) => {
    if (error) {
      return console.error(error.message);
    }

    createUsersTable(db);
    createStreetsTable(db);
    createPackagesTable(db);

    console.log('Connection with database has been established');
  });

  return db;
}

// Returns last ID
async function insert(sql, params) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        return reject(err);
      }

      resolve(this.lastID);
    });
  });
}

// Returns list of selected rows
async function select(sql, params) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, function (err, rows) {
      if (err) {
        return reject(err);
      }

      resolve(rows);
    });
  });
}

function createUsersTable(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email VARCHAR(319) NOT NULL UNIQUE,
      phone_number VARCHAR(9) NOT NULL,
      password VARCHAR(255) NOT NULL,
      is_courier INTEGER DEFAULT 0 NOT NULL
    );
  `);
}

function createStreetsTable(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS streets(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) NOT NULL,
      courier_id INTEGER, 
      FOREIGN KEY(courier_id) REFERENCES users(id)      
    );
  `);
}

function createPackagesTable(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS packages(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      receiver_first_name VARCHAR(255) NOT NULL,
      receiver_last_name VARCHAR(255) NOT NULL,
      street_id INTEGER, 
      sender_id INTEGER, 
      weight INTEGER NOT NULL,
      max_size INTEGER NOT NULL,
      status INTEGER NOT NULL,     
      courier_id INTEGER, 
      pickup_code INTEGER NOT NULL,
      FOREIGN KEY(sender_id) REFERENCES users(id), 
      FOREIGN KEY(street_id) REFERENCES streets(id),      
      FOREIGN KEY(courier_id) REFERENCES couriers(id)
    );
  `);
}

module.exports = {
  insert,
  select,
};
