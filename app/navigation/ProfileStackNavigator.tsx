import {createNativeStackNavigator} from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';

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
  const userId = auth().currentUser?.uid as string;
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="UserProfile" initialParams={{userId: userId}}>
        {props => <Profile {...props} translate={translate} />}
      </Stack.Screen>
      <Stack.Screen name="EditProfile">
        {props => <EditProfile {...props} translate={translate} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
export default ProfileStackNavigator;
