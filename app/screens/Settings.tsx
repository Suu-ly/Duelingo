import {Appbar} from 'react-native-paper';
import {List} from 'react-native-paper';
import {StyleSheet, Animated} from 'react-native';

import {signOut} from '../utils/auth';
import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import Theme from '../common/constants/theme.json';

interface SettingsProps {
  route: any;
  navigation: any;
  translate: Animated.Value;
  opacity: Animated.Value;
}

const Settings = (props: SettingsProps) => {
  const {route, navigation, translate, opacity} = props;
  const data = route.params.userData;

  return (
    <Animated.View
      style={[
        styles.mainContainer,
        {transform: [{translateY: translate}], opacity: opacity},
      ]}>
      <Appbar.Header mode={'large'}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Settings" />
      </Appbar.Header>

      <List.Item
        title="Profile"
        style={styles.listItem}
        onPress={() => navigation.navigate('EditProfile', {userData: data})}
        description="Edit profile details"
        left={props => (
          <List.Icon
            color={Theme.colors.onSurfaceVariant}
            icon="account-outline"
          />
        )}
      />
      <List.Item
        title="Friends"
        style={styles.listItem}
        onPress={() => navigation.navigate('Friends', {userData: data})}
        description="Add or remove friends"
        left={props => (
          <List.Icon
            color={Theme.colors.onSurfaceVariant}
            icon="account-group-outline"
          />
        )}
      />
      <List.Item
        title="Sign Out"
        style={styles.listItem}
        onPress={() => signOut()}
        left={props => <List.Icon color={Theme.colors.error} icon="logout" />}
      />
    </Animated.View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
  },
  listItem: {
    paddingLeft: Constants.edgePadding,
    paddingRight: Constants.defaultGap,
    paddingVertical: Constants.mediumGap,
  },
});
