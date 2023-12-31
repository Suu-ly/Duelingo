import {useEffect, useRef, useState} from 'react';
import {AppState} from 'react-native';
import StackNavigator from './app/navigation/StackNavigator';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import DetectChallenge from './app/common/DetectChallenge';

function AppContainer() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  useEffect(() => {
    //Track whether app is in foreground or not
    const subscriptionAppState = AppState.addEventListener(
      'change',
      nextAppState => {
        appState.current = nextAppState;
        setAppStateVisible(appState.current);
      },
    );

    //Handles navigation on logging in and out
    const subscriptionAuthState = auth().onAuthStateChanged(userState => {
      if (userState) {
        if (userState !== user) navigation.navigate('HomeScreen');
        //For presence detection
        if (appStateVisible === 'active') {
          database()
            .ref('/users/' + userState.uid)
            .set(true);
        } else {
          database()
            .ref('/users/' + userState.uid)
            .remove();
        }

        // Remove the node whenever the client disconnects
        database()
          .ref('/users/' + userState.uid)
          .onDisconnect()
          .remove();
      } else {
        if (userState !== user) {
          database()
            .ref('/users/' + user.uid)
            .remove();
          navigation.navigate('Landing');
        }
      }
      setUser(userState);

      SplashScreen.hide();
    });

    return () => {
      subscriptionAuthState;
      subscriptionAppState.remove();
    };
  });

  return (
    <>
      <DetectChallenge user={user} appState={appStateVisible} />
      <StackNavigator />
    </>
  );
}

export default AppContainer;
