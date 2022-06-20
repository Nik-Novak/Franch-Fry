//@ts-check
import moment from 'moment';

const DEFAULTS = {
  date: moment(new Date()).format('MMMM DD, YYYY'),
  franchisees: [],
  locations:[]
}
export default function reducer(state={...DEFAULTS}, action) {
  switch(action.type) {
    case 'UPDATE_FILTER_DATE':
      let { date } = action.payload;
      return {
        ...state,
        date
      }
    case 'UPDATE_FILTER_FRANCHISEES':
      let { franchisees } = action.payload;
      return {
        ...state,
        franchisees
      }
    case 'UPDATE_FILTER_LOCATIONS':
      let { locations } = action.payload;
      return {
        ...state,
        locations
      }
    case 'CLEAR_FILTER':
      return { ...DEFAULTS }
    default:
      return state;
  }
}