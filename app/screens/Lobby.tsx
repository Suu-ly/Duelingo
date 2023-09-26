import React, { useState, useEffect } from 'react';
import {View, TouchableOpacity, FlatList, KeyboardAvoidingView, StyleSheet} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import database from '@react-native-firebase/database';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import theme from '../common/constants/theme.json';
import { database } from '@react-native-firebase/database';

import { firebase } from '@react-native-firebase/database';

const reference = database
  .app()
  .database('https://duelingo-563d3-default-rtdb.asia-southeast1.firebasedatabase.app/')
  .ref('/games');


interface LobbyProps {
    route: any;
    navigation: any;
}

const Lobby = (props: LobbyProps) => {
  const {route, navigation} = props;
  const [myData, setMyData] = useState('')
  const [newGameId, setGameId] = useState('')
  
  const ReadData = async () => {
    database()
    .ref('/games/')
    .on('value', snapshot => {
      setMyData(snapshot.val());
    })
  }
  useEffect(() => {
    ReadData()
  }, [])

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
      players: {player1: '', player2: ''}
    })
    .then(() => navigation.navigate('Waiting'));
  }

  const RenderOnFlat = ({item}) => {
    return(
      <View>
        <Text style={styles.text}>games: {item}</Text>
      </View>
    )
  }
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
              placeholder="New Game Id"
              value={newGameId}
              activeOutlineColor={theme.colors.primary}
              autoCapitalize="none"
              onChangeText={newGameId => setGameId(newGameId)}
            />
            <Button
              icon="map-marker-outline"
              mode="outlined"
              onPress={CreateGame}>
              Create Game
            </Button>
            <Text>Firebase Read Testing</Text>
            <View>
              <FlatList
                data={myData}
                renderItem={({item}) => <RenderOnFlat item={item} />}
              />
            </View>
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
  