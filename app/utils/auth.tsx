import auth from '@react-native-firebase/auth';
import {Alert, ToastAndroid} from 'react-native';
import error from '../utils/error.json';

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
      Alert.alert(error[err.code as keyof typeof error]);
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
      Alert.alert(error[err.code as keyof typeof error]);
    });
};

export const signOut = () => {
  auth()
    .signOut()
    .then(() => {
      ToastAndroid.show('Signed Out', ToastAndroid.SHORT);
    });
};
