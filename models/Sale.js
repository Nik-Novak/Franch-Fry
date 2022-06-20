//@ts-check
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const { ExistingID } = require('./types/types');
const { Location } = require('./Location');
const { Franchisee } = require('./Franchisee');



const SaleSchema = new Schema(
  {
    franchisee_id: {...ExistingID(Franchisee), required:true },
    location_id: {...ExistingID(Location), required:true },
    date: { type:String, required:true },
    subtotal: { type:Number, required:true },
    tax: { type:Number, required:true },
    total: { type:Number, required:true },
  },
);

SaleSchema.index({locationId:1, franchiseeId:1, date:1 });

const Sale = mongoose.model('Sale', SaleSchema);

module.exports = { Sale };