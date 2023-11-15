import {View, StyleSheet, Animated, ScrollView} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Dialog,
  Portal,
  Searchbar,
  Text,
} from 'react-native-paper';
import {useCallback, useState} from 'react';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

import Constants from '../common/constants/Constants';
import useCountdown from '../utils/useCountdown';
import ChallengeDialogs from '../common/ChallengeDialogs';
import Theme from '../common/constants/theme.json';
import {getFriendData, getUserData} from '../utils/database';
import ChallengeCard from '../common/ChallengeCards';
import {useFocusEffect} from '@react-navigation/native';
import DuoFAB from '../common/DuoFAB';

interface ChallengePlayerProps {
  route: any;
  navigation: any;
  translate: Animated.Value;
  opacity: Animated.Value;
  language: string;
}

const ChallengePlayer = (props: ChallengePlayerProps) => {
  const {route, navigation, translate, opacity, language} = props;
  const [lobbyId, setLobbyId] = useState('ChallengeTest');
  const [difficulty, setDifficulty] = useState('Easy');
  const difficulties = ['Easy', 'Intermediate', 'Hard'];
  const [difficultySelect, setDifficultySelect] = useState(false);
  const [challengeActive, setChallengeActive] = useState(false);
  const [challengeClash, setChallengeClash] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [timeout, setTimeout] = useState<number | null>(null);

  const userId = auth().currentUser!.uid;
  const [playerData, setPlayerData] =
    useState<FirebaseFirestoreTypes.DocumentData | null>(null);
  const [playerId, setPlayerId] = useState('');
  const [onlineFriends, setOnlineFriends] = useState<
    FirebaseFirestoreTypes.DocumentData[] | null
  >(null);
  const [addFriendPrompt, setAddFriendPrompt] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
  };

  const loadData = async () => {
    let ownData = await getUserData(userId);
    setPlayerData(ownData);
    let data: FirebaseFirestoreTypes.DocumentData[] = await getFriendData();
    if (data.length === 0) {
      setAddFriendPrompt(true);
    } else setAddFriendPrompt(false);
    database()
      .ref('/users/')
      .on('value', snapshot => {
        if (snapshot.val()) {
          let online: any = [];
          data.forEach((entry: FirebaseFirestoreTypes.DocumentData) => {
            if (snapshot.val()[entry.uid] === true) {
              online.push(entry);
            }
          });
          setOnlineFriends(online);
        }
      });
  };

  const filterFunction = (entry: FirebaseFirestoreTypes.DocumentData) => {
    if (searchQuery === '') return true;
    return (
      entry.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
    resetListeners(playerId);
    setChallengeActive(false);
    database()
      .ref('/games/' + lobbyId)
      .remove();
    database()
      .ref('/challenge/' + playerId)
      .update({status: false});
  });

  const resetListeners = (player: string) => {
    setTimeout(null);
    database()
      .ref('/challenge/' + player)
      .off();
  };

  const handleChallenge = (player: string) => {
    setPlayerId(player);
    database()
      .ref('/challenge/')
      .equalTo(player)
      .limitToFirst(1)
      .once('value', snapshot => {
        if (snapshot.val() !== null) {
          //Challenge already exists
          setChallengeClash(true);
        } else {
          setChallengeActive(true);
          let lobby = generateCode(6);
          setLobbyId(lobby);
          //Create challenge record
          database()
            .ref('/challenge/' + player)
            .set({
              language: language,
              difficulty: difficulty,
              lobbyId: lobby,
              challenger: playerData!.displayName,
              status: true,
              accepted: false,
            });
          //Create lobby
          database()
            .ref('/games/' + lobby)
            .set({
              isWaiting: {[userId]: true},
              startTimestamp: 0,
              questions: randomQuestion(5, 19),
              points: {[userId]: 0},
            });
          //Sets the challenge to time out
          setTimeout(30);

          database()
            .ref('/challenge/' + player)
            .on('value', snapshot => {
              //Checks if accepts
              if (snapshot.val() && snapshot.val().accepted) {
                resetListeners(player);
                database()
                  .ref('/challenge/' + player)
                  .remove();
                setChallengeActive(false);
                navigation.navigate('Multiplayer', {
                  gameId: lobby,
                  host: true,
                  language: language,
                  difficulty: difficulty,
                });
              }
              //Checks if the other player declines
              else if (!snapshot.val()) {
                resetListeners(player);
                setChallengeActive(false);
                setDeclined(true);
                database()
                  .ref('/games/' + lobbyId)
                  .remove();
              }
            });
        }
      });
  };

  useFocusEffect(
    useCallback(() => {
      loadData();

      return () => database().ref('/users/').off();
    }, []),
  );

  return (
    <Animated.View
      style={[
        styles.mainContainer,
        {transform: [{translateY: translate}], opacity: opacity},
      ]}>
      <ScrollView
        stickyHeaderIndices={[1]}
        contentContainerStyle={styles.container}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="headlineSmall">Challenge</Text>
          <Text
            variant="bodyMedium"
            style={{color: Theme.colors.onSurfaceVariant}}>
            Battle a friend in a language duel!
          </Text>
        </View>
        <View style={styles.sticky}>
          <View style={styles.difficulty}>
            <Text
              variant={'labelLarge'}
              style={{color: Theme.colors.onSurfaceVariant}}>
              Select Difficulty:
            </Text>
            <Button
              mode="outlined"
              onPress={() => setDifficultySelect(true)}
              style={{width: 132}}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Button>
          </View>
          <Searchbar
            style={styles.search}
            placeholder="Search online friends"
            onChangeText={onChangeSearch}
            value={searchQuery}
          />
          <Text variant={'labelLarge'} style={{color: Theme.colors.primary}}>
            Online Friends
          </Text>
        </View>
        <View style={styles.cardsContainer}>
          {onlineFriends && onlineFriends.length !== 0 ? (
            <View style={styles.cards}>
              {onlineFriends.filter(filterFunction).map((user, index) => {
                return (
                  <ChallengeCard
                    key={user.uid}
                    onPress={() => handleChallenge(user.uid)}
                    cardOnPress={() =>
                      navigation.navigate('OtherProfile', {userId: user.uid})
                    }
                    avatarIndex={user.avatar}
                    topText={user.displayName}
                    bottomText={user.exp + ' exp'}
                    buttonText="Challenge"
                    buttonTextColor={Theme.colors.secondary}
                    buttonBorderColor={Theme.colors.secondary}
                  />
                );
              })}
            </View>
          ) : onlineFriends &&
            onlineFriends.length === 0 &&
            !addFriendPrompt ? (
            <View style={styles.loading}>
              <Text
                variant={'bodyMedium'}
                style={{color: Theme.colors.onSurfaceVariant}}>
                There are no friends online at the moment.
              </Text>
            </View>
          ) : addFriendPrompt ? (
            <View style={styles.loading}>
              <Text
                variant={'bodyMedium'}
                style={{color: Theme.colors.onSurfaceVariant}}>
                You don't have any friends yet.
              </Text>
              <Text
                variant={'bodyMedium'}
                style={{color: Theme.colors.onSurfaceVariant}}>
                Add some friends to challenge them!
              </Text>
            </View>
          ) : (
            <View style={styles.loading}>
              <ActivityIndicator />
            </View>
          )}
        </View>
      </ScrollView>
      <DuoFAB
        icon="account-plus-outline"
        onPress={() =>
          navigation.navigate('Profile', {
            screen: 'AddFriends',
            params: {data: playerData},
          })
        }
      />
      <ChallengeDialogs
        challengeActive={challengeActive}
        challengeActiveOnPress={() => {
          setChallengeActive(false);
          resetListeners(playerId);
          database()
            .ref('/challenge/' + playerId)
            .update({status: false});
          database()
            .ref('/games/' + lobbyId)
            .remove();
        }}
        timedOut={timedOut}
        timedOutOnPress={() => setTimedOut(false)}
        challengeClash={challengeClash}
        challengeClashOnPress={() => setChallengeClash(false)}
        declined={declined}
        declinedOnPress={() => setDeclined(false)}
        isRematch={false}
      />
      <Portal>
        <Dialog
          visible={difficultySelect}
          onDismiss={() => setDifficultySelect(false)}>
          <Dialog.Title>Select Difficulty</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Choose the difficulty of the questions! Harder questions give more
              exp.
            </Text>
          </Dialog.Content>
          <Dialog.Content>
            <View style={styles.difficultyContainer}>
              {difficulties.map((level, index) => {
                return (
                  <Button
                    key={level}
                    mode="contained-tonal"
                    onPress={() => {
                      setDifficulty(level);
                      setDifficultySelect(false);
                    }}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Button>
                );
              })}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDifficultySelect(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Animated.View>
  );
};

export default ChallengePlayer;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
  },
  header: {
    paddingTop: Constants.edgePadding * 2,
    paddingBottom: Constants.smallGap,
    gap: Constants.mediumGap,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: Constants.edgePadding,
  },
  difficulty: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyContainer: {
    gap: Constants.largeGap,
  },
  sticky: {
    paddingVertical: Constants.edgePadding,
    backgroundColor: Theme.colors.surface,
  },
  search: {
    marginVertical: Constants.edgePadding,
  },
  cardsContainer: {
    gap: Constants.edgePadding,
    flex: 1,
    paddingBottom: 88,
  },
  cards: {
    gap: Constants.largeGap,
    flex: 1,
  },
  title: {
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'column',
    gap: Constants.mediumGap,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Constants.largeGap,
  },
});
