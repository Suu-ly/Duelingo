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

import {
  UpdateHearts,
  UpdateExp,
  UpdateDisplayname,
  DeleteUserdata,
  UpdateMalayMod,
  UpdateChineseMod,
  ResetModules,
  ResetHearts,
  ResetExp,
  UpdateTimestamp,
  AddHearts,
  SingleUpdateExp,
  UpdateUsername,
  UpdateAvatar,
} from '../utils/users';

import {deleteAccount} from '../utils/auth';

const Settings = (props: SettingsProps) => {
  const {route, navigation} = props;

  const username = 'xianlong';
  const displayname = 'new displayname';

  var score = 1000;
  var difficulty = 'hard';
  var module = 2;
  var topic = 7;

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar />
      <View style={styles.container}>
        <Text variant={'headlineLarge'}>Settings Screen</Text>
        <Button
          mode="outlined"
          onPress={() => {
            ResetHearts();
          }}>
          Revive hearts
        </Button>
        <Button
          mode="outlined"
          onPress={() => {
            UpdateHearts();
          }}>
          Update heart
        </Button>
        <Button
          mode="outlined"
          onPress={() => {
            UpdateExp(difficulty, score);
          }}>
          Update EXP
        </Button>
        <Button
          mode="outlined"
          onPress={() => {
            ResetExp();
          }}>
          Reset EXP
        </Button>
        <Button
          mode="outlined"
          onPress={() => {
            UpdateDisplayname(displayname);
          }}>
          Update Displayname
        </Button>
        <Button
          mode="outlined"
          onPress={() => {
            UpdateUsername(username);
          }}>
          Update Username
        </Button>
        <Button
          mode="outlined"
          onPress={() => {
            // chinese = chinese + 1;
            // UpdateModules(chinese, malay);
            // console.log('Chinese:' + chinese);
            // console.log('Malay:' + malay);
            UpdateChineseMod();
          }}>
          Update Chinese Modules
        </Button>
        <Button
          mode="outlined"
          onPress={() => {
            UpdateMalayMod();
          }}>
          Update Malay Modules
        </Button>
        <Button
          mode="outlined"
          onPress={() => {
            ResetModules();
          }}>
          Reset Modules
        </Button>
        <Button
          mode="outlined"
          onPress={() => {
            navigation.navigate('Landing');
            deleteAccount();
            DeleteUserdata();
          }}>
          Delete Account
        </Button>
        <Button
          mode="outlined"
          onPress={() => {
            UpdateAvatar(5);
          }}>
          Test
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
