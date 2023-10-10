import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import {Button, Text, TextInput, Portal, Dialog} from 'react-native-paper';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {EventArg, NavigationAction} from '@react-navigation/native';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import Theme from '../common/constants/theme.json';

interface LobbyProps {
  route: any;
  navigation: any;
}

const Lobby = (props: LobbyProps) => {
  const {route, navigation} = props;
  const [lobbyId, setLobbyId] = useState('');
  const [joinId, setJoinId] = useState('');
  const [newGameId, setGameId] = useState('');
  const userId = auth().currentUser?.uid;
  //Decides whether to show the progress won't be saved dialog
  const [dialogVisible, setDialogVisible] = useState(false);

  const generateCode = (length: number) => {
    return Array(length)
      .fill('x')
      .join('')
      .replace(/x/g, () => {
        return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
      });
  };

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

  const CreateGame = async () => {
    if (userId) {
      database()
        .ref('/games/' + lobbyId)
        .set({
          isReady: {[userId]: false},
          isWaiting: {[userId]: false},
          startTimestamp: 0,
          questions: randomQuestion(5, 9),
          points: {[userId]: 0},
        })
        .then(() =>
          navigation.navigate('Multiplayer', {
            gameId: lobbyId,
            host: true,
            language: 'chinese',
            difficulty: 'easy',
          }),
        );
    }
  };

  const CreateGameThings = () => {
    setGameId(generateCode(4));
    CreateGame();
  };

  useEffect(
    () =>
      navigation.addListener(
        'beforeRemove',
        (e: EventArg<'beforeRemove', true, {action: NavigationAction}>) => {
          if (e.data.action.type != 'GO_BACK') {
            return;
          }
          // Prevent default behavior of leaving the screen
          e.preventDefault();
          // Prompt the user before leaving the screen
          setDialogVisible(true);
        },
      ),
    [navigation],
  );

  const JoinGame = () => {
    database()
      .ref('/games/')
      .orderByKey()
      .equalTo(joinId)
      .limitToFirst(1)
      .once('value', snapshot => {
        if (snapshot.val() !== null && userId) {
          database()
            .ref('/games/' + joinId + '/isWaiting')
            .update({
              [userId]: false,
            });
          database()
            .ref('/games/' + joinId + '/points')
            .update({
              [userId]: 0,
            });
          database()
            .ref('/games/' + joinId + '/isReady')
            .update({
              [userId]: false,
            })
            .then(() =>
              navigation.navigate('Multiplayer', {
                gameId: joinId,
                host: false,
                language: 'chinese',
                difficulty: 'easy',
              }),
            );
        } else {
          console.log('Lobby Id does not exist.', snapshot.val());
          setDialogVisible(true);
        }
      });
  };

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar backgroundColor={Theme.colors.surface} />
      <View style={styles.container}>
        <Text variant={'headlineLarge'}>Lobby Screen</Text>
        <Button
          icon="map-marker-outline"
          mode="outlined"
          onPress={() => navigation.navigate('Home')}>
          Go to Home
        </Button>
        <View style={styles.rowContainer}>
          <KeyboardAvoidingView>
            <TextInput
              placeholder="New Lobby Id"
              value={lobbyId}
              activeOutlineColor={Theme.colors.primary}
              autoCapitalize="none"
              onChangeText={lobbyId => setLobbyId(lobbyId)}
            />
            <Button
              icon="map-marker-outline"
              mode="outlined"
              onPress={CreateGameThings}>
              Create Game
            </Button>
            <TextInput
              placeholder="Join Lobby Id"
              value={joinId}
              activeOutlineColor={Theme.colors.primary}
              autoCapitalize="none"
              onChangeText={joinId => setJoinId(joinId)}
            />
            <Button
              icon="map-marker-outline"
              mode="outlined"
              onPress={JoinGame}>
              Join Game
            </Button>
          </KeyboardAvoidingView>
          <Portal>
            <Dialog
              visible={dialogVisible}
              dismissable={false}
              dismissableBackButton={false}>
              <Dialog.Icon icon={'alert-circle-outline'} />
              <Dialog.Title style={styles.title}>Lobby not found.</Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyMedium">
                  The lobby ID you have entered is invalid.
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button mode="text" onPress={() => setDialogVisible(false)}>
                  Ok
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </View>
    </View>
  );
};

export default Lobby;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Constants.defaultGap,
    paddingHorizontal: Constants.edgePadding,
  },
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Constants.mediumGap,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
});
