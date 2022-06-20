//@ts-check
const fs = require('fs');
const path = require('path');
const { mongoose, Franchisee, Location, Sale } = require('../models');


class Database {
  #data; #path; //#options;
  constructor(path, options={}){
    this.#path=path; //this.#options=options;
    this.#data = {};
    mongoose.connect(path);
    mongoose.connection
      .once('open', function(){
        console.log('Connected to DB');
      })
      .on('error',function(err){
        console.log('Failed to connect to DB: ');
        console.error(err);
      });
  }

  disconnect(){
    return mongoose.disconnect();
  }

  async getLocationsByFranchisees(franchiseeIds){
    console.log('HERE', franchiseeIds);
    let franchisees = await Franchisee.find({_id:{$in:franchiseeIds}});
    let locationIds = [];
    franchisees.forEach(fr=>locationIds.push(...fr.location_ids));
    return await Location.find({_id:{$in:locationIds}});
  }

  async readLocations(query={}){
    let data = await Location.find(query);
    return data;
  }
  async writeLocations(locations){
    let promisedWrites = locations.map(
      location=>{
        let model = new Location(location);
        return model.save();
      }
    );
    await Promise.all(promisedWrites);
  }
  async deleteLocations(query={}){
    await Location.deleteMany(query);
  }

  async readFranchisees(query={}){
    let data = await Franchisee.find(query);
    return data;
  }
  async writeFranchisees(franchisees){
    let promisedWrites = franchisees.map(
      franchisee=>{
        let model = new Franchisee(franchisee);
        return model.save();
      }
    );
    await Promise.all(promisedWrites);
  }
  async deleteFranchisees(query={}){
    await Franchisee.deleteMany(query);
  }

  async readSales(query={}){
    let data = await Sale.find(query);
    return data;
  }
  async writeSales(sales){
    let promisedWrites = sales.map(
      sale=>{
        let model = new Sale(sale);
        return model.save();
      }
    );
    await Promise.all(promisedWrites);
  }
  async deleteSales(query={}){
    await Sale.deleteMany(query);
  }

}

module.exports = Database;