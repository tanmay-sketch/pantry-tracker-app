import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCk-vLGIsy7nIhBSgnsGKbnwp--mzDzUIM",
    authDomain: "inventory-app-f3e7b.firebaseapp.com",
    projectId: "inventory-app-f3e7b",
    storageBucket: "inventory-app-f3e7b.appspot.com",
    messagingSenderId: "976795242287",
    appId: "1:976795242287:web:b9e9718b68039da7d61bda"
};
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };