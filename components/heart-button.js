import {Button} from '@chakra-ui/button'
import {useDocument} from 'react-firebase-hooks/firestore'

import {auth, firestore, increment} from '@/lib/firebase'

function HeartButton({postRef}) {
  // listen to heart document for currently loggedin user
  const heartRef = postRef.collection('hearts').doc(auth.currentUser.uid)
  const [heartDoc] = useDocument(heartRef)

  const addHeart = async () => {
    const {uid} = auth.currentUser

    const batch = firestore.batch()
    batch.update(postRef, {heartCount: increment(1)})
    batch.set(heartRef, {uid})

    await batch.commit()
  }

  const removeHeart = async () => {
    const batch = firestore.batch()

    batch.update(postRef, {heartCount: increment(-1)})
    batch.delete(heartRef)

    await batch.commit()
  }

  if (heartDoc?.exists) {
    return <Button onClick={removeHeart}>💔 Unheart</Button>
  }

  return <Button onClick={addHeart}>💗 Heart</Button>
}

export {HeartButton}
