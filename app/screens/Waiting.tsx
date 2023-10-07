import React, { useState, useEffect } from 'react';
import {View, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, StyleSheet} from 'react-native';
import {Button, Text} from 'react-native-paper';
import database from '@react-native-firebase/database';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import theme from '../common/constants/theme.json';

interface WaitingProps {
    route: any;
    navigation: any;
}
const Waiting = (props: WaitingProps) => {
  const {route, navigation} = props;
  if (global.lobbyId === '') {
    global.lobbyId = global.joinId;
  }
  
  //const StartGame = async () => {
    useEffect(() => {
      const onValueChange = database()
        .ref('/games/' + global.lobbyId + '/guest')
        .on('value', snapshot => {
          if (snapshot.val() !== '') {
            navigation.navigate('Quiz', {
              language: 'chinese',
              difficulty: 'easy',
              questionNo: 0,
              remaining: 5,
              totalQuestions: 5,
              timeElapsed: 0,
              score: 0,
          });
          } else {
            console.log('Starting Game Error');
          }
        });
  
      // Stop listening for updates when no longer required
      return () => database().ref('/games/' + global.lobbyId + '/guest').off('value', onValueChange);
    }, []);
  //}

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text variant={'headlineLarge'}>Waiting Screen</Text>
        <Button
          icon="map-marker-outline"
          mode="outlined"
          onPress={() => navigation.navigate('Home')}>
          {global.lobbyId}
        </Button>
      </View>
    </View>
  )
}

export default Waiting;

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
  text:{
    color:'black',
    fontSize:20
  }
});