import {createNativeStackNavigator} from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';

import UserProfile from '../screens/UserProfile';
import EditProfile from '../screens/EditProfile';
import Settings from '../screens/Settings';
import Friends from '../screens/Friends';
import AddFriends from '../screens/AddFriends';
import {Animated} from 'react-native';

const Stack = createNativeStackNavigator();

interface ProfileStackProps {
  navigation: any;
  route: any;
  translate: Animated.Value;
  opacity: Animated.Value;
}

const ProfileStackNavigator = (props: ProfileStackProps) => {
  const {translate, opacity} = props;
  const userId = auth().currentUser?.uid as string;
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        freezeOnBlur: true,
      }}>
      <Stack.Screen name="UserProfile" initialParams={{userId: userId}}>
        {props => (
          <UserProfile {...props} translate={translate} opacity={opacity} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Settings">
        {props => (
          <Settings {...props} translate={translate} opacity={opacity} />
        )}
      </Stack.Screen>
      <Stack.Screen name="EditProfile">
        {props => (
          <EditProfile {...props} translate={translate} opacity={opacity} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Friends">
        {props => (
          <Friends {...props} translate={translate} opacity={opacity} />
        )}
      </Stack.Screen>
      <Stack.Screen name="AddFriends">
        {props => (
          <AddFriends {...props} translate={translate} opacity={opacity} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
export default ProfileStackNavigator;
