import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import CustomStatusBar from '../common/CustomStatusBar';

interface LeaderboardProps {
  route: any;
  navigation: any;
}

const Leaderboard = (props: LeaderboardProps) => {
  const {route, navigation} = props;
  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar />
      <View>
        <Text>Leaderboard</Text>
      </View>
    </View>
  );
};

export default Leaderboard;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
});
