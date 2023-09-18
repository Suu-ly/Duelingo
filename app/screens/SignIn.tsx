import React, {useState} from 'react';
import {signIn} from '../utils/auth';
import {TextInput, Button} from 'react-native-paper';

interface SignInProps {
  route: any;
  navigation: any;
}

const SignIn = (props: SignInProps) => {
  const {route, navigation} = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleOnSubmit = () => {
    if (email != '' && password != '') {
      signIn(email, password);
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

      <Button mode="contained" onPress={handleOnSubmit}>
        Sign In
      </Button>

      <Button mode="contained" onPress={() => navigation.navigate('SignUp')}>
        Create Account
      </Button>
    </>
  );
};

export default SignIn;
