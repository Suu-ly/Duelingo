import * as React from 'react';
import {useEffect, useState} from 'react';
import {View, StyleSheet, Animated, FlatList, Image} from 'react-native';
import {Text, List} from 'react-native-paper';
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
  const [data, setData] = useState({
    items: [
      {
        id: '1',
        title: 'first item',
        description: 'test 1',
      },
      {
        id: '2',
        title: 'second item',
        description: 'test 2',
      },
      {
        id: '3',
        title: 'third item',
        description: 'test 3',
      },
    ],
  });
  const [users, setUserID] = useState([]); //initial empty array of users
  const [avatar, setAvatar] = useState([]); //initial empty array of Avatar (Numbers)
  const [exp, setExp] = useState([]); //
  //avatar change
  //userid change
  //exp change
  //color change 1 gold 2 sliver 3 bronze, 4 onwards black
  //set array, extract data from database, compare exp, highest one will be slotted into first view
  //

  const item = ({title}) => (
    <React.Fragment>
      <View style={styles.friendCardscontainer}>
        <View style={styles.cardContentcontainer}>
          {' '}
          <Text style={styles.postion1Text}>1</Text>
          <Image
            source={require('../assets/Avatars/1.png')}
            style={styles.avatarpic}
          />
          <View style={styles.cardItems}>
            <Text style={styles.name}>Lance</Text>
            <Text style={styles.exp}>438 exp</Text>
          </View>
        </View>
      </View>
    </React.Fragment>
  );
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
          data={data.items}
          renderItem={({item}) => (
            <List.Item
              title={item.title}
              description={item.description}
              left={props => <List.Icon {...props} icon="folder" />}
            />
          )}
          keyExtractor={item => item.id}
        />
      </View>
      <React.Fragment>
        <View style={styles.friendCardscontainer}>
          <View style={styles.cardContentcontainer}>
            <Text style={styles.postion1Text}>1</Text>
            <Image
              source={require('../assets/Avatars/1.png')}
              style={styles.avatarpic}
            />
            <View style={styles.cardItems}>
              <Text style={styles.name}>Lance</Text>
              <Text style={styles.exp}>438 exp</Text>
            </View>
          </View>
        </View>
      </React.Fragment>
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
  postion2Text: {
    width: 14,
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
    width: 14,
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
    width: 14,
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
//<React.Fragment>
//    <View style={styles.friendCardscontainer}>
//       <View style={styles.cardContentcontainer}>
//        <Text style={styles.postion1Text}>1</Text>
//        <Image
//          source={require('../assets/Avatars/1.png')}
//          style={styles.avatarpic}
//      />
//    <View style={styles.cardItems}>
//         <Text style={styles.name}>Lance</Text>
//        <Text style={styles.exp}>438 exp</Text>
//     </View>
//  </View>
// </View>
//</React.Fragment>
//);
