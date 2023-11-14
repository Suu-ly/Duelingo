import {useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {View, StyleSheet, Animated, FlatList} from 'react-native';
import {ActivityIndicator, Text, TouchableRipple} from 'react-native-paper';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import Theme from '../common/constants/theme.json';
import Constants from '../common/constants/Constants';
import {getLeaderboardData} from '../utils/database';
import Avatar from '../common/Avatar';

interface LeaderboardProps {
  route: any;
  navigation: any;
  translate: Animated.Value;
  opacity: Animated.Value;
}

const Leaderboard = (props: LeaderboardProps) => {
  const {route, navigation, translate, opacity} = props;
  const [leaderboardList, setLeaderboardList] = useState<
    FirebaseFirestoreTypes.DocumentData[] | null
  >(null);
  const ownUserId = auth().currentUser!.uid;

  const getleaderboardList = async () => {
    let userDetails: FirebaseFirestoreTypes.DocumentData[] =
      await getLeaderboardData();
    setLeaderboardList(userDetails);
  };

  useFocusEffect(
    useCallback(() => {
      getleaderboardList();
    }, []),
  );

  const getStyleForIndex = (i: number) => {
    if (i === 0) {
      return styles.postion1Text;
    } else if (i === 1) {
      return styles.postion2Text;
    } else if (i === 2) {
      return styles.postion3Text;
    } else {
      return;
    }
  };

  const cardOnPress = (userId: string) => {
    if (userId === ownUserId) {
      navigation.navigate('Profile', {screen: 'UserProfile'});
    } else navigation.navigate('OtherProfile', {userId: userId});
  };

  return (
    <Animated.View
      style={[
        styles.mainContainer,
        {transform: [{translateY: translate}], opacity: opacity},
      ]}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Leaderboard</Text>
        <Text
          variant="bodyMedium"
          style={{color: Theme.colors.onSurfaceVariant}}>
          See how you compare against other players!
        </Text>
      </View>
      {leaderboardList ? (
        <FlatList
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          data={leaderboardList}
          renderItem={({item, index}) => (
            <View style={styles.card}>
              <TouchableRipple
                style={styles.ripple}
                onPress={() => cardOnPress(item.uid)}>
                <>
                  <Text
                    variant="titleMedium"
                    style={[styles.text, getStyleForIndex(index)]}>
                    {index + 1}
                  </Text>
                  <Avatar index={item.avatar} style={styles.avatarpic} />
                  <View style={styles.cardInfo}>
                    <Text variant="titleMedium">{item.username}</Text>
                    <Text variant="bodyLarge">{item.exp + ' exp'}</Text>
                  </View>
                </>
              </TouchableRipple>
            </View>
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

export default Leaderboard;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
  },
  header: {
    paddingHorizontal: Constants.edgePadding,
    paddingTop: Constants.edgePadding * 2,
    paddingBottom: 20,
    gap: Constants.mediumGap,
  },
  list: {
    gap: Constants.largeGap,
    padding: Constants.edgePadding,
    paddingTop: 0,
  },
  card: {
    backgroundColor: Theme.colors.elevation.level0,
    borderRadius: Constants.radiusLarge,
    overflow: 'hidden',
  },
  ripple: {
    padding: Constants.edgePadding,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Constants.largeGap,
  },
  text: {
    width: 28,
    textAlign: 'center',
  },
  postion1Text: {
    backgroundColor: '#E58C06',
    borderRadius: Constants.radiusMedium,
    color: Theme.colors.onPrimary,
  },
  postion2Text: {
    backgroundColor: '#848E8E',
    borderRadius: Constants.radiusMedium,
    color: Theme.colors.onPrimary,
  },
  postion3Text: {
    backgroundColor: '#BC8054',
    borderRadius: Constants.radiusMedium,
    color: Theme.colors.onPrimary,
  },
  avatarpic: {
    borderRadius: 256,
    width: 48,
    height: 48,
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Constants.largeGap,
  },
});
