//@ts-check
import moment from "moment";

export function updateDate(date) {
  if(!moment.isDate(new Date(date))) throw 'UPDATE_FILTER must have a valid date';
  return {
    type: 'UPDATE_FILTER_DATE',
    payload: {
      date:moment(date).format('MMMM DD, YYYY')
    }
  }
}

export function updateFranchisees(franchisees) {
  if(!Array.isArray(franchisees)) throw 'UPDATE_FILTER must have a valid array of franchisees';
  return {
    type: 'UPDATE_FILTER_FRANCHISEES',
    payload: {
      franchisees
    }
  }
}

export function updateLocations(locations) {
  if(!Array.isArray(locations)) throw 'UPDATE_FILTER must have a valid array of locations';
  return {
    type: 'UPDATE_FILTER_LOCATIONS',
    payload: {
      locations
    }
  }
}

// export function updateFilter(date, franchisees, locations) {
//   if(!moment.isDate(new Date(date))) throw 'UPDATE_FILTER must have a valid date';
//   if(!Array.isArray(franchisees)) throw 'UPDATE_FILTER must have a valid array of franchisees';
//   if(!Array.isArray(locations)) throw 'UPDATE_FILTER must have a valid array of locations';
//   return {
//     type: 'UPDATE_FILTER',
//     payload: {
//       date:moment(date).format('MMMM DD, YYYY'), franchisees, locations
//     }
//   }
// }