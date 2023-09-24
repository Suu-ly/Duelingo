import auth from '@react-native-firebase/auth';
import {Alert, ToastAndroid} from 'react-native';

  


interface AuthProps {
  route: any;
  navigation: any;
}

export const signIn = (props: AuthProps, email: any, password: any) => {
  const {route, navigation} = props;

  auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    })
    .catch(err => {
      console.log(err);
      Alert.alert('Incorrect Email or Password');
    });
};

export const signUp = (props: AuthProps, email: any, password: any) => {
  const {route, navigation} = props;

  auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      navigation.navigate('SignIn');
    })
    .catch(err => {
      console.log(err);
    });
};

export const signOut = () => {
  auth()
    .signOut()
    .then(() => {
      ToastAndroid.show('Signed Out', ToastAndroid.SHORT);
    });
};
