import {useEffect, useState} from 'react';
import {
  getFriendList,
  getUserListExceptOwn,
  getUserDetails,
  createFriend,
} from '../utils/database';
import {Text, Searchbar, Surface, Avatar} from 'react-native-paper';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import theme from '../common/constants/theme.json';

interface AddFriendsProps {
  route: any;
  navigation: any;
}

const AddFriends = (props: AddFriendsProps) => {
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

  const [currentUser, setCurrentUser] = useState([
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

  const [friendList, setFriendList] = useState(['']);
  const [userList, setUserList] = useState(['']);

  const getUser = async () => {
    let userDetails: any = await getUserDetails();
    console.log(userDetails);
    setCurrentUser([...userDetails]);
  };

  const getFriend = async () => {
    let friends: any = await getFriendList();
    setFriendList([...friends]);
  };

  const getUserList = async () => {
    let users: any = await getUserListExceptOwn();
    setUserList([...users]);
  };

  useEffect(() => {
    getUser();
    getUserList();
    getFriend();
  }, [isPressed]);

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar />
      <ScrollView
        style={styles.container}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.searchBar}>
          <Searchbar
            placeholder="Search for a user"
            onChangeText={onChangeSearch}
            value={searchQuery}
            mode={'view'}
            icon={'arrow-left'}
            onIconPress={() => {
              navigation.goBack();
            }}
          />
        </View>
        {currentUser.map((user, i) => (
          <TouchableOpacity
            style={styles.surface}
            onPress={() => console.log('Pressed')}
            key={i}>
            <Surface elevation={0}>
              <View style={styles.rowContainer}>
                <Avatar.Image size={48} source={imgSource[user.avatar]} />
                <View style={styles.textContainer}>
                  <Text variant={'labelMedium'}>{user.username}</Text>
                  <Text variant={'bodyLarge'}>{user.displayName}</Text>
                </View>
                <View style={styles.buttonContainer}>
                  <DuoButton
                    filled={false}
                    width={77.5}
                    disabled={friendList.includes(userList[i]) ? true : false}
                    backgroundDark={theme.colors.secondary}
                    backgroundColor={theme.colors.elevation.level0}
                    onPress={() => {
                      createFriend(user.username);
                      setIsPressed(isPressed ? false : true);
                    }}
                    borderColor={theme.colors.outline}
                    textColor={theme.colors.onSurface}>
                    {friendList.includes(userList[i]) ? 'Added' : 'Add'}
                  </DuoButton>
                </View>
              </View>
            </Surface>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default AddFriends;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.elevation.level3,
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
    marginBottom: Constants.largeGap,
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
});
