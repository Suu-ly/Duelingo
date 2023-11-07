import {View, StyleSheet} from 'react-native';
import {Button, Text} from 'react-native-paper';
import React, {useEffect} from 'react';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import Theme from '../common/constants/theme.json';
import {signOut} from '../utils/auth';
import {EventArg, NavigationAction} from '@react-navigation/native';
import DuoFAB from '../common/DuoFAB';

interface DebugProps {
  route: any;
  navigation: any;
}

const Debug = (props: DebugProps) => {
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
        <Text variant={'headlineLarge'}>Debug Screen</Text>
        <Button
          mode="outlined"
          onPress={() =>
            navigation.navigate('Quiz', {
              language: 'Chinese',
              module: 'Module1',
              topic: 'Topic1',
            })
          }>
          Go to Quiz
        </Button>
        <Button
          mode="outlined"
          onPress={() =>
            navigation.navigate('QuizEnd', {
              timeElapsed: 80,
              score: 3,
              totalQuestions: 7,
            })
          }>
          Go to Quiz End
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('HomeScreen')}>
          Home Page
        </Button>
        <Button mode="outlined" onPress={() => signOut()}>
          Sign Out
        </Button>
        <DuoButton
          filled={true}
          disabled={false}
          icon={'account-plus-outline'}
          backgroundColor={Theme.colors.primary}
          backgroundDark={Theme.colors.primaryDark}
          borderColor={Theme.colors.primary}
          textColor={Theme.colors.onPrimary}
          onPress={() => console.log('Click')}>
          Add Friends
        </DuoButton>
      </View>
      <DuoFAB
        onPress={() => console.log('FAB')}
        icon={'account-plus-outline'}
      />
    </View>
  );
};

export default Debug;

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
