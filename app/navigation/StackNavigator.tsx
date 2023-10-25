import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';

import Debug from '../screens/Debug';
import Quiz from '../screens/Quiz';
import QuizEnd from '../screens/QuizEnd';
import Landing from '../screens/Landing';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import BottomTabBar from './BottomTabBar';
import Lobby from '../screens/Lobby';
import Multiplayer from '../screens/Multiplayer';
import Challenge from '../screens/Challenge';

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
      <Stack.Screen name="Debug" component={Debug} />
      <Stack.Screen name="Challenge" component={Challenge} />
      <Stack.Screen name="Lobby" component={Lobby} />
      <Stack.Screen name="Multiplayer" component={Multiplayer} />
      <Stack.Screen name="Home" component={BottomTabBar} />
      <Stack.Screen name="Leaderboard" component={BottomTabBar} />
      <Stack.Screen name="Profile" component={BottomTabBar} />
      <Stack.Screen name="Quiz" component={Quiz} />
      <Stack.Screen name="QuizEnd" component={QuizEnd} />
    </Stack.Navigator>
  );
};
export default StackNavigator;
