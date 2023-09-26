import React, { useState, useEffect } from 'react';
import {View, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, StyleSheet} from 'react-native';
import {Button, Text} from 'react-native-paper';
import database from '@react-native-firebase/database';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import theme from '../common/constants/theme.json';

interface WaitingProps {
    route: any;
    navigation: any;
}

const Waiting = (props: WaitingProps) => {
  const {route, navigation} = props;
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text variant={'headlineLarge'}>Waiting Screen</Text>
        <Button
          icon="map-marker-outline"
          mode="outlined"
          onPress={() => navigation.navigate('Home')}>
          Go to Home
        </Button>
      </View>
    </View>
  )
}

export default Waiting;

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
  text:{
    color:'black',
    fontSize:20
  }
});