import React, {useState} from 'react';
import {signUp} from '../utils/auth';
import {Appbar, Text, TextInput, HelperText} from 'react-native-paper';
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
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [passwordIcon, setPasswordIcon] = useState('eye-off');
  const [confirmPasswordIcon, setConfirmPasswordIcon] = useState('eye-off');

  const handleOnSubmit = () => {
    signUp(props, email, password, username, displayName);
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
          label="Username"
          placeholder="Username"
          value={username}
          activeOutlineColor={theme.colors.primary}
          autoCapitalize="none"
          onChangeText={username => setUsername(username)}
        />
        <TextInput
          mode="outlined"
          label="Display Name"
          placeholder="Display Name"
          value={displayName}
          activeOutlineColor={theme.colors.primary}
          autoCapitalize="none"
          onChangeText={displayName => setDisplayName(displayName)}
        />
        <TextInput
          mode="outlined"
          label="Email"
          placeholder="Email"
          value={email}
          activeOutlineColor={theme.colors.primary}
          autoCapitalize="none"
          error={email != '' && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)}
          onChangeText={email => setEmail(email)}
        />
        {email != '' && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ? (
          <HelperText type="error" visible={true}>
            Invalid email address format.
          </HelperText>
        ) : null}
        <TextInput
          mode="outlined"
          label="Password"
          placeholder="Password"
          value={password}
          activeOutlineColor={theme.colors.primary}
          autoCapitalize="none"
          error={password != '' && password.length < 6}
          secureTextEntry={showPassword}
          right={
            <TextInput.Icon
              icon={passwordIcon}
              onPress={handlePasswordVisibility}
            />
          }
          onChangeText={password => setPassword(password)}
        />
        {password != '' && password.length < 6 ? (
          <HelperText type="error" visible={true}>
            Password must be at least 6 characters.
          </HelperText>
        ) : null}
        <TextInput
          mode="outlined"
          label="Confirm Password"
          placeholder="Confirm Password"
          value={confirmPassword}
          activeOutlineColor={theme.colors.primary}
          autoCapitalize="none"
          error={confirmPassword != '' && password != confirmPassword}
          secureTextEntry={showConfirmPassword}
          right={
            <TextInput.Icon
              icon={confirmPasswordIcon}
              onPress={handleConfirmPasswordVisibility}
            />
          }
          onChangeText={confirmPassword => setConfirmPassword(confirmPassword)}
        />
        {confirmPassword != '' && password != confirmPassword ? (
          <HelperText type="error" visible={true}>
            Password does not match.
          </HelperText>
        ) : null}
        <DuoButton
          filled={true}
          disabled={
            username != '' &&
            displayName != '' &&
            email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
            password.length >= 6 &&
            password == confirmPassword
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