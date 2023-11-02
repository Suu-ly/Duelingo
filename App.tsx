import ErrorBoundary from 'react-native-error-boundary';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';
import {PaperProvider, MD3LightTheme} from 'react-native-paper';
import Theme from './app/common/constants/theme.json';
import AppContainer from './AppContainer';

const theme = {
  ...MD3LightTheme,
  colors: Theme.colors,
};

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Theme.colors.surface,
  },
};

function App() {
  return (
    <NavigationContainer theme={navTheme}>
      <PaperProvider theme={theme}>
        <ErrorBoundary>
          <AppContainer />
        </ErrorBoundary>
      </PaperProvider>
    </NavigationContainer>
  );
}

export default App;
