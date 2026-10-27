import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCoiY_UApwoZ3s0AgBzfPXdHgAph5EmwWc",
  authDomain: "saarthi-ai-b407d.firebaseapp.com",
  projectId: "saarthi-ai-b407d",
  storageBucket: "saarthi-ai-b407d.firebasestorage.app",
  messagingSenderId: "1024372189306",
  appId: "1:1024372189306:web:3c49d23467835f731433c3",
  measurementId: "G-TWP2QHZ9CD",
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export { app, auth }
