import {AuthCheck} from '@/components/auth-check'
import {Metatags} from '@/components/mega-tags'
import {auth, firestore} from '@/lib/firebase'
import {ContainerLayout} from 'layouts/container'
import {useRouter} from 'next/router'
import {useState} from 'react'
import {useDocumentDataOnce} from 'react-firebase-hooks/firestore'

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
