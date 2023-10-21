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
  const [Hearts, setHearts] = useState<number>(5);
  const [Exp, setExp] = useState<number>(0);

  const MinusHeart = () => {
    if (Hearts > 0) {
      setHearts(Hearts - 1);
    }
  };

  const IncreaseExp = () => {
    setExp(Exp + 100);
  };

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar />
      <View style={styles.container}>
        <Text variant={'headlineLarge'}>Settings Screen</Text>
        <Button
          mode="outlined"
          onPress={() => {
            setHearts(5);
            console.log(Hearts);
          }}>
          Revive hearts
        </Button>
        <Button
          mode="outlined"
          onPress={() => {
            MinusHeart();
            UpdateHearts(username, Hearts);
            console.log(Hearts);
          }}>
          Update heart
        </Button>
        <Button
          mode="outlined"
          onPress={() => {
            IncreaseExp();
            UpdateExp(username, Exp);
          }}>
          Update EXP
        </Button>
        <Button
          mode="outlined"
          onPress={() => {
            setExp(0);
          }}>
          Reset EXP
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
