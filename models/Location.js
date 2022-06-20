//@ts-check
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { ExistingID } = require('./types/types');


const LocationSchema = new Schema(
  {
    address: { type:'string', required:true }
  },
);

LocationSchema.index({address:1}, {unique:true});

const Location = mongoose.model('Location', LocationSchema);

module.exports = { Location };