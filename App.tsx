import * as React from 'react';
import ErrorBoundary from 'react-native-error-boundary';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './app/navigation/StackNavigator';
import 'react-native-gesture-handler';
import {PaperProvider, MD3LightTheme} from 'react-native-paper';
import Theme from './app/common/constants/theme.json';
import DetectChallenge from './app/common/DetectChallenge';

const theme = {
  ...MD3LightTheme,
  colors: Theme.colors,
};

function App() {
  return (
    <NavigationContainer>
      <PaperProvider theme={theme}>
        <ErrorBoundary>
          <DetectChallenge />
          <StackNavigator />
        </ErrorBoundary>
      </PaperProvider>
    </NavigationContainer>
  );
}

export default App;
