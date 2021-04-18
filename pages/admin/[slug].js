import {useState} from 'react'
import {useRouter} from 'next/router'
import {useDocumentDataOnce} from 'react-firebase-hooks/firestore'

import {AuthCheck} from '@/components/auth-check'
import {auth, firestore} from '@/lib/firebase'
import {ContainerLayout} from '@/layouts/container'

function AdminPostEdit() {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  )
}

function PostManager() {
  const router = useRouter()
  const {slug} = router.query

  const [preview, setPreview] = useState(false)

  const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts').doc(slug)
  const [post] = useDocumentDataOnce()

  return <ContainerLayout>hello</ContainerLayout>
}

export default AdminPostEdit
