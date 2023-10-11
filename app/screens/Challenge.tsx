import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';

import CustomStatusBar from '../common/CustomStatusBar';

interface ChallengeProps {
  route: any;
  navigation: any;
}

const Challenge = (props: ChallengeProps) => {
  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar />

      <View>
        <Text>Challenge</Text>
      </View>
    </View>
  );
};

export default Challenge;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
});
