import * as React from 'react';
import ErrorBoundary from 'react-native-error-boundary';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './app/navigation/StackNavigator';
import 'react-native-gesture-handler';
import {PaperProvider, MD3LightTheme} from 'react-native-paper';
import generatedTheme from './app/common/constants/theme.json';

const theme = {
  ...MD3LightTheme,
  colors: generatedTheme.colors,
};

function App() {
  return (
    <ErrorBoundary>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </PaperProvider>
    </ErrorBoundary>
  );
}

export default App;
