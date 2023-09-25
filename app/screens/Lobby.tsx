import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, StyleSheet} from 'react-native';
import database from '@react-native-firebase/database';

interface LobbyProps {
    route: any;
    navigation: any;
  }

const Lobby = (props: LobbyProps) => {
  const {route, navigation} = props;
  const [myData, setMyData] = useState('')
  
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

  const RenderOnFlat = ({item}) => {
    return(
      <View>
        <Text style={styles.text}>Age: {item.age}</Text>
        <Text style={styles.text}>Desc: {item.desc}</Text>
        <Text style={styles.text}>Id: {item.id}</Text>
        <Text style={styles.text}>Name: {item.name}</Text>
      </View>
    )
  }
  return (
    <KeyboardAvoidingView>
      <Text>Firebase CRUD</Text>
      <View>
        <FlatList
          data={myData}
          renderItem={({item}) => <RenderOnFlat item={item} />}
        />
      </View>
    </KeyboardAvoidingView>
  )
}

export default Lobby;

const styles = StyleSheet.create({
  text:{
    color:'black',
    fontSize:20
  }
});
  