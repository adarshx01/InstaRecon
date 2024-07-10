import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCtX9TEcvukKSdeHcsA0lWGQqa16EcyB60",
  authDomain: "insta-users-49b6a.firebaseapp.com",
  databaseURL: "https://insta-users-49b6a-default-rtdb.firebaseio.com",
  projectId: "insta-users-49b6a",
  storageBucket: "insta-users-49b6a.appspot.com",
  messagingSenderId: "875967815057",
  appId: "1:875967815057:web:24cebcf0da67553fcc0e30",
  measurementId: "G-1Y54E2E77X"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const firestore = getFirestore(app)
const storage = getStorage(app)

export { auth, firestore, storage }
