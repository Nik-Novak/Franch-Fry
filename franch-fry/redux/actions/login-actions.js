
export function login(firstName, lastName, position, token){
  return {
    type: 'LOGIN',
    payload: {
      firstName, lastName, position, token
    }
  }
}

export function logout(){
  return {
    type: 'LOGOUT',
    payload: {}
  }
}
