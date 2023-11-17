import React, {useEffect, useState} from 'react';
import {Text} from 'react-native-paper';
import {View, StyleSheet, Image} from 'react-native';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import theme from '../common/constants/theme.json';

interface LandingProps {
  route: any;
  navigation: any;
}

theme.colors.background = 'white';

const Landing = (props: LandingProps) => {
  const {route, navigation} = props;

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar />
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={require('../assets/Landing.png')} style={styles.duo} />
        </View>
        <Text style={styles.text} variant={'headlineSmall'}>
          Learn through competition.
        </Text>
      </View>
      <View style={styles.bottomContainer}>
        <DuoButton
          filled={true}
          disabled={false}
          stretch={true}
          backgroundColor={theme.colors.primary}
          backgroundDark={theme.colors.primaryDark}
          borderColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
          onPress={() => navigation.navigate('SignUp')}>
          Get Started
        </DuoButton>
        <DuoButton
          filled={false}
          disabled={false}
          stretch={true}
          backgroundColor={'white'}
          borderColor={theme.colors.secondary}
          textColor={theme.colors.secondary}
          onPress={() => navigation.navigate('SignIn')}>
          I Already Have An Account
        </DuoButton>
      </View>
    </View>
  );
};

export default Landing;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Constants.largeGap,
    paddingHorizontal: Constants.edgePadding,
  },
  bottomContainer: {
    justifyContent: 'flex-end',
    gap: Constants.largeGap,
    paddingBottom: 2 * Constants.edgePadding,
    paddingHorizontal: Constants.edgePadding,
  },
  imageContainer: {
    gap: 45,
    width: 425,
    height: 425,
  },
  duo: {
    width: 425,
    height: 425,
  },
  duelingo: {
    width: 179,
    height: 44,
  },
  text: {
    color: theme.colors.primary,
  },
});
