import React, { useState, useEffect } from 'react';
import {View, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, StyleSheet} from 'react-native';
import {Button, Text} from 'react-native-paper';
import database from '@react-native-firebase/database';

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
  const [myData, setMyData] = useState('')
  const [isChallenged, setChallenged] = useState('')
  
  const ReadData = async () => {
    database()
    .ref('/users/')
    .on('value', snapshot => {
      setMyData(snapshot.val());
    })
  }
  useEffect(() => {
    ReadData()
  }, [])

  const Challenge = async () => {
    database()
    .ref('/users/1')
    .set({
      challenged: 'true'
    })
    .then(() => console.log('Challenge sent.'));
  }

  const RenderOnFlat = ({item}) => {
    return(
      <View>
        <Text style={styles.text}>Challenged: {item.challenged}</Text>
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
            <Button
              icon="map-marker-outline"
              mode="outlined"
              onPress={Challenge}>
              Challenge
            </Button>
            <Text>Firebase CRUD Testing</Text>
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
  