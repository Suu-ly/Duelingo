import {View, StyleSheet} from 'react-native';
import {Button, Text} from 'react-native-paper';
import React, {useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import theme from '../common/constants/theme.json';
import {signOut} from '../utils/auth';
import {EventArg, NavigationAction} from '@react-navigation/native';

interface HomeProps {
  route: any;
  navigation: any;
}

const Home = (props: HomeProps) => {
  const {route, navigation} = props;

  useEffect(
    () =>
      navigation.addListener(
        'beforeRemove',
        (e: EventArg<'beforeRemove', true, {action: NavigationAction}>) => {
          if (e.data.action.type != 'GO_BACK') {
            return;
          }
          // Prevent default behavior of leaving the screen
          e.preventDefault();
        },
      ),
    [navigation],
  );

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar />
      <View style={styles.container}>
        <Text variant={'headlineLarge'}>Home Screen</Text>
        <Button
          mode="outlined"
          onPress={() =>
            navigation.navigate('Quiz', {
              language: 'chinese',
              difficulty: 'hard',
              questionNo: 0,
              remaining: 5,
              totalQuestions: 5,
              timeElapsed: 0,
              score: 0,
            })
          }>
          Go to Hard Quiz
        </Button>
        <Button
          mode="outlined"
          onPress={() =>
            navigation.navigate('QuizEnd', {
              timeElapsed: 80,
              multiplayer: false,
              score: 3,
              totalQuestions: 7,
            })
          }>
          Go to Quiz End
        </Button>
        <Button mode="outlined" onPress={() => navigation.navigate('Lobby')}>
          Lobby
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Challenge')}>
          Challenge
        </Button>
        <Button mode="outlined" onPress={() => signOut()}>
          Sign Out
        </Button>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Constants.defaultGap,
    paddingHorizontal: Constants.edgePadding,
  },
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Constants.mediumGap,
    justifyContent: 'center',
  },
});
