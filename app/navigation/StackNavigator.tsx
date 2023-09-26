import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';

import Home from '../screens/Home';
import Filter from '../screens/Filter';
import Landing from '../screens/Landing';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import Lobby from '../screens/Lobby';
import Waiting from '../screens/Waiting';

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
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Filter" component={Filter} />
      <Stack.Screen name="Lobby" component={Lobby} />
      <Stack.Screen name="Waiting" component={Waiting} />
    </Stack.Navigator>
  );
};
export default StackNavigator;
