//@ts-check
const Database = require('../database');
const config = require('config');

let database = new Database(config.get('db'));

let locations = require('./data/locations.json');
let franchisees = require('./data/franchisees.json');
let sales = require('./data/sales.json');

(async ()=>{
  await database.deleteSales();
  await database.deleteFranchisees();
  await database.deleteLocations();
  await database.writeLocations(locations);
  await database.writeFranchisees(franchisees);
  await database.writeSales(sales);
  database.disconnect();
})();
