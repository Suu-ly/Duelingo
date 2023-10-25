import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import CustomStatusBar from '../common/CustomStatusBar';

interface ProfileProps {
  route: any;
  navigation: any;
}

const Profile = (props: ProfileProps) => {
  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar />

      <View>
        <Text>Profile</Text>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
});
