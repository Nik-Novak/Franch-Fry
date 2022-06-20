//@ts-check
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { ExistingID } = require('./types/types');
const { Location } = require('./Location');
const FranchiseeSchema = new Schema(
  {
    first_name: { type: 'string', required:true },
    last_name: { type: 'string', required:true },
    location_ids: { type:[ ExistingID(Location) ], required:true }
  },
);

FranchiseeSchema.index({first_name:1, last_name:1}, {unique:true});

const Franchisee = mongoose.model('Franchisee', FranchiseeSchema);

module.exports = { Franchisee };