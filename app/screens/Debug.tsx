import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Text} from 'react-native-paper';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import theme from '../common/constants/theme.json';

import {createFriend, getFriendList} from '../utils/database';

interface DebugProps {
  route: any;
  navigation: any;
}

const Debug = (props: DebugProps) => {
  const {route, navigation} = props;

  // change to whatever way to get the username
  const username = 'austin3';

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar />
      <View style={styles.container}>
        <Text variant={'headlineLarge'}>Debug Screen</Text>
        <Button
          mode="outlined"
          onPress={() =>
            navigation.navigate('Quiz', {
              language: 'chinese',
              difficulty: 'easy',
              questionNo: 0,
              remaining: 5,
              totalQuestions: 5,
              timeElapsed: 0,
              score: 0,
            })
          }>
          Go to Easy Quiz
        </Button>
        <Button
          mode="outlined"
          onPress={() =>
            navigation.navigate('Quiz', {
              language: 'chinese',
              difficulty: 'intermediate',
              questionNo: 0,
              remaining: 5,
              totalQuestions: 5,
              timeElapsed: 0,
              score: 0,
            })
          }>
          Go to Intermediate Quiz
        </Button>
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
        <Button mode="outlined" onPress={() => navigation.navigate('Friends')}>
          Go to Friends
        </Button>
        <Button
          mode="outlined"
          onPress={() => {
            createFriend(username);
          }}>
          Add Friend
        </Button>
        <Button
          mode="outlined"
          onPress={() => {
            getFriendList();
          }}>
          Get Friend List
        </Button>
      </View>
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
