import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Text} from 'react-native-paper';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import theme from '../common/constants/theme.json';

interface HomeProps {
  route: any;
  navigation: any;
}

const Home = (props: HomeProps) => {
  const {route, navigation} = props;

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar />
      <View style={styles.container}>
        <Text variant={'headlineLarge'}>Home Screen</Text>
        <Button
          mode="outlined"
          onPress={() =>
            navigation.navigate('Quiz', {
              language: 'chinese',
              difficulty: 'easy',
              questionNo: 0,
              remaining: 4,
            })
          }>
          Go to Easy Quiz
        </Button>
        <Button
          mode="outlined"
          onPress={() =>
            navigation.navigate('Quiz', {
              language: 'chinese',
              difficulty: 'intermediate',
              questionNo: 0,
              remaining: 4,
            })
          }>
          Go to Intermediate Quiz
        </Button>
        <Button
          mode="outlined"
          onPress={() =>
            navigation.navigate('Quiz', {
              language: 'chinese',
              difficulty: 'hard',
              questionNo: 0,
              remaining: 4,
            })
          }>
          Go to Hard Quiz
        </Button>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Constants.defaultGap,
    paddingHorizontal: Constants.edgePadding,
  },
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Constants.mediumGap,
    justifyContent: 'center',
  },
});
