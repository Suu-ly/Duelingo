import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Text} from 'react-native-paper';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import theme from '../common/constants/theme.json';

interface SettingsProps {
  route: any;
  navigation: any;
}

import {UpdateHearts, UpdateExp, UpdateUsername} from '../utils/users';

const Settings = (props: SettingsProps) => {
  const {route, navigation} = props;

  const username = 'yuhao2';
  const username2 = 'new username';
  const exp = 100;
  const [Hearts, setHearts] = useState<number>(4);

  const MinusHeart = () => {
    setHearts(Hearts - 1);
  };

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar />
      <View style={styles.container}>
        <Text variant={'headlineLarge'}>Settings Screen</Text>
        <Button
          mode="outlined"
          onPress={() => {
            MinusHeart;
            UpdateHearts(username, Hearts);
          }}>
          Update heart
        </Button>
        <Button
          mode="outlined"
          onPress={() => {
            UpdateExp(username, exp);
          }}>
          Update EXP
        </Button>
        <Button
          mode="outlined"
          onPress={() => {
            UpdateUsername(username, username2);
          }}>
          Update Username
        </Button>
      </View>
    </View>
  );
};

export default Settings;

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
