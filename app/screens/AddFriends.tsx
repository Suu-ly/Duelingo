import {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {getFriendData, getUsersData, createFriend} from '../utils/database';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {Text, Searchbar, Surface} from 'react-native-paper';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
// import ChallengeCard from '../common/ChallengeCard';
import DuoButton from '../common/DuoButton';
import theme from '../common/constants/theme.json';
import Avatar from '../common/Avatar';

interface AddFriendsProps {
  route: any;
  navigation: any;
}

const AddFriends = (props: AddFriendsProps) => {
  const {route, navigation} = props;
  const initialUser = [
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
      uid: '',
    },
  ];
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFriend, setCurrentFriend] = useState(initialUser);
  const [currentUser, setCurrentUser] = useState(initialUser);

  const getUser = async () => {
    let userDetails: any = await getUsersData();
    setCurrentUser([...userDetails]);
  };

  const getFriend = async () => {
    let friendDetails: any = await getFriendData();
    setCurrentFriend([...friendDetails]);
  };

  const filterFunction = (entry: FirebaseFirestoreTypes.DocumentData) => {
    if (searchQuery === '') return false;
    return (
      entry.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleCreate = (friendId: string) => {
    createFriend(friendId);
    getFriend();
  };

  useFocusEffect(
    useCallback(() => {
      getUser();
      getFriend();
    }, []),
  );

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
            onChangeText={searchQuery => {
              setSearchQuery(searchQuery);
            }}
            value={searchQuery}
            mode={'view'}
            icon={'arrow-left'}
            onIconPress={() => {
              navigation.goBack();
            }}
          />
        </View>
        {currentUser.filter(filterFunction).map((user, i) => (
          <TouchableOpacity
            style={styles.surface}
            onPress={() => console.log('Pressed')}
            key={i}>
            <Surface elevation={0}>
              <View style={styles.rowContainer}>
                <Avatar index={user.avatar} style={styles.image} />
                <View style={styles.textContainer}>
                  <Text variant={'labelMedium'}>{user.username}</Text>
                  <Text variant={'bodyLarge'}>{user.displayName}</Text>
                </View>
                <View style={styles.buttonContainer}>
                  <DuoButton
                    filled={false}
                    width={77.5}
                    disabled={
                      currentFriend.filter((e: any) => e.uid === user.uid)
                        .length != 0
                        ? true
                        : false
                    }
                    backgroundDark={theme.colors.secondary}
                    backgroundColor={theme.colors.elevation.level0}
                    onPress={() => {
                      handleCreate(user.uid);
                    }}
                    borderColor={theme.colors.outline}
                    textColor={theme.colors.onSurface}>
                    {currentFriend.filter((e: any) => e.uid === user.uid)
                      .length != 0
                      ? 'Added'
                      : 'Add'}
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
  image: {
    width: 48,
    height: 48,
    borderRadius: 256,
  },
});
