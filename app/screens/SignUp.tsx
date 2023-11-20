import React, {useEffect, useState} from 'react';
import {signUp} from '../utils/auth';
import {
  Appbar,
  Text,
  TextInput,
  HelperText,
  ActivityIndicator,
} from 'react-native-paper';
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
import {checkUsernameExists} from '../utils/database';

interface SignUpProps {
  route: any;
  navigation: any;
}

const SignUp = (props: SignUpProps) => {
  const {route, navigation} = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
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
  const [usernameUnavailable, setUsernameUnavailable] = useState(false);
  const usernameEmpty = username === '';

  const checkDataValid =
    username !== '' &&
    displayName !== '' &&
    email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
    password.length >= 6 &&
    password === confirmPassword;

  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  const handleOnSubmit = () => {
    setIsCreatingAccount(true);
    signUp(email, password, username, displayName);
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

  const usernameCheck = async () => {
    setIsLoading(true);
    let exists = await checkUsernameExists(username);
    setUsernameUnavailable(exists);
    setIsLoading(false);
  };

  useEffect(() => {
    usernameCheck();
  }, [username]);

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
        keyboardShouldPersistTaps="handled"
        overScrollMode="never"
        showsVerticalScrollIndicator={false}>
        <Text variant="headlineMedium" style={styles.title}>
          Create your profile
        </Text>
        <View style={styles.container}>
          <View>
            {isLoading && <ActivityIndicator style={styles.textLoading} />}
            <TextInput
              style={{backgroundColor: 'transparent'}}
              mode="outlined"
              label="Username"
              placeholder="Username"
              value={username}
              error={usernameUnavailable}
              activeOutlineColor={theme.colors.primary}
              autoCapitalize="none"
              onChangeText={username => setUsername(username)}
            />
            {!usernameUnavailable && !isLoading && !usernameEmpty && (
              <HelperText type="info" visible={true}>
                Username is available.
              </HelperText>
            )}
            {usernameUnavailable && (
              <HelperText type="error" visible={true}>
                Username already exists.
              </HelperText>
            )}
          </View>
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
              style={{backgroundColor: 'transparent'}}
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
              style={{backgroundColor: 'transparent'}}
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
              style={{backgroundColor: 'transparent'}}
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
                !checkDataValid ||
                usernameUnavailable ||
                isLoading ||
                isCreatingAccount
              }
              stretch={true}
              backgroundColor={theme.colors.primary}
              backgroundDark={theme.colors.primaryDark}
              borderColor={theme.colors.primary}
              textColor={theme.colors.onPrimary}
              onPress={handleOnSubmit}>
              {!isCreatingAccount ? (
                'Create Account'
              ) : (
                <ActivityIndicator color={theme.colors.onPrimary} />
              )}
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
  textLoading: {
    position: 'absolute',
    right: 12,
    top: 20,
  },
});
