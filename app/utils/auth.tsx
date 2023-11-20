import auth from '@react-native-firebase/auth';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {Alert} from 'react-native';
import {createUser} from './database';
import error from './error.json';

export const signIn = (email: any, password: any) => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .catch(err => {
      console.log(err);
      Alert.alert(error[err.code as keyof typeof error]);
    });
};

export const signUp = async (
  email: any,
  password: any,
  username: any,
  displayName: any,
) => {
  let userCredential = await auth().createUserWithEmailAndPassword(
    email,
    password,
  );
  await createUser(email, username, displayName, userCredential.user.uid);
  signIn(email, password);
};

export const signOut = () => {
  auth().signOut();
};

// export const deleteAccount = async () => {
//   try {
//     const user = firebase.auth().currentUser;

//     if (user) {
//       await user.delete();
//       console.log('User deleted successfully');
//     } else {
//       console.log('No user is currently signed in.');
//     }
//   } catch (error) {
//     console.error('Error deleting user:', error);
//   }
// };
