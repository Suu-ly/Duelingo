import {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {getUsersData, createFriend, getFriendList} from '../utils/database';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {Searchbar, ActivityIndicator} from 'react-native-paper';
import {View, StyleSheet, Animated, FlatList} from 'react-native';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import Theme from '../common/constants/theme.json';
import ChallengeCard from '../common/ChallengeCards';

interface AddFriendsProps {
  route: any;
  navigation: any;
  translate: Animated.Value;
  opacity: Animated.Value;
}

const AddFriends = (props: AddFriendsProps) => {
  const {route, navigation, translate, opacity} = props;

  const [searchQuery, setSearchQuery] = useState('');
  const [friendList, setFriendList] = useState<string[] | null>(null);
  const [currentUser, setCurrentUser] = useState<
    FirebaseFirestoreTypes.DocumentData[] | null
  >(null);

  const getUser = async () => {
    let userDetails: any = await getUsersData();
    setCurrentUser(userDetails);
  };

  const getFriend = async () => {
    let friendDetails: string[] = await getFriendList();
    setFriendList(friendDetails);
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
    <Animated.View
      style={[
        styles.mainContainer,
        {transform: [{translateY: translate}], opacity: opacity},
      ]}>
      <CustomStatusBar />
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
      {currentUser && friendList ? (
        <FlatList
          style={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContentContainer}
          data={currentUser.filter(filterFunction)}
          renderItem={({item, index}) => (
            <ChallengeCard
              key={item.uid}
              onPress={() => handleCreate(item.uid)}
              cardOnPress={() =>
                navigation.navigate('OtherProfile', {userId: item.uid})
              }
              avatarIndex={item.avatar}
              topText={item.username}
              bottomText={item.displayName}
              buttonText={friendList.includes(item.uid) ? 'Added' : 'Add'}
              buttonTextColor={Theme.colors.secondary}
              buttonBorderColor={Theme.colors.secondary}
              buttonWidth={82}
              disabled={friendList.includes(item.uid)}
            />
          )}
        />
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      )}
    </Animated.View>
  );
};

export default AddFriends;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Theme.colors.elevation.level3,
  },
  container: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    padding: Constants.edgePadding,
    gap: Constants.largeGap,
  },
  card: {
    backgroundColor: Theme.colors.elevation.level0,
    borderRadius: Constants.radiusLarge,
    overflow: 'hidden',
  },
  ripple: {
    padding: Constants.edgePadding,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Constants.largeGap,
  },
  textContainer: {
    gap: Constants.smallGap,
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
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Constants.largeGap,
  },
});
