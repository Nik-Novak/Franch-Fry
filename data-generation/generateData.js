//@ts-check
const fs = require('fs');
const moment = require('moment').utc;
const config = require('config');
const chance = require('chance')();
const bson = require('bson');

function twoDecimals(num) {
  return Math.floor(num * 100) / 100;
}

console.log(config.get('min_date'))
const minDate = moment(config.get('min_date'));
const maxDate = moment(config.get('max_date') || new Date());
const maxSubtotal = config.get('max_subtotal');
const taxRate = config.get('tax_rate');
const numFranchisees = config.get('num_franchisees');
const maxLocationsPerFranchisee = config.get('max_locations_per_franchisee');

function generateLocationsFile(filepath, generatedLocationIds){
  fs.writeFileSync(filepath, '[\n');
  for(let i=0; i<generatedLocationIds.length; i++){
    let randomAddress = chance.address();
    let row={
      _id: generatedLocationIds[i].location_id,
      address: randomAddress
    };
    fs.appendFileSync(filepath, JSON.stringify(row) + (i==generatedLocationIds.length-1 ? '':',\n') );
  };
  fs.appendFileSync(filepath, '\n]');
}

function generateFranchiseesFile(filepath, num){
  let accumulatedLocationIds = [];
  let accumulatedFranchiseeIds = [];
  fs.writeFileSync(filepath, '[\n');
  for(let i=0; i<num; i++){
    let randomFranchiseeId = new bson.ObjectID();
    accumulatedFranchiseeIds.push(randomFranchiseeId);
    let randomFirstName = chance.first();
    let randomLastName = chance.last();
    let numOwnedLocations = 1 + Math.floor(Math.random() * maxLocationsPerFranchisee);
    let randomLocationIds = [];
    for(let i=0; i<numOwnedLocations; i++)
      randomLocationIds.push(new bson.ObjectID());
    accumulatedLocationIds.push(...randomLocationIds.map(locId=>({location_id:locId, franchisee_id:randomFranchiseeId})));
    let row={
      _id: randomFranchiseeId,
      first_name: randomFirstName,
      last_name: randomLastName,
      location_ids: randomLocationIds
    };
    fs.appendFileSync(filepath, JSON.stringify(row)+ (i==num-1 ? '':',\n') );
  }
  fs.appendFileSync(filepath, '\n]');
  return {accumulatedFranchiseeIds, accumulatedLocationIds };
}

function getDatesArray(start, end){
  let dates = [];
  let date = moment(start);
  while(date.isSameOrBefore(moment(end),'days')){
    dates.push(date.toDate());
    date.add(1, 'days');
  }
  return dates;
}

function generateSalesFile(filepath, accumulatedFranchiseeIds, accumulatedLocationIds){
  let datesArray = getDatesArray(minDate, maxDate);
  fs.writeFileSync(filepath, '[\n');
  accumulatedLocationIds.forEach((locationId,i)=>{
    // let randomFranchiseeIndex = Math.floor(Math.random() * accumulatedFranchiseeIds.length);
    // let randomFranchiseeId = accumulatedFranchiseeIds[randomFranchiseeIndex];
    datesArray.forEach((date, j)=>{
      let randomSaleId = new bson.ObjectID();     
      let randomLocationIndex = Math.floor(Math.random() * accumulatedLocationIds.length);
      // let randomLocationId = accumulatedLocationIds[randomLocationIndex];
      let randomSubtotal = twoDecimals( Math.random() * maxSubtotal );
      let tax = twoDecimals(randomSubtotal * taxRate);
      let total = twoDecimals(randomSubtotal + tax);
      let formattedDate = moment(date).format('MMMM DD, YYYY')
      let row = {
        _id: randomSaleId,
        franchisee_id: locationId.franchisee_id,
        location_id: locationId.location_id,
        date: formattedDate,
        subtotal: randomSubtotal,
        tax,
        total
      }
      let currentCount = (i+1)*(j+1);
      let maxCount = datesArray.length*accumulatedLocationIds.length;
      fs.appendFileSync(filepath, JSON.stringify(row)+ (currentCount==maxCount ? '':',\n') );
    });
  });
  fs.appendFileSync(filepath, '\n]');
}

let {accumulatedLocationIds, accumulatedFranchiseeIds} = generateFranchiseesFile('./data/franchisees.json', numFranchisees);
generateLocationsFile('./data/locations.json', accumulatedLocationIds);
generateSalesFile('./data/sales.json', accumulatedFranchiseeIds, accumulatedLocationIds)