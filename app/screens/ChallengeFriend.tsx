import React, { useState, useEffect } from 'react';
import {View, TouchableOpacity, FlatList, StyleSheet, Image} from 'react-native';
import {Button, Text, Searchbar} from 'react-native-paper';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import theme from '../common/constants/theme.json';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { users } from '../data/users';

interface ChallengeFriendProps {
    route: any;
    navigation: any;
}
const ChallengeFriend = (props: ChallengeFriendProps) => {
  const {route, navigation} = props;

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState('')
  const onChangeSearch = query => setSearchQuery(query);
  
  const getFriends = async () => {
    await database()
      .ref('users')
      .orderByChild('friends') //only return online friends
      .equalTo(true)
      .once('value',snapshot => {
        console.log(snapshot.val());
      });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
        key={index}
        onPress={() => navigation.navigate('Home')}
        style={[
            {
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 22,
                borderBottomColor: Colors.black,
                borderBottomWidth: 1,
            },
            index % 2 !== 0
                ? {
                      backgroundColor: Colors.green,
                  }
                : null,
        ]}
    >
        <View
            style={{
                paddingVertical: 15,
                marginRight: 22,
            }}
        >
            {item.isOnline && item.isOnline == true && (
                <View
                    style={{
                        height: 14,
                        width: 14,
                        borderRadius: 7,
                        backgroundColor: Colors.yellow,
                        borderColor: Colors.white,
                        borderWidth: 2,
                        position: 'absolute',
                        top: 14,
                        right: 2,
                        zIndex: 1000,
                    }}
                ></View>
            )}

            <Image
                source={item.userImg}
                resizeMode="contain"
                style={{
                    height: 48,
                    width: 48,
                    borderRadius: 25,
                }}
            />
        </View>
        <View
            style={{
                flexDirection: 'column',
            }}
        >
            <Text variant={'bodySmall'}>
                {item.userName}
            </Text>
        </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.mainContainer}>
        <View style={styles.container}>
            <Text variant={'headlineLarge'}>Challenge</Text>
        </View>
        <View style={styles.subContainer}>
            <Text variant={'bodySmall'}>Battle a friend in a language duel!</Text>
        </View>
        <View style={styles.rowContainer}>
            <Searchbar 
                placeholder='Search Friends'
                onChangeText={onChangeSearch}
                value={searchQuery}
            />
        </View>
        <Button
            mode="outlined"
            onPress={() => getFriends()}>
            Get Friends
        </Button>
        <FlatList
            data={users}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
        />
    </View>
  )
}

export default ChallengeFriend;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 66,
    marginHorizontal: 22,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
    marginHorizontal: 22,
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginHorizontal: 22,
  },
  text:{
    color:'black',
    fontSize:20
  }
});