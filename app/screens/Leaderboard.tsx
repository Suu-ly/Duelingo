import {View, StyleSheet, Image, ScrollView,Text} from 'react-native';
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
  const [users, setUsers] = useState([]);//initial empty array of users

  //useEffect(() => {
 //   userRef
 //   .onSnapshot(
 //     querySnapshot =>{
  //      const users = []
 //       querySnapshot.forEach((doc)) =>{
  //        const
  //      }
 //     }
 //   )
 // });

  return (
    <View style={styles.mainContainer}>
      <View style={styles.title}>
        <Text style={styles.titleLeaderboard}>Leaderboard</Text>
      </View>
      <View style={styles.scrollbody}>
        <ScrollView>
        <View style={styles.innercontent}>
          <View style={styles.leaderboardFrame}>
              <View style={styles.listitem}><View style={styles.stateLayer}>
                <View style={styles.leadingelement}>
                  <Image source={require('../assets/Duo.png')} style={styles.avatarpic} />
                </View>
                <View style={styles.leaderboardContent}>
                  <Text style={styles.overline}></Text>
                  <Text style={styles.name}>Name</Text>
                  <View style={styles.points}><View style={styles.expContainer}>
                    <Text style={styles.exp}>1000 Points</Text>
                    </View></View>
                </View>
              </View></View>
              <View style={styles.listitem}><View style={styles.stateLayer}>
                <View style={styles.leadingelement}>
                  <Image source={require('../assets/Duo.png')} style={styles.avatarpic} />
                </View>
                <View style={styles.leaderboardContent}>
                  <Text style={styles.overline}></Text>
                  <Text style={styles.name}>Name</Text>
                  <View style={styles.points}><View style={styles.expContainer}>
                    <Text style={styles.exp}>1000 Points</Text>
                    </View></View>
                </View>
              </View></View>
              <View style={styles.listitem}><View style={styles.stateLayer}>
                <View style={styles.leadingelement}>
                  <Image source={require('../assets/Duo.png')} style={styles.avatarpic} />
                </View>
                <View style={styles.leaderboardContent}>
                  <Text style={styles.overline}></Text>
                  <Text style={styles.name}>Name</Text>
                  <View style={styles.points}><View style={styles.expContainer}>
                    <Text style={styles.exp}>1000 Points</Text>
                    </View></View>
                </View>
              </View></View>
              <View style={styles.listitem}><View style={styles.stateLayer}>
                <View style={styles.leadingelement}>
                  <Image source={require('../assets/Duo.png')} style={styles.avatarpic} />
                </View> 
                <View style={styles.leaderboardContent}>
                  <Text style={styles.overline}></Text>
                  <Text style={styles.name}>Name</Text>
                  <View style={styles.points}><View style={styles.expContainer}>
                    <Text style={styles.exp}>1000 Points</Text>
                    </View></View>
                </View>
              </View></View>
              <View style={styles.listitem}><View style={styles.stateLayer}>
                <View style={styles.leadingelement}>
                  <Image source={require('../assets/Duo.png')} style={styles.avatarpic} />
                </View>
                <View style={styles.leaderboardContent}>
                  <Text style={styles.overline}></Text>
                  <Text style={styles.name}>Name</Text>
                  <View style={styles.points}><View style={styles.expContainer}>
                    <Text style={styles.exp}>1000 Points</Text>
                    </View></View>
                </View>
              </View></View> 
              <View style={styles.listitem}><View style={styles.stateLayer}>
                <View style={styles.leadingelement}>
                  <Image source={require('../assets/Duo.png')} style={styles.avatarpic} />
                </View>
                <View style={styles.leaderboardContent}>
                  <Text style={styles.overline}></Text>
                  <Text style={styles.name}>Name</Text>
                  <View style={styles.points}><View style={styles.expContainer}>
                    <Text style={styles.exp}>1000 Points</Text>
                    </View></View>
                </View>
              </View></View> 

          </View>
        </View>
        </ScrollView> 
      </View>
      <Button   
          textColor='black'
          onPress={() => navigation.navigate('Home')}>
          Load More
        </Button>
      <View style={styles.navBar}>  
        <Button 
          style={styles.navBarButton}
          icon="home-variant"
          onPress={() => navigation.navigate('Home')}>
          Home
        </Button>
        <Button 
          style={styles.navBarButton}
          icon="ladder"
          onPress={() => navigation.navigate('Leaderboard')}>
          Leaderboard
        </Button>
        <Button 
          style={styles.navBarButton}
          icon="trophy"
          onPress={() => navigation.navigate('Home')}>
          Challenge
        </Button>
        <Button 
          style={styles.navBarButton}
          icon="account"
          onPress={() => navigation.navigate('Home')}>
          Profile
        </Button>
      </View>
    </View>
  );
};

