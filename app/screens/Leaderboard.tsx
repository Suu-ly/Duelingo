import {View, StyleSheet, Image, FlatList, Text} from 'react-native';
import {Button} from 'react-native-paper';
import React, {useEffect,useState} from 'react';
import database from '@react-native-firebase/database';


import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import theme from '../common/constants/theme.json';

interface LeaderboardProps {
  route: any;
  navigation: any;
}

const Leaderboard = (props: LeaderboardProps) => {
  const {route, navigation} = props;
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
              <Image source={require('../assets/Duo.png')} style={styles.avatarpic} />
              <View style={styles.cardItems}>
                <Text style={styles.name}>Lance</Text>
                <Text style={styles.exp}>438 exp</Text>
              </View>
            </View> 
          </View>
  )
 }
  return (
    <View style={styles.mainContainer}>
        <View style={styles.leadingIcons}></View>
        <View style={styles.headline}></View> 
        <View style={styles.cardContainer}>
          <FlatList
          data={data}
          renderItem={renderItem}
          />
        </View>
    </View>
  );
};

export default Leaderboard;

const styles = StyleSheet.create({
    mainContainer:{
        width: 412,
        height: 892,
    },
    leadingIcons: {
        display: 'flex',
        width: 412,
        paddingVertical: 8, // Replaces padding: 8px
        paddingHorizontal: 16, // Replaces var(--Edge-Padding, 16px)
        justifyContent: 'space-between',
        alignItems: 'center',
      },
    headline: {
        display: 'flex',
        width: 412,
        padding: 32,
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 20, // Replaces var(--Edge-Padding, 16px)
        marginHorizontal: 16, // Replaces var(--Edge-Padding, 16px)
        marginTop: 20, // Replaces var(--Edge-Padding, 16px)
        justifyContent: 'flex-start',
        gap: 8,
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