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
  UpdateUsername,
  DeleteUserdata,
  UpdateMalayMod,
  UpdateChineseMod,
  ResetModules,
} from '../utils/users';

import {deleteAccount} from '../utils/auth';

const Settings = (props: SettingsProps) => {
  const {route, navigation} = props;

  // const [Hearts, setHearts] = useState<number>(5);
  // const [Exp, setExp] = useState<number>(0);
  // const [chineseMod, setchineseMod] = useState(0);
  // const [malayMod, setmalayMod] = useState<number>(0);

  const username = 'new username';
  var Hearts = 0;
  var chinese = 0;
  var malay = 0;
  var Exp = 0;

  const MinusHeart = () => {
    if (Hearts > 0) {
      Hearts--;
    }
  };

  const IncreaseExp = () => {
    Exp = Exp + 100;
  };

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar />
      <View style={styles.container}>
        <Text variant={'headlineLarge'}>Settings Screen</Text>
        <Button
          mode="outlined"
          onPress={() => {
            Hearts = 5;
            UpdateHearts(Hearts);
            console.log(Hearts);
          }}>
          Revive hearts
        </Button>
        <Button
          mode="outlined"
          onPress={() => {
            MinusHeart();
            UpdateHearts(Hearts);
            console.log(Hearts);
          }}>
          Update heart
        </Button>
        <Button
          mode="outlined"
          onPress={() => {
            IncreaseExp();
            UpdateExp(Exp);
          }}>
          Update EXP
        </Button>
        <Button
          mode="outlined"
          onPress={() => {
            Exp = 0;
            UpdateExp(Exp);
          }}>
          Reset EXP
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
            // malay = malay + 1;
            // UpdateModules(chinese, malay);
            // console.log('Chinese:' + chinese);
            // console.log('Malay:' + malay);
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
            UpdateMalayMod();
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
