import React, { useState, useEffect } from 'react';
import {View, TouchableOpacity, FlatList, StyleSheet, ScrollView, Image} from 'react-native';
import {Button, Appbar, Text, Searchbar, Surface, Avatar, FAB,} from 'react-native-paper';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import theme from '../common/constants/theme.json';
import { Colors } from "react-native/Libraries/NewAppScreen";
import { getFriendDetails } from '../utils/database';

interface ChallengeFriendProps {
    route: any;
    navigation: any;
}
const ChallengeFriend = (props: ChallengeFriendProps) => {
  const {route, navigation} = props;

  //your userId
  const userId = auth().currentUser?.uid;

  const [isPressed, setIsPressed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const onChangeSearch = (query: any) => setSearchQuery(query);

  const imgSource = [
    require('../assets/avatar/0.png'),
    require('../assets/avatar/1.png'),
    require('../assets/avatar/2.png'),
    require('../assets/avatar/3.png'),
    require('../assets/avatar/4.png'),
    require('../assets/avatar/5.png'),
    require('../assets/avatar/6.png'),
    require('../assets/avatar/7.png'),
    require('../assets/avatar/8.png'),
    require('../assets/avatar/9.png'),
    require('../assets/avatar/10.png'),
    require('../assets/avatar/11.png'),
    require('../assets/avatar/12.png'),
    require('../assets/avatar/13.png'),
    require('../assets/avatar/14.png'),
  ];

  const [currentFriend, setCurrentFriend] = useState([
    {
      displayName: '',
      username: '',
      email: '',
      exp: 0,
      hearts: {
        amount: 5,
        timestamp: 0,
      },
      chinese: 0,
      malay: 0,
      avatar: 0,
    },
  ]);

  const getFriend = async () => {
    let friendDetails: any = await getFriendDetails();
    console.log(friendDetails);
    setCurrentFriend([...friendDetails]);
  };

  useEffect(() => {
    getFriend();
  }, [isPressed]);


  const getOnlineFriends = async () => {
    await database()
      .ref('users')
      .orderByChild('friends') //only return online friends
      .equalTo(true)
      .once('value',snapshot => {
        console.log(snapshot.val());
      });
  };

  /*const renderItem = ({ item, index }) => (
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
                source={item.imgSource}
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
                {item.username}
            </Text>
        </View>
    </TouchableOpacity>
  )*/

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar />
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
      </Appbar.Header>
      <View style={styles.container}>
        <View style={styles.title}>
          <Text variant={'headlineLarge'}>Challenge</Text>
        </View>
        <View style={styles.subtitle}>
          <Text variant={'bodySmall'}>Battle a friend in a language duel!</Text>
        </View>
        <View style={styles.searchBar}>
          <Searchbar
            placeholder="Search Friends"
            onChangeText={onChangeSearch}
            value={searchQuery}
          />
        </View>

        {currentFriend.map((friend, i) => (
          <TouchableOpacity
            style={styles.surface}
            onPress={() => console.log('Pressed')}
            key={i}>
            <Surface elevation={0}>
              <View style={styles.rowContainer}>
                <Avatar.Image size={48} source={imgSource[friend.avatar]} />
                <View style={styles.textContainer}>
                  <Text variant={'labelMedium'}>{friend.username}</Text>
                  <Text variant={'bodyLarge'}>{friend.displayName}</Text>
                </View>
                <View style={styles.buttonContainer}>
                  <DuoButton
                    filled={false}
                    backgroundDark={theme.colors.secondary}
                    backgroundColor={theme.colors.elevation.level0}
                    onPress={() => {
                      setIsPressed(isPressed ? false : true);
                    }}
                    borderColor={theme.colors.outline}
                    textColor={theme.colors.onSurface}>
                    Challenge
                  </DuoButton>
                </View>
              </View>
            </Surface>
          </TouchableOpacity>
        ))}
        <FAB
          icon="account-plus-outline"
          style={styles.fab}
          onPress={() => navigation.navigate('AddFriends')}
          mode="flat"
          color={theme.colors.onPrimary}
        />
      </View>
    </View>
  );
};

export default ChallengeFriend;

const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.colors.surface,
    },
    container: {
      flex: 1,
      marginTop: Constants.mediumGap,
      gap: Constants.largeGap,
      paddingHorizontal: Constants.edgePadding,
    },
    appbar: {
      backgroundColor: theme.colors.surface,
    },
    title: {
      marginBottom: -5,
    },
    subtitle: {
        marginBottom: 10,
      },
    searchBar: {
      marginBottom: Constants.largeGap,
    },
    surface: {
      backgroundColor: theme.colors.elevation.level0,
      padding: Constants.edgePadding,
      height: 80,
      width: 'auto',
      justifyContent: 'center',
      flex: 0,
      borderRadius: Constants.radiusLarge,
    },
    rowContainer: {
      flexDirection: 'row',
    },
    textContainer: {
      justifyContent: 'center',
      marginLeft: 12,
      flexDirection: 'column',
    },
    buttonContainer: {
      marginLeft: 'auto',
      marginRight: 0,
    },
    fab: {
      position: 'absolute',
      margin: Constants.largeGap,
      right: Constants.largeGap,
      bottom: Constants.largeGap,
      backgroundColor: theme.colors.primary,
    },
  });