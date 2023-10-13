import {View, StyleSheet} from 'react-native';
import {Button, Dialog, Portal, Text} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import Theme from '../common/constants/theme.json';
import {EventArg, NavigationAction} from '@react-navigation/native';
import useCountdown from '../utils/useCountdown';

interface ChallengePlayerProps {
  route: any;
  navigation: any;
}

const ChallengePlayer = (props: ChallengePlayerProps) => {
  const {route, navigation} = props;
  const [lobbyId, setLobbyId] = useState('ChallengeTest');
  const [language, setLanguage] = useState('chinese');
  const [difficulty, setDifficulty] = useState('easy');
  const [challengeActive, setChallengeActive] = useState(false);
  const [challengeClash, setChallengeClash] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [timeout, setTimeout] = useState<number | null>(null);

  const userId = auth().currentUser?.uid as string;
  const [playerId, setPlayerId] = useState('ytnv4Xn4FYVNY6V53a5ded7DiI32');

  const randomQuestion = (count: number, max: number) => {
    if (count > max) return;
    const qns = [];
    while (qns.length < count) {
      const no = Math.floor(Math.random() * max);
      if (qns.indexOf(no) === -1) {
        qns.push(no);
      }
    }
    return qns;
  };

  const generateCode = (length: number) => {
    return Array(length)
      .fill('x')
      .join('')
      .replace(/x/g, () => {
        return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
      });
  };

  useCountdown(timeout, setTimeout, () => {
    setTimedOut(true);
    setTimeout(null);
    setChallengeActive(false);
    database()
      .ref('/challenge/' + playerId)
      .off();
    database()
      .ref('/challenge/' + playerId)
      .update({status: 'cancelled'});
  });

  useEffect(() => {
    navigation.addListener(
      'beforeRemove',
      (e: EventArg<'beforeRemove', true, {action: NavigationAction}>) => {
        setTimeout(null);
        database()
          .ref('/games/' + lobbyId + '/isWaiting')
          .off();
      },
    );
    if (!challengeActive) {
      database()
        .ref('/challenge/' + playerId)
        .off();
      database()
        .ref('/games/' + lobbyId + '/isWaiting')
        .off();
    }
  }, [navigation, challengeActive]);

  const handleChallenge = () => {
    database()
      .ref('/challenge/')
      .equalTo(playerId)
      .limitToFirst(1)
      .once('value', async snapshot => {
        if (snapshot.val() !== null) {
          //Challenge already exists
          setChallengeClash(true);
        } else {
          setChallengeActive(true);
          setLobbyId(generateCode(6));
          await database()
            .ref('/challenge/' + playerId)
            .set({
              language: language,
              difficulty: difficulty,
              lobbyId: 'ChallengeTest',
              challenger: 'Lance', //TODO Get username from database
              isRematch: false,
              status: 'active',
            });
          await database()
            .ref('/games/' + 'ChallengeTest')
            .set({
              isWaiting: {[userId]: true},
              startTimestamp: 0,
              questions: randomQuestion(5, 9),
              points: {[userId]: 0},
            });
          setTimeout(3);
          database()
            .ref('/games/' + lobbyId + '/isWaiting')
            .on('value', snapshot => {
              if (snapshot.val() && Object.keys(snapshot.val()).length > 1) {
                setTimeout(null);
                setChallengeActive(false);
                navigation.navigate('Multiplayer', {
                  gameId: lobbyId,
                  host: true,
                  language: language,
                  difficulty: difficulty,
                });
              }
            });
          database()
            .ref('/challenge/' + playerId)
            .on('value', snapshot => {
              if (!snapshot.val()) {
                setChallengeActive(false);
                setDeclined(true);
                setTimeout(null);
                database()
                  .ref('/challenge/' + playerId)
                  .off();
              }
            });
        }
      });
  };

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar />
      <View style={styles.container}>
        <Text variant={'headlineLarge'}>Challenge Screen</Text>
        <Button mode="outlined" onPress={handleChallenge}>
          Challenge
        </Button>
      </View>
      <Portal>
        <Dialog
          visible={challengeActive}
          dismissable={false}
          dismissableBackButton={false}>
          <Dialog.Icon icon={'karate'} />
          <Dialog.Title style={styles.title}>Challenge requested!</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Waiting for player to respond...</Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.actions}>
            <Button
              mode="text"
              onPress={() => {
                setChallengeActive(false);
                database()
                  .ref('/challenge/' + playerId)
                  .update({status: 'cancelled'});
              }}>
              Cancel
            </Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog
          visible={timedOut}
          dismissable={false}
          dismissableBackButton={false}>
          <Dialog.Title>Challenge timed out.</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              The player has taken too long to respond to the challenge and the
              request has been automatically declined.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="text"
              onPress={() => {
                setTimedOut(false);
              }}>
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog
          visible={challengeClash}
          dismissable={false}
          dismissableBackButton={false}>
          <Dialog.Title>Challenge already exists.</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Another player has already challenged this player to a duel,
              please wait before issuing another challenge.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="text"
              onPress={() => {
                setChallengeClash(false);
              }}>
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog
          visible={declined}
          dismissable={false}
          dismissableBackButton={false}>
          <Dialog.Title>Challenge declined.</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              The other player has declined the challenge request.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="text"
              onPress={() => {
                setDeclined(false);
              }}>
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default ChallengePlayer;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Constants.defaultGap,
    paddingHorizontal: Constants.edgePadding,
  },
  title: {
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'column',
    gap: Constants.mediumGap,
  },
});
