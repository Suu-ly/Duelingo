import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';

import Debug from '../screens/Debug';
import Quiz from '../screens/Quiz';
import QuizEnd from '../screens/QuizEnd';
import Landing from '../screens/Landing';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import TabNavigator from './TabNavigator';
import Lobby from '../screens/Lobby';
import Multiplayer from '../screens/Multiplayer';
import OtherProfile from '../screens/OtherProfile';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="HomeScreen" component={TabNavigator} />
      <Stack.Screen name="OtherProfile" component={OtherProfile} />
      <Stack.Screen name="Debug" component={Debug} />
      <Stack.Screen name="Lobby" component={Lobby} />
      <Stack.Screen name="Multiplayer" component={Multiplayer} />
      <Stack.Screen name="Quiz" component={Quiz} />
      <Stack.Screen name="QuizEnd" component={QuizEnd} />
    </Stack.Navigator>
  );
};
export default StackNavigator;
