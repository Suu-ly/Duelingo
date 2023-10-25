import ErrorBoundary from 'react-native-error-boundary';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';
import {PaperProvider, MD3LightTheme} from 'react-native-paper';
import Theme from './app/common/constants/theme.json';
import AppContainer from './AppContainer';

const theme = {
  ...MD3LightTheme,
  colors: Theme.colors,
};

function App() {
  return (
    <NavigationContainer>
      <PaperProvider theme={theme}>
        <ErrorBoundary>
          <AppContainer />
        </ErrorBoundary>
      </PaperProvider>
    </NavigationContainer>
  );
}

export default App;
