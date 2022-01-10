import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyC6w8hFxTnx1mMZIQ5_-CaFsyC8ZgvjugY',
	authDomain: 'vue-interactive-comments.firebaseapp.com',
	projectId: 'vue-interactive-comments',
	storageBucket: 'vue-interactive-comments.appspot.com',
	messagingSenderId: '146335645912',
	appId: '1:146335645912:web:5a0d837e93a12006bc97ad',
	measurementId: 'G-FES5YF6V34',
};

initializeApp(firebaseConfig);

const db = getFirestore();

export { db };
