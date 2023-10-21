import * as React from 'react';
import ErrorBoundary from 'react-native-error-boundary';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './app/navigation/StackNavigator';
import 'react-native-gesture-handler';
import {PaperProvider, MD3LightTheme} from 'react-native-paper';
import Theme from './app/common/constants/theme.json';
import SplashScreen from 'react-native-splash-screen'

import { useEffect } from 'react';
import Home from './app/screens/Home';
import {
  StatusBar,
  StyleSheet,
  SafeAreaView,
  useColorScheme,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';



const theme = {
  ...MD3LightTheme,
  colors: Theme.colors,
};


function App(): React.JSX.Element {
  

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return ( 
    <NavigationContainer>
      
        <ErrorBoundary>
          <StackNavigator />
        </ErrorBoundary>
     
    </NavigationContainer>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default App;


