import {View, StyleSheet, Animated} from 'react-native';
import {Button, Text} from 'react-native-paper';
import Theme from '../common/constants/theme.json';
import CustomStatusBar from '../common/CustomStatusBar';

interface ProfileProps {
  route: any;
  navigation: any;
  translate: Animated.Value;
}

const Profile = (props: ProfileProps) => {
  const {route, navigation, translate} = props;
  return (
    <Animated.View
      style={[styles.mainContainer, {transform: [{translateY: translate}]}]}>
      <CustomStatusBar />
      <View>
        <Text>Profile</Text>
        <Button
          mode="outlined"
          onPress={() => {
            navigation.navigate('HomeScreen', {
              screen: 'Profile',
              params: {screen: 'EditProfile'},
            });
          }}>
          Edit
        </Button>
      </View>
    </Animated.View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
  },
});
