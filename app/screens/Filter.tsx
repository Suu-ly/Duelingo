import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Text} from 'react-native-paper';
import theme from '../common/constants/theme.json';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';

interface FilterProps {
  route: any;
  navigation: any;
}

const Filter = (props: FilterProps) => {
  const {route, navigation} = props;
  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar />
      <View style={styles.container}>
        <Text variant={'headlineLarge'}>Filter</Text>
        <Button
          icon="map-marker-outline"
          mode="contained"
          onPress={() => navigation.navigate('Home')}>
          Go to Home
        </Button>
      </View>
    </View>
  );
};

export default Filter;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: Constants.edgePadding,
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    gap: Constants.defaultGap,
    paddingVertical: 24,
    borderRadius: 28,
    backgroundColor: theme.colors.elevation.level1,
  },
});
