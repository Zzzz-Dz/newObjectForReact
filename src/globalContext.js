import { createContext } from "react"
import { useReducer } from 'react';

function reducer(state,action){
  switch(action.type){
    case 'islogined':
      return {...state, isLogined:true}
    case 'logout':
      return {...state, isLogined:false}
    default :
      throw new Error('unknown action')
  }
}

const initialState = {isLogined: false}
export const UserContext = createContext(null);
export const UserDispatchContext = createContext(null);
export default function GlobalUserState({children}){
    const [isLogin, dispatch] = useReducer(reducer, initialState)
    return (
        <UserContext.Provider value={isLogin}>
            <UserDispatchContext.Provider value={dispatch}>
                {children}
            </UserDispatchContext.Provider>
        </UserContext.Provider>
    )
}