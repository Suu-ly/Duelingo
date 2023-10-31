import React, { useState, useEffect } from 'react';
import {View, TouchableOpacity, FlatList, StyleSheet, ScrollView, Image} from 'react-native';
import {Button, Text, Searchbar} from 'react-native-paper';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import theme from '../common/constants/theme.json';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { users } from '../data/users';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ChallengeFriendProps {
    route: any;
    navigation: any;
}
const ChallengeFriend = (props: ChallengeFriendProps) => {
  const {route, navigation} = props;

  //your userId
  const userId = auth().currentUser?.uid;

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState('')
  const onChangeSearch = query => setSearchQuery(query);
  
  const friendId = firestore()
    .collection('Users')
    .doc(userId)
    .collection('Friends')
    .get()
    .then(querySnapshot => {
        console.log('Total Friends: ', querySnapshot.size);

        querySnapshot.forEach(documentSnapshot => {
            console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
        });
    });

  const getOnlineFriends = async () => {
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
                paddingTop: 22,
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
        <View style={styles.searchBar}>
            <Searchbar 
                placeholder='Search Friends'
                onChangeText={onChangeSearch}
                value={searchQuery}
            />
        </View>
        <Button
            mode="outlined"
            onPress={() => getOnlineFriends()}>
            Get Friends
        </Button>
        <View style={styles.cardContainer}>
            <FlatList
                data={users}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
    marginHorizontal: 22,
    marginBottom: 22,
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginHorizontal: 22,
  },
  cardContainer: {
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