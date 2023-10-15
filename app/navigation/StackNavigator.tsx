import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';

import Filter from '../screens/Filter';
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
      <Stack.Screen name="Filter" component={BottomTabBar} />
      {/* <Stack.Screen name="Challenge" component={BottomTabBar} /> */}
      <Stack.Screen name="Profile" component={BottomTabBar} />
      {/* <Stack.Screen name="Filter" component={Filter} /> */}
    </Stack.Navigator>
  );
};
export default StackNavigator;
