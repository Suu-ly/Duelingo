import {useEffect, useState} from 'react';
import {getFriendDetails} from '../utils/database';
import {
  Appbar,
  Text,
  Searchbar,
  Surface,
  Avatar,
  FAB,
} from 'react-native-paper';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {deleteFriend} from '../utils/database';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import theme from '../common/constants/theme.json';

interface FriendsProps {
  route: any;
  navigation: any;
}

const Friends = (props: FriendsProps) => {
  const {route, navigation} = props;
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
          <Text variant={'headlineLarge'}>Friends</Text>
        </View>
        <View style={styles.searchBar}>
          <Searchbar
            placeholder="Search your friends"
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
                      deleteFriend(friend.username);
                      setIsPressed(isPressed ? false : true);
                    }}
                    borderColor={theme.colors.outline}
                    textColor={theme.colors.onSurface}>
                    Remove
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

export default Friends;

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
    marginBottom: 16,
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