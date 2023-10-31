import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Profile from '../screens/Profile';
import EditProfile from '../screens/EditProfile';
import SelectAvatar from '../screens/SelectAvatar';
import {Animated} from 'react-native';

const Stack = createNativeStackNavigator();

interface ProfileStackProps {
  navigation: any;
  route: any;
  translate: Animated.Value;
}

const ProfileStackNavigator = (props: ProfileStackProps) => {
  const {translate} = props;
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="UserProfile">
        {props => <Profile {...props} translate={translate} />}
      </Stack.Screen>
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="SelectAvatar" component={SelectAvatar} />
    </Stack.Navigator>
  );
};
export default ProfileStackNavigator;
