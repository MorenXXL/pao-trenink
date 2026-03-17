import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDQFPrWU7-L7bDeyHp5sj4hGhHOxxZ2GUE",
  authDomain: "moren-lab.firebaseapp.com",
  projectId: "moren-lab",
  storageBucket: "moren-lab.firebasestorage.app",
  messagingSenderId: "290216584908",
  appId: "1:290216584908:web:b111fdcbca96d817af0469"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
