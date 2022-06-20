//@ts-check
const fs = require('fs');
const moment = require('moment');
const config = require('config');

function twoDecimals(num) {
  return Math.floor(num * 100) / 100;
}

console.log(config.get('min_date'))
const minDate = moment(config.get('min_date'));
const maxDate = moment(config.get('max_date') || new Date());
const maxSubtotal = config.get('max_subtotal');
const taxRate = config.get('tax_rate');
const numFranchisees = config.get('num_franchisees');
const numLocations = config.get('num_locations');
const numRecords = config.get('num_records');

fs.writeFileSync('./data.json', '[\n');
for(let i=0; i<numRecords; i++){
  let dateDiffMs = maxDate.valueOf() - minDate.valueOf();
  let randomTimestamp = minDate.valueOf() + Math.random()*dateDiffMs;
  let randomDate = moment(randomTimestamp);
  let randomFranchiseeId = Math.floor( Math.random() * numFranchisees );
  let randomLocationId = Math.floor( Math.random() * numLocations );
  let randomSubtotal = twoDecimals( Math.random() * maxSubtotal );
  let tax = twoDecimals(randomSubtotal * taxRate);
  let total = twoDecimals(randomSubtotal + tax);
  let row={
    locationId:randomLocationId, 
    date:randomDate.format('MMMM DD, YYYY'), 
    total, 
    tax, 
    subtotal:randomSubtotal,
    franchiseeId:randomFranchiseeId 
  };
  fs.appendFileSync('./data.json', JSON.stringify(row)+ (i==numRecords-1 ? '':',\n') );
}
fs.appendFileSync('./data.json', '\n]');