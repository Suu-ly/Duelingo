import * as React from 'react';
import {useEffect, useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  StyleSheet,
  Animated,
  FlatList,
  Image,
  RefreshControl,
} from 'react-native';
import {Text, List} from 'react-native-paper';
import CustomStatusBar from '../common/CustomStatusBar';
import Theme from '../common/constants/theme.json';
import Constants from '../common/constants/Constants';
import {getLeaderboardData, numUsers} from '../utils/database';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import Avatar from '../common/Avatar';

interface LeaderboardProps {
  route: any;
  navigation: any;
  translate: Animated.Value;
}
type numUser = number;
const limit = 11;

const Leaderboard = (props: LeaderboardProps) => {
  const {route, navigation, translate} = props;
  const [leaderboardList, setLeaderboardList] = useState<
    FirebaseFirestoreTypes.DocumentData[] | null
  >(null);
  const [numberUsers, setnumUsers] = useState();
  //color change 1 gold 2 sliver 3 bronze, 4 onwards black

  const getleaderboardList = async () => {
    let userDetails: FirebaseFirestoreTypes.DocumentData[] =
      await getLeaderboardData();
    setLeaderboardList(userDetails);
  };

  const onEndReached = () => console.log('End reached');

  useFocusEffect(
    useCallback(() => {
      getleaderboardList();
    }, []),
  );
  const getStyleForIndex = (i: numUser) => {
    if (i === 0) {
      return styles.postion1Text;
    } else if (i === 1) {
      return styles.postion2Text;
    } else if (i === 2) {
      return styles.postion3Text;
    } else {
      return styles.postionText;
    }
  };
  const pageNumber = () => {};
  return (
    <Animated.View
      style={[styles.mainContainer, {transform: [{translateY: translate}]}]}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Leaderboard</Text>
        <Text
          variant="bodyMedium"
          style={{color: Theme.colors.onSurfaceVariant}}>
          See how you compare against other players!
        </Text>
      </View>
      <View style={styles.cardContainer}>
        <FlatList
          data={leaderboardList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <View style={styles.friendCardscontainer}>
              <View style={styles.cardContentcontainer}>
                <Text key={index} style={getStyleForIndex(index)}>
                  {index + 1}
                </Text>
                <Avatar index={item.avatar} style={styles.avatarpic} />
                <View style={styles.cardItems}>
                  <Text style={styles.name}>{item.username}</Text>
                  <Text style={styles.exp}>{item.exp}</Text>
                </View>
              </View>
            </View>
          )}
          onEndReached={onEndReached}
        />
      </View>
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
  cardContainer: {
    gap: Constants.largeGap,
    paddingHorizontal: Constants.edgePadding,
    height: 500,
  },
  friendCardscontainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    //paddingVertical: 12, // Simulates the gap between elements
  },
  cardContentcontainer: {
    padding: 16, // Replaces var(--Edge-Padding, 16px)
    flexDirection: 'row',
    alignItems: 'center', // Replaces gap: 12px
    borderRadius: 16,
    backgroundColor: '#FFF', // Replaces background: var(--light-surface-container-elevation-0, #FFF)
  },
  postion1Text: {
    width: 28,
    flexShrink: 0,
    color: '#E58C06',
    textAlign: 'center',
    fontFamily: 'Roboto',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 24, // 150% line-height
    letterSpacing: 0.15,
  },
  postion2Text: {
    width: 28,
    flexShrink: 0,
    color: '#C0C0C0',
    textAlign: 'center',
    fontFamily: 'Roboto',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 24, // 150% line-height
    letterSpacing: 0.15,
  },
  postion3Text: {
    width: 28,
    flexShrink: 0,
    color: '#CD7F32',
    textAlign: 'center',
    fontFamily: 'Roboto',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 24, // 150% line-height
    letterSpacing: 0.15,
  },
  postionText: {
    width: 28,
    flexShrink: 0,
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'Roboto',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 24, // 150% line-height
    letterSpacing: 0.15,
  },
  avatarpic: {
    display: 'flex',
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    borderRadius: 50,
    marginHorizontal: 12,
  },
  cardItems: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  name: {
    color: '#181C1C', // Replaces var(--light-on-surface, #181C1C)
    textAlign: 'center',
    fontFamily: 'Roboto',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 24, // 150% line-height
    letterSpacing: 0.15,
  },
  exp: {
    color: '#181C1C', // Replaces var(--light-on-surface, #181C1C)
    textAlign: 'center',
    fontFamily: 'Roboto',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 24, // 150% line-height
    letterSpacing: 0.5,
  },
});
