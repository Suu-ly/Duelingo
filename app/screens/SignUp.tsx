import React, {useState} from 'react';
import {signUp} from '../utils/auth';
import {
  Button,
  Dialog,
  Portal,
  Appbar,
  Text,
  TextInput,
} from 'react-native-paper';
import {View, StyleSheet} from 'react-native';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import theme from '../common/constants/theme.json';

interface SignUpProps {
  route: any;
  navigation: any;
}

const SignUp = (props: SignUpProps) => {
  const {route, navigation} = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [passwordIcon, setPasswordIcon] = useState('eye-off');
  const [confirmPasswordIcon, setConfirmPasswordIcon] = useState('eye-off');
  const [visible, setVisible] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorContent, setErrorContent] = useState('');

  const handleOnSubmit = () => {
    if (email != '' && password != '' && confirmPassword != '') {
      if (password.length < 6) {
        setErrorTitle('Password is too weak');
        setErrorContent('Password must be at least 6 characters.');
        setVisible(true);
      } else if (password != confirmPassword) {
        setErrorTitle('Password did not match');
        setErrorContent('Please check your confirm password.');
        setVisible(true);
      } else {
        signUp(props, email, password);
      }
    }
  };

  const handlePasswordVisibility = () => {
    passwordIcon === 'eye'
      ? setPasswordIcon('eye-off')
      : setPasswordIcon('eye');
    setShowPassword(!showPassword);
  };

  const handleConfirmPasswordVisibility = () => {
    confirmPasswordIcon === 'eye'
      ? setConfirmPasswordIcon('eye-off')
      : setConfirmPasswordIcon('eye');
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar />
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={() => setVisible(false)}
          style={styles.appbar}>
          <Dialog.Title>{errorTitle}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{errorContent}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
      </Appbar.Header>
      <View style={styles.container}>
        <View style={styles.title}>
          <Text variant={'headlineLarge'}>Create your account</Text>
        </View>

        <TextInput
          mode="outlined"
          label="Email"
          placeholder="Email"
          value={email}
          activeOutlineColor={theme.colors.primary}
          autoCapitalize="none"
          onChangeText={email => setEmail(email)}
        />
        <TextInput
          mode="outlined"
          label="Password"
          placeholder="Password"
          value={password}
          activeOutlineColor={theme.colors.primary}
          autoCapitalize="none"
          secureTextEntry={showPassword}
          right={
            <TextInput.Icon
              icon={passwordIcon}
              onPress={handlePasswordVisibility}
            />
          }
          onChangeText={password => setPassword(password)}
        />
        <TextInput
          mode="outlined"
          label="Confirm Password"
          placeholder="Confirm Password"
          value={confirmPassword}
          activeOutlineColor={theme.colors.primary}
          autoCapitalize="none"
          secureTextEntry={showConfirmPassword}
          right={
            <TextInput.Icon
              icon={confirmPasswordIcon}
              onPress={handleConfirmPasswordVisibility}
            />
          }
          onChangeText={confirmPassword => setConfirmPassword(confirmPassword)}
        />
        <DuoButton
          filled={true}
          disabled={
            email != '' && password != '' && confirmPassword != ''
              ? false
              : true
          }
          stretch={true}
          backgroundColor={theme.colors.primary}
          backgroundDark={theme.colors.primaryDark}
          borderColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
          onPress={handleOnSubmit}>
          Create Account
        </DuoButton>
      </View>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    marginTop: Constants.mediumGap,
    gap: Constants.largeGap,
    paddingHorizontal: Constants.edgePadding,
  },
  appbar: {
    backgroundColor: 'white',
  },
  title: {
    marginBottom: 16,
  },
});