export default Leaderboard;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    display: 'flex',
    width: 368,
    padding: 0,    // Top
    paddingRight: 32,  // Right
    paddingBottom: 29, // Bottom
    paddingLeft: 50,   // Left
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollbody: {
    flex: 1,                // Equivalent to "display: flex;"
    paddingBottom: 0,        // Equivalent to "padding-bottom: 0px;"
    flexDirection: 'column', // Equivalent to "flex-direction: column;"
    alignItems: 'center',    // Equivalent to "align-items: center;"
    alignSelf: 'stretch',    // Equivalent to "align-self: stretch;"
  },
  innercontent:{
    flex: 1,                // Equivalent to "display: flex;"
    paddingBottom: 0,        // You can specify the fallback value for var() if needed
    flexDirection: 'column', // Equivalent to "flex-direction: column;"
    alignItems: 'center',    // Equivalent to "align-items: center;"
    alignSelf: 'stretch',    // Equivalent to "align-self: stretch;"
    //backgroundColor:'green',
  },
  listitem:{
    flex: 1,                // Equivalent to "display: flex;"
    height: 72,              // Equivalent to "height: 72px;"
    minHeight: 72,           // Equivalent to "min-height: 72px;"
    flexDirection: 'column', // Equivalent to "flex-direction: column;"
    justifyContent: 'center', // Equivalent to "justify-content: center;"
    alignItems: 'center',    // Equivalent to "align-items: center;"
    alignSelf: 'stretch',    // Equivalent to "align-self: stretch;"
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor:'rgba(141, 202, 221, 0.3)',
    //borderRadius: 16,
  },
  stateLayer:{
    flex:1,
    flexDirection: 'row',
    padding: 8,
    paddingHorizontal:16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navBar:{
    flexDirection: 'row',  // Equivalent to "display: flex;"
    width: 412,            // Equivalent to "width: 412px;"
    paddingHorizontal: 8,   // Equivalent to "padding: 0px 8px;"
    alignItems: 'flex-start', // Equivalent to "align-items: flex-start;"
    justifyContent: 'space-between', // To mimic the effect of "gap: 8px;"
    backgroundColor:'#F1F45F5',
  },
  titleLeaderboard: {
    fontFamily: 'Inter',
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    //lineHeight: 20,
    letterSpacing: 0.48,
  },
  leaderboardFrame:{
    display: 'flex',
    width: 368,
    flexDirection: 'column',
    justifyContent:'flex-end',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#FFF',
  },
  avatarpic: {
    flexDirection:'row',
    width: 56,
    height: 56,
    padding: 8,
    justifyContent:'flex-start',
    marginHorizontal: 10,
  },
  name:{
    alignSelf: 'stretch',
    color: '#1D1F22',
    fontFamily: 'Nunito',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  leadingelement:{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  leaderboardContent:{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
  },
  overline:{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
    alignSelf: 'stretch',
  },
  points:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    alignSelf: 'stretch',
  },
  expContainer:{
    display: 'flex',
    height: 20,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    flex: 1,
    overflow:'hidden',
  },
  exp: {
    color: '#40444D',
    fontFamily: 'Roboto',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.25,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  navBarButton:{
    paddingVertical: 12,
    paddingHorizontal: 0,
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
    flex: 1,
  },
});