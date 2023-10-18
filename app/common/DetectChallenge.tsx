import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {
  Dialog,
  Portal,
  Button,
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
import {useEffect, useState} from 'react';

import Theme from './constants/theme.json';
import DuoButton from './DuoButton';
import Constants from './constants/Constants';

interface detectProps {
  user: FirebaseAuthTypes.User | null;
  appState: 'active' | 'background' | 'inactive' | 'unknown' | 'extension';
}

const DetectChallenge = (props: detectProps) => {
  const {user, appState} = props;
  const [oldUser, setOldUser] = useState(user);
  //Visibility of dialogs
  const [dialogVisible, setDialogVisible] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [isRematch, setIsRematch] = useState(false);
  //Lobby settings
  const [language, setLanguage] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [challengerName, setChallengerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lobbyId, setLobbyId] = useState('');
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const removeChallenge = () => {
    if (user) {
      database()
        .ref('/challenge/' + user.uid)
        .remove();
    }
  };

  //Removes dialogs if user goes back to home screen
  useEffect(() => {
    if (appState !== 'active') {
      removeChallenge();
      setDialogVisible(false);
      setCancelled(false);
      setIsRematch(false);
    }
  }, [appState]);

  useEffect(() => {
    if (user) {
      removeChallenge();
      setOldUser(user);
      database()
        .ref('/challenge/' + user.uid)
        .on('value', snapshot => {
          if (snapshot.val() && !snapshot.val().accepted) {
            setLanguage(snapshot.val().language);
            setDifficulty(snapshot.val().difficulty);
            setChallengerName(snapshot.val().challenger);
            setIsRematch(snapshot.val().isRematch);
            setLobbyId(snapshot.val().lobbyId);
            if (snapshot.val().status) {
              setDialogVisible(true);
            } else {
              setCancelled(true);
              setDialogVisible(false);
              removeChallenge();
            }
          }
        });
    } else {
      if (oldUser) {
        database()
          .ref('/challenge/' + oldUser.uid)
          .off();
      }
    }
  }, [user]);

  const handleOnPress = async () => {
    setIsLoading(true);
    if (user) {
      await database()
        .ref('/games/')
        .orderByKey()
        .equalTo(lobbyId)
        .limitToFirst(1)
        .once('value', snapshot => {
          if (snapshot.val() !== null && user.uid) {
            database()
              .ref('/games/' + lobbyId + '/isWaiting')
              .update({
                [user.uid]: true,
              });
            database()
              .ref('/games/' + lobbyId + '/points')
              .update({
                [user.uid]: 0,
              });
            database()
              .ref('/games/' + lobbyId + '/isConnected')
              .update({
                [user.uid]: true,
              });
            database()
              .ref('/challenge/' + user.uid)
              .update({
                accepted: true,
              })
              .then(() => {
                setDialogVisible(false);
                setIsLoading(false);
                navigation.navigate('Multiplayer', {
                  gameId: lobbyId,
                  host: false,
                  language: language,
                  difficulty: difficulty,
                });
              });
          } else {
            //Cannot find lobby
            setCancelled(true);
            setDialogVisible(false);
          }
        });
    }
  };

  return (
    <Portal>
      <Dialog
        visible={dialogVisible && !isRematch}
        dismissable={false}
        dismissableBackButton={false}>
        <Dialog.Icon icon={'karate'} />
        <Dialog.Title style={styles.title}>Incoming challenge!</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            {challengerName} has challenged you to a battle of{' '}
            {language.charAt(0).toUpperCase() + language.slice(1)}:{' '}
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}! Start a
            duel?'
          </Text>
        </Dialog.Content>
        <Dialog.Actions style={styles.actions}>
          {user && (
            <>
              <View style={styles.buttonContainer}>
                <DuoButton
                  backgroundColor={Theme.colors.primary}
                  backgroundDark={Theme.colors.primaryDark}
                  stretch={true}
                  onPress={handleOnPress}
                  textColor={Theme.colors.onPrimary}>
                  {!isLoading ? (
                    'Accept'
                  ) : (
                    <ActivityIndicator color={Theme.colors.onPrimary} />
                  )}
                </DuoButton>
              </View>
              <Button
                mode="text"
                onPress={() => {
                  removeChallenge();
                  setDialogVisible(false);
                }}>
                Decline
              </Button>
            </>
          )}
        </Dialog.Actions>
      </Dialog>
      <Dialog
        visible={dialogVisible && isRematch}
        dismissable={false}
        dismissableBackButton={false}>
        <Dialog.Icon icon={'karate'} />
        <Dialog.Title style={styles.title}>Rematch!</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            {challengerName} wants a rematch! Go again?
          </Text>
        </Dialog.Content>
        <Dialog.Actions style={styles.actions}>
          {user && (
            <>
              <View style={styles.buttonContainer}>
                <DuoButton
                  backgroundColor={Theme.colors.primary}
                  backgroundDark={Theme.colors.primaryDark}
                  stretch={true}
                  onPress={handleOnPress}
                  textColor={Theme.colors.onPrimary}>
                  {!isLoading ? (
                    'Rematch'
                  ) : (
                    <ActivityIndicator color={Theme.colors.onPrimary} />
                  )}
                </DuoButton>
              </View>
              <Button
                mode="text"
                onPress={() => {
                  removeChallenge();
                  setDialogVisible(false);
                }}>
                Decline
              </Button>
            </>
          )}
        </Dialog.Actions>
      </Dialog>
      <Dialog
        visible={cancelled}
        dismissable={false}
        dismissableBackButton={false}>
        <Dialog.Title>Challenge cancelled.</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            The other player has cancelled the challenge request
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          {user && (
            <Button
              mode="text"
              onPress={() => {
                setDialogVisible(false);
                setCancelled(false);
              }}>
              Ok
            </Button>
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DetectChallenge;

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'column',
    gap: Constants.mediumGap,
  },
  buttonContainer: {
    width: '100%',
  },
});
