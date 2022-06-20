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
  if(params.location_ids && !Array.isArray(params.location_ids))
    errorMsg += 'location_ids array parameter must be an array. Empty array for all.\n';

  if(!errorMsg)
    return true;
  res.status(400).send(errorMsg);
  return false;
}

export default async function handler(req, res) {
  let method = req.method;
  const { token, location_ids } = req.body;
  if(!validMethod(method, res))
    return;
  if(!validAuth(token, res))
    return;
  if(!validParams(req.body, res))
    return;
  
  console.log(req.body);
  let query= {};
  if(location_ids?.length > 0)
    query = {...query, location_ids:{$in:location_ids}};
  let franchises = await database.readFranchisees(query);
  res.status(200).json(franchises);

}

// {
//     "token": "123abc",
//     "location_ids":["62b04703a4163ca061f4bd10", "62b04703a4163ca061f4bd11"],
//     "franchisee_ids":["62b04703a4163ca061f4bd0f"],
//     "date":"2022-04-09"
// }