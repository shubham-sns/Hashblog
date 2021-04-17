import {AuthCheck} from '@/components/auth-check'

function AdminPostsPage() {
  return (
    <AuthCheck>
      <h1>Edit Post</h1>
    </AuthCheck>
  )
}

export default AdminPostsPage
