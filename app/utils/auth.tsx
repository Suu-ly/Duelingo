import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Alert, ToastAndroid} from 'react-native';
import {createUser} from './database';
import error from './error.json';

interface AuthProps {
  route: any;
  navigation: any;
}

export const signIn = (props: AuthProps, email: any, password: any) => {
  const {route, navigation} = props;

  auth()
    .signInWithEmailAndPassword(email, password)
    .catch(err => {
      console.log(err);
      Alert.alert(error[err.code as keyof typeof error]);
    });
};

export const signUp = (
  props: AuthProps,
  email: any,
  password: any,
  username: any,
  displayName: any,
) => {
  const {route, navigation} = props;

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
            signIn(props, email, password);
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
