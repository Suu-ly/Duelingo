import {useEffect, useState} from 'react';
import {getFriendDetails} from '../utils/database';
import {Appbar, Text, Searchbar, Surface} from 'react-native-paper';
import {View, StyleSheet} from 'react-native';

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
  const [searchQuery, setSearchQuery] = useState('');

  const onChangeSearch = (query: any) => setSearchQuery(query);

  //   const handleOnSubmit = () => {
  //     signIn(props, email, password);
  //   };

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
  }, []);

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
        <Searchbar
          placeholder="Search your friends"
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
        {currentFriend.map(friend => (
          <Surface style={styles.surface} elevation={0} key={friend.username}>
            <Text>{friend.username}</Text>
          </Surface>
        ))}

        {/* <DuoButton
          filled={true}
          disabled={
            email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) && password != ''
              ? false
              : true
          }
          stretch={true}
          backgroundColor={theme.colors.primary}
          backgroundDark={theme.colors.primaryDark}
          borderColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
          onPress={handleOnSubmit}>
          Log In
        </DuoButton> */}
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
  surface: {
    backgroundColor: theme.colors.elevation.level0,
    marginTop: Constants.largeGap,
    padding: Constants.edgePadding,
    height: 80,
    width: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
});
