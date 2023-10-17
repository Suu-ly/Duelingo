import React, {useState} from 'react';
import {signIn} from '../utils/auth';
import {Appbar, Text, TextInput, HelperText} from 'react-native-paper';
import {View, StyleSheet} from 'react-native';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import theme from '../common/constants/theme.json';

interface SignInProps {
  route: any;
  navigation: any;
}

theme.colors.background = 'white';

const SignIn = (props: SignInProps) => {
  const {route, navigation} = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [rightIcon, setRightIcon] = useState('eye-off');

  const handleOnSubmit = () => {
    signIn(props, email, password);
  };

  const handlePasswordVisibility = () => {
    rightIcon === 'eye' ? setRightIcon('eye-off') : setRightIcon('eye');
    setShowPassword(!showPassword);
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
          <Text variant={'headlineLarge'}>Log in</Text>
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
          secureTextEntry={showPassword}
          right={
            <TextInput.Icon
              icon={rightIcon}
              onPress={handlePasswordVisibility}
            />
          }
          onChangeText={password => setPassword(password)}
        />
        <DuoButton
          filled={true}
          disabled={
            email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) && password != ''
              ? false
              : true
          }
          stretch={true}
          backgroundColor={theme.colors.primary}
          backgroundDark={theme.colors.primaryDark}
          borderColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
          onPress={handleOnSubmit}>
          Log In
        </DuoButton>
      </View>
    </View>
  );
};

export default SignIn;

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
