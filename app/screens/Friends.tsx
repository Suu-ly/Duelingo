import {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {getFriendData, deleteFriend} from '../utils/database';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {Appbar, Text, Searchbar, FAB} from 'react-native-paper';
import {View, ScrollView, StyleSheet} from 'react-native';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import ChallengeCard from '../common/ChallengeCard';
import theme from '../common/constants/theme.json';

interface FriendsProps {
  route: any;
  navigation: any;
}

const Friends = (props: FriendsProps) => {
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

  const getFriend = async () => {
    let friendDetails: any = await getFriendData();
    setCurrentFriend([...friendDetails]);
  };

  const filterFunction = (entry: FirebaseFirestoreTypes.DocumentData) => {
    if (searchQuery === '') return true;
    return (
      entry.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleDelete = (friendId: string) => {
    deleteFriend(friendId);
    getFriend();
  };

  useFocusEffect(
    useCallback(() => {
      getFriend();
    }, []),
  );

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar />
      <ScrollView
        style={styles.container}
        stickyHeaderIndices={[2]}
        showsVerticalScrollIndicator={false}>
        <Appbar.Header style={styles.appbar}>
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
          />
        </Appbar.Header>
        <View style={styles.title}>
          <Text variant={'headlineLarge'}>Friends</Text>
        </View>
        <View style={styles.searchBar}>
          <Searchbar
            placeholder="Search your friends"
            onChangeText={searchQuery => {
              setSearchQuery(searchQuery);
            }}
            value={searchQuery}
          />
        </View>
        <View style={styles.cardsContainer}>
          {currentFriend[0].uid !== '' ? (
            <View style={styles.cards}>
              <ChallengeCard
                data={currentFriend.filter(filterFunction)}
                onPress={handleDelete}
                friendList={true}
                navigation={navigation}
              />
            </View>
          ) : (
            <View style={styles.loading}>
              <Text
                variant={'bodyMedium'}
                style={{color: theme.colors.onSurfaceVariant}}>
                You don't have any friends yet.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <FAB
        icon="account-plus-outline"
        style={styles.fab}
        onPress={() => navigation.navigate('AddFriends')}
        mode="flat"
        color={theme.colors.onPrimary}
      />
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
    gap: Constants.largeGap,
    paddingHorizontal: Constants.edgePadding,
  },
  appbar: {
    backgroundColor: theme.colors.surface,
    marginTop: -Constants.mediumGap,
    marginHorizontal: -Constants.edgePadding,
  },
  title: {
    marginBottom: 16,
  },
  searchBar: {
    marginBottom: Constants.largeGap,
    backgroundColor: theme.colors.surface,
    paddingBottom: Constants.largeGap,
  },
  cardsContainer: {
    gap: Constants.edgePadding,
    flex: 1,
    paddingBottom: Constants.edgePadding,
  },
  cards: {
    gap: Constants.largeGap,
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Constants.largeGap,
  },
  fab: {
    position: 'absolute',
    margin: Constants.largeGap,
    right: Constants.smallGap,
    bottom: Constants.smallGap,
    backgroundColor: theme.colors.primary,
  },
});
