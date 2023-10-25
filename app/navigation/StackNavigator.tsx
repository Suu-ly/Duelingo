import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';

import Home from '../screens/Home';
import Quiz from '../screens/Quiz';
import QuizEnd from '../screens/QuizEnd';
import Landing from '../screens/Landing';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import BottomTabBar from './BottomTabBar';

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
      <Stack.Screen name="Home" component={BottomTabBar} />
      <Stack.Screen name="Leaderboard" component={BottomTabBar} />
      <Stack.Screen name="Challenge" component={BottomTabBar} />
      <Stack.Screen name="Profile" component={BottomTabBar} />
      <Stack.Screen name="Quiz" component={Quiz} />
      <Stack.Screen name="QuizEnd" component={QuizEnd} />
    </Stack.Navigator>
  );
};
export default StackNavigator;
