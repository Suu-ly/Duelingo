import {View, StyleSheet} from 'react-native';
import {Button, Text} from 'react-native-paper';
import React, {useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import theme from '../common/constants/theme.json';

interface HomeProps {
  route: any;
  navigation: any;
}

const Home = (props: HomeProps) => {
  const {route, navigation} = props;

  useEffect(() => {
    // Assuming user is logged in
    const userId = auth().currentUser?.uid;

    const reference = database().ref(`/users/${userId}`);

    // Set the /users/:userId value to true
    reference.set(true).then(() => console.log('Online presence set'));

    // Remove the node whenever the client disconnects
    reference
      .onDisconnect()
      .set(false)
      .then(() => console.log('On disconnect function configured.'));
  }, []);

  const handleSignOut = () => {
    auth().signOut();
    navigation.navigate('Landing');
  };

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
        <Button
          icon="map-marker-outline"
          mode="outlined"
          onPress={() => navigation.navigate('Lobby')}>
          Lobby
        </Button>
        <Button
          icon="map-marker-outline"
          mode="outlined"
          onPress={() => navigation.navigate('Profile')}>
          Profile
        </Button>
        <Button mode="outlined" onPress={() => handleSignOut()}>
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
