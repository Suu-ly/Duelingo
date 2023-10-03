import React, { useState, useEffect } from 'react';
import {View, TouchableOpacity, FlatList, KeyboardAvoidingView, StyleSheet} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import theme from '../common/constants/theme.json';

interface LobbyProps {
    route: any;
    navigation: any;
}

const Lobby = (props: LobbyProps) => {
  const {route, navigation} = props;
  let [newGameId, setGameId] = useState('')
  const userId = auth().currentUser.uid;

  const generateCode = length => {
    return Array(length).fill('x').join('').replace(/x/g, () => {
      return String.fromCharCode(Math.floor(Math.random() * 26) + 65)
    })
  }

  const CreateGame = async () => {
    database()
    .ref('/games/' + newGameId)
    .set({
      gameId: newGameId,
      isPlaying: 'true',
      currentPlayer: '',
      round: '',
      status: '',
      timestamp: '',
      turnStartTimestamp: '',
      turnTime: '60000',
      players: {player1: userId, player2: ''}
    })
    .then(() => navigation.navigate('Waiting'));
  }

  const CreateGameThings = () => {
    newGameId = generateCode(4);
    setGameId(newGameId);
    CreateGame();
  };

  const JoinGame = () => {
    database()
    .ref('/games/' + newGameId)
    .once('value')
    .then(snapshot => {
      JoinGameThings();
      console.log('User data: ', snapshot.val());
    });
  }

   const JoinGameThings = () => {
    database()
    .ref('/games/' + newGameId + 'players')
    .set({
      player2: userId
    })
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text variant={'headlineLarge'}>Lobby Screen</Text>
        <Button
          icon="map-marker-outline"
          mode="outlined"
          onPress={() => navigation.navigate('Home')}>
          Go to Home
        </Button>
        <View style={styles.rowContainer}>
          <KeyboardAvoidingView>
            <TextInput
            //  placeholder="New Game Id"
              //value={newGameId}
             // activeOutlineColor={theme.colors.primary}
             // autoCapitalize="none"
             // onChangeText={newGameId => setGameId(newGameId)}
            />
            <Button
              icon="map-marker-outline"
              mode="outlined"
              onPress={CreateGameThings}>
              Create Game
            </Button>
            <Button
              icon="map-marker-outline"
              mode="outlined"
              onPress={JoinGame}>
              Join Game
            </Button>
            <Text>Firebase Read Testing</Text>
          </KeyboardAvoidingView>
        </View>
      </View>
    </View>
  )
}

export default Lobby;

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
  