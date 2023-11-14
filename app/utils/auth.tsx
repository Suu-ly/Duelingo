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

export const signUp = (
  email: any,
  password: any,
  username: any,
  displayName: any,
) => {
  firestore()
    .collection('Users')
    .where('username', '==', username)
    .get()
    .then(doc => {
      if (!doc.empty) {
        console.log('Username taken.');
        Alert.alert('The username is already taken.');
      } else {
        auth()
          .createUserWithEmailAndPassword(email, password)
          .then(() => {
            signIn(email, password);
            auth().onAuthStateChanged(user => {
              if (user) {
                const uid = user.uid;
                createUser(email, username, displayName, uid);
              }
            });
          })
          .catch(err => {
            console.log(err);
            Alert.alert(error[err.code as keyof typeof error]);
          });
      }
    });
};

export const signOut = () => {
  auth().signOut();
};

export const deleteAccount = async () => {
  try {
    const user = firebase.auth().currentUser;

    if (user) {
      await user.delete();
      console.log('User deleted successfully');
    } else {
      console.log('No user is currently signed in.');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};
