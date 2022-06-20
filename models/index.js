//@ts-check
const { Franchisee } = require('./Franchisee');
const { Location } = require('./Location');
const { Sale } = require('./Sale');
const mongoose = require('mongoose');

module.exports = { Franchisee, Location, Sale, mongoose };