import {useState, useCallback} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  ScrollView,
} from 'react-native';
import {
  ActivityIndicator,
  IconButton,
  ProgressBar,
  Text,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import Theme from '../common/constants/theme.json';
import {getUserData, getFriendList} from '../utils/database';
import Avatar from '../common/Avatar';
import {useFocusEffect} from '@react-navigation/native';

interface UserProfileProps {
  route: any;
  navigation: any;
  translate: Animated.Value;
  opacity: Animated.Value;
}

const UserProfile = (props: UserProfileProps) => {
  const {route, navigation, translate, opacity} = props;
  const [data, setData] = useState<Record<string, any>>({});
  const [numFriends, setNumFriends] = useState(0);

  const ownUserId = auth().currentUser?.uid as string;

  const loadData = async () => {
    let temp = await getUserData(ownUserId);
    let numTemp = await getFriendList(ownUserId);
    setData(temp);
    setNumFriends(numTemp.length);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  return (
    <Animated.View
      style={[
        styles.mainContainer,
        {transform: [{translateY: translate}], opacity: opacity},
      ]}>
      <CustomStatusBar />
      {Object.keys(data).length !== 0 ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.contentContainerScroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.topContainer}>
            <View style={styles.filler} />
            <Avatar index={data.avatar} style={styles.avatar} />
            <IconButton
              icon={'cog-outline'}
              iconColor={Theme.colors.onSurfaceVariant}
              onPress={() => navigation.navigate('Settings', {userData: data})}
            />
          </View>
          <View style={styles.middleContainer}>
            <View style={styles.infoContainer}>
              <Text variant={'headlineLarge'}>{data.displayName}</Text>
              <Text
                style={{color: Theme.colors.outline}}
                variant={'titleMedium'}>
                {data.username}
              </Text>
              <TouchableOpacity
                hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
                onPress={() =>
                  navigation.navigate('Friends', {userData: data})
                }>
                <Text
                  variant="titleMedium"
                  style={{color: Theme.colors.primary}}>
                  {numFriends}
                  {numFriends === 0 || numFriends === 1
                    ? ' Friend'
                    : ' Friends'}
                </Text>
              </TouchableOpacity>
            </View>
            <DuoButton
              filled={true}
              disabled={false}
              stretch={true}
              icon={'account-plus-outline'}
              backgroundColor={Theme.colors.primary}
              backgroundDark={Theme.colors.primaryDark}
              borderColor={Theme.colors.primary}
              textColor={Theme.colors.onPrimary}
              onPress={() => navigation.navigate('AddFriends')}>
              Add Friends
            </DuoButton>
            <View style={styles.progressContainer}>
              <Icon
                name="star-four-points-outline"
                size={48}
                color={Theme.colors.tertiary}
              />
              <View>
                <Text
                  variant="headlineSmall"
                  style={{color: Theme.colors.tertiary}}>
                  {data.exp}
                </Text>
                <Text
                  variant="labelLarge"
                  style={{color: Theme.colors.onSurfaceVariant}}>
                  Total Exp
                </Text>
              </View>
            </View>
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
        </ScrollView>
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      )}
    </Animated.View>
  );
};

export default UserProfile;

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
  },
  progressBar: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
  },
  contentContainerScroll: {
    flexGrow: 1,
    paddingBottom: Constants.edgePadding,
  },
});
