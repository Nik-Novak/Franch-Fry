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
  if(!Array.isArray(params.location_ids))
    errorMsg += 'Requires location_ids array parameter. Empty array for all.\n';
  if(!Array.isArray(params.franchisee_ids))
    errorMsg += 'Requires franchisee_ids array parameter. Empty array for all.\n';
  if(!isDate(new Date(params.date)))
    errorMsg += 'Requires date parameter. Must be interpretable by js Date constructor as valid date.\n';
  
  if(!errorMsg)
    return true;
  res.status(400).send(errorMsg);
  return false;
}

function calculateMetrics(sales){
  let total_sales=0,total_franchise_fees=0;
  // sales.forEach(sale=>{
  //   let franchise_fee_rate = config['franchise_fee_rate'];
  //   total_sales+=sale.total;
  //   let franchise_fee = sale.subtotal * franchise_fee_rate;
  //   total_franchise_fees+=franchise_fee;
  // });
  console.log('here',sales);
  let reduction = sales.reduce((reducer,sale)=>{
    console.log(reducer);
    let franchise_fee_rate = config['franchise_fee_rate'];
    reducer.total_sales+=sale.total;
    let franchise_fee = sale.subtotal * franchise_fee_rate;
    reducer.total_franchise_fees+=franchise_fee;
    return reducer;
  },{total_sales:0, total_franchise_fees:0});
  return reduction;
}

export default async function handler(req, res) {
  let method = req.method;
  const { token, franchisee_ids, location_ids, date } = req.body;
  if(!validMethod(method, res))
    return;
  if(!validAuth(token, res))
    return;
  if(!validParams(req.body, res))
    return;
  
  console.log(req.body);
  let query= {};
  if(date)
    query={...query, date};
  if(franchisee_ids.length > 0)
    query = {...query, franchisee_id:{$in:franchisee_ids}};
  if(location_ids.length > 0)
    query = {...query, location_id:{$in:location_ids}};
  let sales = await database.readSales(query);
  let calculatedMetrics = calculateMetrics(sales);
  res.status(200).json(calculatedMetrics);

}

// {
//     "token": "123abc",
//     "location_ids":["62b04703a4163ca061f4bd10", "62b04703a4163ca061f4bd11"],
//     "franchisee_ids":["62b04703a4163ca061f4bd0f"],
//     "date":"2022-04-09"
// }