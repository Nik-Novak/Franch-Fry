//@ts-check
const DEFAULTS = {
  firstName: 'firstName',
  lastName: 'lastName',
  position: 'position',
  token: null
}

export default function reducer(
    state={...DEFAULTS},
    action
  ){

    switch(action.type){
      case 'LOGIN':
        let {firstName, lastName, position, token} = action.payload;
        return {
          firstName,
          lastName,
          position,
          token
        }
      case 'LOGOUT':
        return { ...DEFAULTS };
      default:
        return state;
    }

  }