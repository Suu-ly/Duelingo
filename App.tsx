import * as React from 'react';
import ErrorBoundary from 'react-native-error-boundary';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './app/navigation/StackNavigator';
import 'react-native-gesture-handler';

function App() {
  return (
    <ErrorBoundary>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </ErrorBoundary>
  );
}

export default App;
