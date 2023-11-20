import {useState} from 'react';
import {signIn} from '../utils/auth';
import {
  Appbar,
  TextInput,
  HelperText,
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import {
  View,
  StyleSheet,
  Platform,
  UIManager,
  LayoutAnimation,
  ScrollView,
} from 'react-native';

import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import theme from '../common/constants/theme.json';

interface SignInProps {
  route: any;
  navigation: any;
}

const SignIn = (props: SignInProps) => {
  const {route, navigation} = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [rightIcon, setRightIcon] = useState('eye-off');
  const [error, setError] = useState(false);
  const [isSigningIn, setIsSingingIn] = useState(false);

  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  const handleOnSubmit = () => {
    setIsSingingIn(true);
    signIn(email, password);
  };

  const handlePasswordVisibility = () => {
    rightIcon === 'eye' ? setRightIcon('eye-off') : setRightIcon('eye');
    setShowPassword(!showPassword);
  };

  const validateEmail = () => {
    animate();
    setError(email != '' && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/));
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
        keyboardShouldPersistTaps="handled"
        overScrollMode="never"
        showsVerticalScrollIndicator={false}>
        <Text variant="headlineMedium" style={styles.title}>
          Log in
        </Text>
        <View style={styles.container}>
          <View>
            <TextInput
              style={{backgroundColor: theme.colors.surface}}
              mode="outlined"
              label="Email"
              placeholder="Email"
              value={email}
              activeOutlineColor={theme.colors.primary}
              autoCapitalize="none"
              error={error}
              onFocus={() => {
                animate();
                setError(false);
              }}
              onBlur={validateEmail}
              onChangeText={email => setEmail(email)}
            />
            {error && (
              <HelperText type="error" visible={true}>
                Invalid email address format.
              </HelperText>
            )}
          </View>
          <TextInput
            style={{backgroundColor: theme.colors.surface}}
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
          <View style={styles.buttonContainer}>
            <DuoButton
              filled={true}
              disabled={
                (email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) && password !== ''
                  ? false
                  : true) || isSigningIn
              }
              stretch={true}
              backgroundColor={theme.colors.primary}
              backgroundDark={theme.colors.primaryDark}
              borderColor={theme.colors.primary}
              textColor={theme.colors.onPrimary}
              onPress={handleOnSubmit}>
              {!isSigningIn ? (
                'Log In'
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

export default SignIn;

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
