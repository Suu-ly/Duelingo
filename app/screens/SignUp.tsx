import React, {useState} from 'react';
import {signUp} from '../utils/auth';
import {Appbar, Text, TextInput, HelperText} from 'react-native-paper';
import {
  View,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
} from 'react-native';

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
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordConfirmError, setPasswordConfirmError] = useState(false);

  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

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

  const validateEmail = () => {
    animate();
    setEmailError(email !== '' && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/));
  };

  const validatePassword = () => {
    animate();
    setPasswordError(password !== '' && password.length < 6);
  };

  const validateConfirmPassword = () => {
    animate();
    setPasswordConfirmError(
      confirmPassword !== '' && password !== confirmPassword,
    );
  };

  const animate = () => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {type: 'easeOut', property: 'opacity'},
      update: {type: 'spring', springDamping: 100},
      delete: {type: 'easeOut', property: 'opacity'},
    });
  };

  return (
    <View style={styles.mainContainer}>
      <Appbar.Header mode="small">
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
      </Appbar.Header>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <Text variant="headlineMedium" style={styles.title}>
          Create your profile
        </Text>
        <View style={styles.container}>
          <TextInput
            style={{backgroundColor: theme.colors.surface}}
            mode="outlined"
            label="Username"
            placeholder="Username"
            value={username}
            activeOutlineColor={theme.colors.primary}
            autoCapitalize="none"
            onChangeText={username => setUsername(username)}
          />
          <TextInput
            style={{backgroundColor: theme.colors.surface}}
            mode="outlined"
            label="Display Name"
            placeholder="Display Name"
            value={displayName}
            activeOutlineColor={theme.colors.primary}
            autoCapitalize="none"
            onChangeText={displayName => setDisplayName(displayName)}
          />
          <View>
            <TextInput
              style={{backgroundColor: theme.colors.surface}}
              mode="outlined"
              label="Email"
              placeholder="Email"
              value={email}
              activeOutlineColor={theme.colors.primary}
              autoCapitalize="none"
              error={emailError}
              onFocus={() => {
                animate();
                setEmailError(false);
              }}
              onBlur={validateEmail}
              onChangeText={email => setEmail(email)}
            />
            {emailError && (
              <HelperText type="error" visible={true}>
                Invalid email address format.
              </HelperText>
            )}
          </View>
          <View>
            <TextInput
              style={{backgroundColor: theme.colors.surface}}
              mode="outlined"
              label="Password"
              placeholder="Password"
              value={password}
              activeOutlineColor={theme.colors.primary}
              autoCapitalize="none"
              error={passwordError}
              onFocus={() => {
                animate();
                setPasswordError(false);
              }}
              onBlur={validatePassword}
              secureTextEntry={showPassword}
              right={
                <TextInput.Icon
                  icon={passwordIcon}
                  onPress={handlePasswordVisibility}
                />
              }
              onChangeText={password => setPassword(password)}
            />
            {passwordError && (
              <HelperText type="error" visible={true}>
                Password must be at least 6 characters.
              </HelperText>
            )}
          </View>
          <View>
            <TextInput
              style={{backgroundColor: theme.colors.surface}}
              mode="outlined"
              label="Confirm Password"
              placeholder="Confirm Password"
              value={confirmPassword}
              activeOutlineColor={theme.colors.primary}
              autoCapitalize="none"
              error={passwordConfirmError}
              onFocus={() => {
                animate();
                setPasswordConfirmError(false);
              }}
              onBlur={validateConfirmPassword}
              secureTextEntry={showConfirmPassword}
              right={
                <TextInput.Icon
                  icon={confirmPasswordIcon}
                  onPress={handleConfirmPasswordVisibility}
                />
              }
              onChangeText={confirmPassword =>
                setConfirmPassword(confirmPassword)
              }
            />
            {passwordConfirmError && (
              <HelperText type="error" visible={true}>
                Password does not match.
              </HelperText>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <DuoButton
              filled={true}
              disabled={
                username !== '' &&
                displayName !== '' &&
                email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
                password.length >= 6 &&
                password === confirmPassword
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
      </ScrollView>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  container: {
    flex: 1,
    gap: Constants.edgePadding,
    paddingHorizontal: Constants.edgePadding,
  },
  title: {
    paddingTop: 32,
    paddingBottom: 28,
    paddingHorizontal: Constants.edgePadding,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: Constants.edgePadding * 2,
  },
  scroll: {
    flex: 1,
  },
});
