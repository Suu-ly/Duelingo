import {useState, useEffect, useCallback} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';
import {
  ActivityIndicator,
  IconButton,
  ProgressBar,
  Text,
} from 'react-native-paper';
import auth from '@react-native-firebase/auth';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import Theme from '../common/constants/theme.json';
import {
  getUserData,
  getFriendList,
  deleteFriend,
  createFriend,
} from '../utils/database';
import Avatar from '../common/Avatar';
import {useFocusEffect} from '@react-navigation/native';

interface OtherProfileProps {
  route: any;
  navigation: any;
}

const OtherProfile = (props: OtherProfileProps) => {
  const {route, navigation} = props;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Record<string, any>>({});
  const [numFriends, setNumFriends] = useState(0);
  const [isFriends, setIsFriends] = useState(false);

  const userId = route.params.userId;
  const ownUserId = auth().currentUser!.uid;

  const loadData = async () => {
    setIsLoading(true);
    let temp = await getUserData(userId);
    let numTemp = await getFriendList(userId);
    if (numTemp.includes(ownUserId)) {
      setIsFriends(true);
    } else setIsFriends(false);
    setData(temp);
    setNumFriends(numTemp.length);
    setIsLoading(false);
  };

  const handleDelete = (friendId: string) => {
    deleteFriend(friendId);
    loadData();
  };

  const handleCreate = (friendId: string) => {
    createFriend(friendId);
    loadData();
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar />
      {Object.keys(data).length !== 0 ? (
        <>
          <View style={styles.topContainer}>
            <IconButton
              icon={'arrow-left'}
              iconColor={Theme.colors.onSurfaceVariant}
              onPress={() => navigation.goBack()}
            />
            <Avatar index={data.avatar} style={styles.avatar} />
            <View style={styles.filler} />
          </View>
          <View style={styles.middleContainer}>
            <View style={styles.infoContainer}>
              <Text variant={'headlineLarge'}>{data.displayName}</Text>
              <Text
                style={{color: Theme.colors.outline}}
                variant={'titleMedium'}>
                {data.username}
              </Text>
              <Text variant="titleMedium" style={{color: Theme.colors.primary}}>
                {numFriends} Friends
              </Text>
            </View>
            <DuoButton
              filled={!isFriends}
              disabled={false}
              stretch={true}
              icon={
                isFriends ? 'account-minus-outline' : 'account-plus-outline'
              }
              backgroundColor={
                isFriends ? Theme.colors.surface : Theme.colors.primary
              }
              backgroundDark={
                isFriends ? Theme.colors.error : Theme.colors.primaryDark
              }
              borderColor={isFriends ? Theme.colors.error : undefined}
              textColor={
                isFriends ? Theme.colors.error : Theme.colors.onPrimary
              }
              onPress={() => {
                isFriends ? handleDelete(userId) : handleCreate(userId);
              }}>
              {isFriends ? 'Remove Friend' : 'Add As Friend'}
            </DuoButton>
            <View style={styles.progressContainer}>
              <Image
                source={require('../assets/ChinaFlag.png')}
                style={styles.Flag}
                resizeMode="contain"
              />
              <View style={styles.progressContainerRight}>
                <Text variant={'titleMedium'}>Chinese</Text>
                <View style={styles.progressBar}>
                  <ProgressBar progress={data.chinese / 24} />
                </View>
              </View>
            </View>
            <View style={styles.progressContainer}>
              <Image
                source={require('../assets/MalaysiaFlag.png')}
                style={styles.Flag}
                resizeMode="contain"
              />
              <View style={styles.progressContainerRight}>
                <Text variant={'titleMedium'}>Malay</Text>
                <View style={styles.progressBar}>
                  <ProgressBar progress={data.malay / 24} />
                </View>
              </View>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
};

export default OtherProfile;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filler: {
    height: Constants.buttonSize,
    width: Constants.buttonSize,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Constants.smallGap,
    paddingBottom: Constants.defaultGap,
  },
  middleContainer: {
    gap: Constants.defaultGap,
    paddingHorizontal: Constants.edgePadding,
  },
  infoContainer: {
    gap: 8,
  },
  progressContainer: {
    height: 80,
    gap: Constants.edgePadding,
    padding: Constants.edgePadding,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Theme.colors.outlineVariant,
    borderRadius: Constants.radiusMedium,
    borderBlockColor: Theme.colors.outlineVariant,
    borderWidth: 1,
  },
  progressContainerRight: {
    gap: 4,
    flex: 1,
    height: 32,
  },
  avatar: {
    overflow: 'hidden',
    borderRadius: 500,
    width: 256,
    height: 256,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Constants.largeGap,
  },
  Flag: {
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
  },
});
