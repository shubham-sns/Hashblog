import * as React from 'react'

import {useUserData} from 'hooks/use-user-data'

const userContext = React.createContext()

function UserProvider(props) {
  const {user, username} = useUserData()

  const value = React.useMemo(() => ({user, username}), [user, username])

  return <userContext.Provider value={value} {...props} />
}

function useUserContext() {
  const context = React.useContext(userContext)

  if (context === undefined) {
    throw new Error(`useUserContext must be used within UserProvider`)
  }

  return context
}

export {UserProvider, useUserContext}
