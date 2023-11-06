import {createNativeStackNavigator} from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';

import UserProfile from '../screens/UserProfile';
import EditProfile from '../screens/EditProfile';
import Settings from '../screens/Settings';
import {Animated} from 'react-native';

const Stack = createNativeStackNavigator();

interface ProfileStackProps {
  navigation: any;
  route: any;
  translate: Animated.Value;
}

const ProfileStackNavigator = (props: ProfileStackProps) => {
  const {translate} = props;
  const userId = auth().currentUser?.uid as string;
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        freezeOnBlur: true,
      }}>
      <Stack.Screen name="UserProfile" initialParams={{userId: userId}}>
        {props => <UserProfile {...props} translate={translate} />}
      </Stack.Screen>
      <Stack.Screen name="Settings">
        {props => <Settings {...props} translate={translate} />}
      </Stack.Screen>
      <Stack.Screen name="EditProfile">
        {props => <EditProfile {...props} translate={translate} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
export default ProfileStackNavigator;
