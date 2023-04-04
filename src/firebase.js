import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc  } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyDstvU3kba5ltyZ-z1ui6eTqSWrK8PJ6a0",
    authDomain: "becs-6b7ff.firebaseapp.com",
    projectId: "becs-6b7ff",
    storageBucket: "becs-6b7ff.appspot.com",
    messagingSenderId: "81507602812",
    appId: "1:81507602812:web:bfdee7c4d176b89b9cd4f9",
    measurementId: "G-GJX87528ZY"
  };

// Initialize Firebase

const app = initializeApp(firebaseConfig);
// Export firestore database
// It will be imported into your react app whenever it is needed
export const db = getFirestore(app);


// Add a user with access to the "Users_with_access" collection
const addAccessUser = async (userName, password) => {
  try {
    const docRef = await addDoc(collection(db, "Users_with_access"), {
      UserName: userName,
      Password: password,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// Call the function to add a user with access
//addAccessUser("Boss11", "secretsecret11");

const addMetaData = async () => {
  try {
    const docRef = await addDoc(collection(db, "Meta_Data"), {
      A_plus : 0,
      O_plus : 0,
      B_plus : 0,
      AB_plus : 0,
      O_minus : 0,
      A_minus : 0,
      B_minus : 0,
      AB_minus : 0
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// Call the function to add a user with access
//addAccessUser("Boss11", "secretsecret11");

//addMetaData();