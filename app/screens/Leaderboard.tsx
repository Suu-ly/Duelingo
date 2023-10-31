import * as React from 'react';
import {View, StyleSheet, Animated} from 'react-native';
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
});
