import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBNG92gONR3EMmLLtajtWPkXk1oE04sF2s',
  authDomain: 'next-7b4bb.firebaseapp.com',
  projectId: 'next-7b4bb',
  storageBucket: 'next-7b4bb.appspot.com',
  messagingSenderId: '845180352317',
  appId: '1:845180352317:web:7ca67d9af1b04251cf7754',
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

const auth = firebase.auth()
const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

const firestore = firebase.firestore()
const storage = firebase.storage()

export {auth, googleAuthProvider, firestore, storage}

/// Helper functions

/**
 * Gets a users/{uid} document with username
 * @param {string} username
 */
async function getUserWithUsername(username) {
  const userRef = firestore.collection('users')
  const query = userRef.where('username', '==', username).limit(1)
  const [userDoc] = (await query.get()).docs

  return userDoc
}

/**
 * Converts a firestore doc to JSON
 * @param {DocumentSnapshot} doc
 */
function postToJSON(doc) {
  const data = doc.data()

  return {
    ...data,
    //  firestore timestamp is not serializable
    cratedAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  }
}

export {getUserWithUsername}
