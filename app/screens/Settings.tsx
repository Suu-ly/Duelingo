import React from 'react';
import {Appbar} from 'react-native-paper';
import {List, MD3Colors} from 'react-native-paper';
import {Avatar, Card, IconButton} from 'react-native-paper';
import {View, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import theme from '../common/constants/theme.json';

interface SettingsProps {
  route: any;
  navigation: any;
}

const Settings = (props: SettingsProps) => {
  //settings Title
  const {route, navigation} = props;

  const _goBack = () => console.log('Went back');

  const _handleSearch = () => console.log('Searching');

  const _handleMore = () => console.log('Shown more');

  return (
    <>
      <>
        <>
          <>
            <>
              <Appbar.Header mode={'large'}>
                <Appbar.BackAction onPress={_goBack} />
                <Appbar.Content title="Settings" />
              </Appbar.Header>
            </>

            <List.Item
              title="Profile"
              style={styles.listItem}
              onPress={() => console.log('Pressed')}
              description="Edit profile details"
              left={props => (
                <List.Icon
                  color={theme.colors.onSurfaceVariant}
                  icon="account-outline"
                />
              )}
            />
          </>
          <List.Item
            title="Friends"
            style={styles.listItem}
            onPress={() => console.log('Pressed')}
            description="Add or remove friends"
            left={props => (
              <List.Icon
                color={theme.colors.onSurfaceVariant}
                icon="account-group-outline"
              />
            )}
          />
        </>

        <List.Item
          title="Sign Out"
          style={styles.listItem}
          onPress={() => console.log('Pressed')}
          left={props => (
            <List.Icon color={theme.colors.onSurfaceVariant} icon="logout" />
          )}
        />
      </>
      <></>
    </>
  );
};

export default Settings;

const styles = StyleSheet.create({
  listItem: {
    paddingLeft: Constants.edgePadding,
    paddingRight: Constants.defaultGap,
    paddingVertical: Constants.mediumGap,
  },
});
