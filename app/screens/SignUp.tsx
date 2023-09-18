import React, {useState} from 'react';
import {Alert} from 'react-native';
import {signUp} from '../utils/auth';
import {TextInput, Button} from 'react-native-paper';

interface SignUpProps {
  route: any;
  navigation: any;
}

const SignUp = (props: SignUpProps) => {
  const {route, navigation} = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleOnSubmit = () => {
    if (email != '' && password != '' && confirmPassword != '') {
      if (password == confirmPassword) {
        //   SignUp
        signUp(email, password);
        navigation.navigate('SignIn');
      } else {
        Alert.alert('password did not match');
      }
    }
  };

  return (
    <>
      <TextInput
        label="Email"
        value={email}
        onChangeText={email => setEmail(email)}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={password => setPassword(password)}
      />

      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={confirmPassword => setConfirmPassword(confirmPassword)}
      />

      <Button mode="contained" onPress={handleOnSubmit}>
        Sign Up
      </Button>
    </>
  );
};

export default SignUp;
