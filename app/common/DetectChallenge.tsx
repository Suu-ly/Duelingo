import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import {useEffect, useState} from 'react';

import Constants from './constants/Constants';
import RequestDialogs from './RequestDialogs';

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
    <RequestDialogs
      requestActive={dialogVisible}
      requestText={
        challengerName +
        ' has challenged you to a battle of ' +
        language.charAt(0).toUpperCase() +
        language.slice(1) +
        ': ' +
        difficulty.charAt(0).toUpperCase() +
        difficulty.slice(1) +
        '! Start a duel?'
      }
      requestActiveAccept={handleOnPress}
      requestActiveDecline={() => {
        removeChallenge();
        setDialogVisible(false);
      }}
      cancelled={cancelled}
      cancelledOnPress={() => {
        setDialogVisible(false);
        setCancelled(false);
      }}
      isLoading={isLoading}
    />
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
