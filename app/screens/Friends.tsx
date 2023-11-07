import {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {getFriendData, deleteFriend} from '../utils/database';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {
  Appbar,
  Text,
  Searchbar,
  FAB,
  ActivityIndicator,
} from 'react-native-paper';
import {View, ScrollView, StyleSheet, Animated} from 'react-native';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import ChallengeCard from '../common/ChallengeCards';
import Theme from '../common/constants/theme.json';

interface FriendsProps {
  route: any;
  navigation: any;
  translate: Animated.Value;
  opacity: Animated.Value;
}

const Friends = (props: FriendsProps) => {
  const {route, navigation, translate, opacity} = props;
  const [searchQuery, setSearchQuery] = useState('');
  const [friendList, setFriendList] = useState<
    FirebaseFirestoreTypes.DocumentData[] | null
  >(null);

  const getFriend = async () => {
    let friendDetails: FirebaseFirestoreTypes.DocumentData[] =
      await getFriendData();
    setFriendList(friendDetails);
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
    <Animated.View
      style={[
        styles.mainContainer,
        {transform: [{translateY: translate}], opacity: opacity},
      ]}>
      <CustomStatusBar />
      <ScrollView
        style={styles.container}
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}>
        <Appbar.Header mode="large" statusBarHeight={0}>
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Appbar.Content title="Friends" />
        </Appbar.Header>
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
          {friendList && friendList.length !== 0 ? (
            <View style={styles.cards}>
              {friendList.filter(filterFunction).map((user, index) => {
                return (
                  <ChallengeCard
                    key={user.uid}
                    onPress={() => handleDelete(user.uid)}
                    cardOnPress={() =>
                      navigation.navigate('OtherProfile', {userId: user.uid})
                    }
                    avatarIndex={user.avatar}
                    topText={user.username}
                    bottomText={user.displayName}
                    buttonText="Remove"
                    buttonTextColor={Theme.colors.onSurface}
                    buttonBorderColor={Theme.colors.outline}
                  />
                );
              })}
            </View>
          ) : friendList?.length === 0 ? (
            <View style={styles.loading}>
              <Text
                variant={'bodyMedium'}
                style={{color: Theme.colors.onSurfaceVariant}}>
                You don't have any friends yet.
              </Text>
            </View>
          ) : (
            <View style={styles.loading}>
              <ActivityIndicator />
            </View>
          )}
        </View>
      </ScrollView>
      <FAB
        icon="account-plus-outline"
        style={styles.fab}
        onPress={() => navigation.navigate('AddFriends')}
        mode="flat"
        color={Theme.colors.onPrimary}
      />
    </Animated.View>
  );
};

export default Friends;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
  },
  container: {
    flex: 1,
    gap: Constants.largeGap,
  },
  searchBar: {
    padding: Constants.edgePadding,
    paddingTop: 0,
    backgroundColor: Theme.colors.surface,
  },
  cardsContainer: {
    gap: Constants.largeGap,
    flex: 1,
    paddingBottom: 88,
    paddingHorizontal: Constants.edgePadding,
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
    backgroundColor: Theme.colors.primary,
  },
});
