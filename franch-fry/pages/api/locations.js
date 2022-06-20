//@ts-check
import { isDate } from "moment";
import config from 'config';
import Database from '../../../database';

let database = new Database(config.get('db'));

function validMethod(method, res){
  if(method==='POST')
    return true;
  res.status(400).send('Must use POST with JSON body parameters');
  return false;
}

function validAuth(token, res){
  if(token=='123abc')
    return true;
  res.status(401).send('Invalid authentication, try logging in again.');
  return false;
}

function validParams(params, res){
  let errorMsg = '';
  if(params.franchisee_ids && !Array.isArray(params.franchisee_ids))
    errorMsg += 'franchisee_ids array parameter must be an array. Empty array for all.\n';

  if(!errorMsg)
    return true;
  res.status(400).send(errorMsg);
  return false;
}

export default async function handler(req, res) {
  let method = req.method;
  const { token, franchisee_ids } = req.body;
  if(!validMethod(method, res))
    return;
  if(!validAuth(token, res))
    return;
  if(!validParams(req.body, res))
    return;
  console.log(req.body);
  let locations = [];
  if(franchisee_ids?.length > 0)
    locations = await database.getLocationsByFranchisees(franchisee_ids);
  else
    locations = await database.readLocations();
  res.status(200).json(locations);
}

// {
//     "token": "123abc",
//     "locationIds":["62b04703a4163ca061f4bd10", "62b04703a4163ca061f4bd11"],
//     "franchiseeIds":["62b04703a4163ca061f4bd0f"],
//     "date":"2022-04-09"
// }