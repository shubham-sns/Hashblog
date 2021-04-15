import {useEffect, useState} from 'react'
import {useAuthState} from 'react-firebase-hooks/auth'

import {auth, firestore} from '@/lib/firebase'

function useUserData() {
  const [user] = useAuthState(auth)

  const [username, setUsername] = useState()

  useEffect(() => {
    let unsubscribe

    if (user) {
      const ref = firestore.collection('users').doc(user.uid)
      unsubscribe = ref.onSnapshot(doc => {
        setUsername(doc.data()?.username)
      })
    } else {
      setUsername(null)
    }

    // turn off realtime subscription
    return unsubscribe
  }, [user])

  return {username, user}
}

export {useUserData}
