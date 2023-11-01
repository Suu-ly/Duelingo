import * as React from 'react';
import {useEffect, useState} from 'react';
import {View, StyleSheet, Animated, FlatList, Image} from 'react-native';
import {Text} from 'react-native-paper';
import CustomStatusBar from '../common/CustomStatusBar';
import Theme from '../common/constants/theme.json';
import Constants from '../common/constants/Constants';

interface LeaderboardProps {
  route: any;
  navigation: any;
  translate: Animated.Value;
}

const Leaderboard = (props: LeaderboardProps) => {
  const {route, navigation, translate} = props;
  const[data, setData] = useState([{}]);
  const [users, setUserID] = useState([]);//initial empty array of users
  const[avatar, setAvatar] = useState([]);//initial empty array of Avatar (Numbers)
  const[exp, setExp] = useState([]);//
  //avatar change
  //userid change
  //exp change
  //color change 1 gold 2 sliver 3 bronze, 4 onwards black
  //set array, extract data from database, compare exp, highest one will be slotted into first view
  //

  const renderItem = () => {
    return(
      <View style={styles.friendCardscontainer}>
        <View style={styles.cardContentcontainer}>
          <Text style={styles.postionText}>1</Text>
          <Image source={require('../assets/Avatars/1.png')} style={styles.avatarpic} />
          <View style={styles.cardItems}>
            <Text style={styles.name}>Lance</Text>
            <Text style={styles.exp}>438 exp</Text>
          </View>
        </View> 
      </View>
    )
   }
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
          data={data}
          renderItem={renderItem}
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
    display: 'flex',
    width: 412,
    paddingTop: 0, // Replaces padding-top: 0px
    paddingBottom: 96, // Replaces padding-bottom: 96px
    paddingHorizontal: 16, // Replaces var(--Edge-Padding, 16px)
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginVertical: 16, // Replaces gap: var(--Edge-Padding, 16px)
  }, 
  friendCardscontainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    //paddingVertical: 12, // Simulates the gap between elements
  },
  cardContentcontainer: {
    width: 380,
    padding: 16, // Replaces var(--Edge-Padding, 16px)
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12, // Replaces gap: 12px
    borderRadius: 16,
    backgroundColor: '#FFF', // Replaces background: var(--light-surface-container-elevation-0, #FFF)
  },
  postionText: {
    width: 14,
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



