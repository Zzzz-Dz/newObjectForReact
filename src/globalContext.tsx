import React from 'react'
import { createContext } from 'react'
import { useReducer } from 'react'

export interface UserAction {
  type: string
}

export interface UserState {
  isLogined: boolean
}

export interface UserContextType {
  state: UserState
  dispatch: React.Dispatch<UserAction>
}

const initialState: UserState = { isLogined: false }

function reducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'islogined':
      return { ...state, isLogined: true }
    case 'logout':
      return { ...state, isLogined: false }
    default:
      throw new Error('unknown action')
  }
}

// 创建上下文，默认值为 undefined，因为我们将始终提供 Provider
export const UserContext = createContext<UserContextType | undefined>(undefined)

export default function GlobalUserState({
  children
}: {
  children: React.ReactNode
}): React.ReactNode {
  const [state, dispatch] = useReducer(reducer, initialState)

  const contextValue: UserContextType = { state, dispatch }

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  )
}
