import {View, StyleSheet, Animated, ScrollView} from 'react-native';
import {ActivityIndicator, Button, Searchbar, Text} from 'react-native-paper';
import {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

import Constants from '../common/constants/Constants';
import useCountdown from '../utils/useCountdown';
import ChallengeDialogs from '../common/ChallengeDialogs';
import Theme from '../common/constants/theme.json';
import {getFriendData} from '../utils/database';
import ChallengeCard from '../common/ChallengeCards';

interface ChallengePlayerProps {
  route: any;
  navigation: any;
  translate: Animated.Value;
  language: string;
}

const ChallengePlayer = (props: ChallengePlayerProps) => {
  const {route, navigation, translate, language} = props;
  const [lobbyId, setLobbyId] = useState('ChallengeTest');
  const [difficulty, setDifficulty] = useState('easy');
  const [challengeActive, setChallengeActive] = useState(false);
  const [challengeClash, setChallengeClash] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [timeout, setTimeout] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const userId = auth().currentUser?.uid as string;
  const [playerId, setPlayerId] = useState('');
  const [onlineFriends, setOnlineFriends] = useState<
    FirebaseFirestoreTypes.DocumentData[]
  >([]);
  const [addFriendPrompt, setAddFriendPrompt] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
  };

  const setFriendsList = async () => {
    setIsLoading(true);
    var data: FirebaseFirestoreTypes.DocumentData[] = await getFriendData();
    if (data.length === 0) {
      setAddFriendPrompt(true);
    }
    database()
      .ref('/users/')
      .on('value', snapshot => {
        if (snapshot.val()) {
          var online: any = [];
          data.forEach((entry: FirebaseFirestoreTypes.DocumentData) => {
            if (snapshot.val()[entry.uid] === true) {
              online.push(entry);
            }
          });
          setOnlineFriends(online);
        }
      });
    setIsLoading(false);
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
          var lobby = generateCode(6);
          setLobbyId(lobby);
          //Create challenge record
          database()
            .ref('/challenge/' + player)
            .set({
              language: language,
              difficulty: difficulty,
              lobbyId: lobby,
              challenger: 'Lance', //TODO Get username from database
              status: true,
              accepted: false,
            });
          //Create lobby
          database()
            .ref('/games/' + lobby)
            .set({
              isWaiting: {[userId]: true},
              startTimestamp: 0,
              questions: randomQuestion(5, 9),
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

  useEffect(() => {
    const focus = navigation.addListener('focus', () => {
      // Do something when the screen focuses
      setFriendsList();
    });

    const blur = navigation.addListener('blur', () => {
      database().ref('/users/').off();
    });

    return () => {
      focus;
      blur;
    };
  }, [navigation]);

  return (
    <Animated.View
      style={[styles.mainContainer, {transform: [{translateY: translate}]}]}>
      <ScrollView
        style={styles.container}
        stickyHeaderIndices={[1]}
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="headlineSmall">Challenge</Text>
          <Text
            variant="bodyMedium"
            style={{color: Theme.colors.onSurfaceVariant}}>
            Battle a friend in a language duel!
          </Text>
        </View>
        <View style={styles.search}>
          <Searchbar
            placeholder="Search online friends"
            onChangeText={onChangeSearch}
            value={searchQuery}
          />
        </View>
        <View style={styles.cardsContainer}>
          <Text variant={'labelLarge'} style={{color: Theme.colors.primary}}>
            Online Friends
          </Text>
          {isLoading ? (
            <View style={styles.loading}>
              <ActivityIndicator />
            </View>
          ) : !addFriendPrompt ? (
            <View style={styles.cards}>
              <ChallengeCard
                data={onlineFriends.filter(filterFunction)}
                onPress={handleChallenge}
                challenge={true}
                navigation={navigation}
              />
            </View>
          ) : (
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
          )}
        </View>
      </ScrollView>
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
    flex: 1,
    paddingHorizontal: Constants.edgePadding,
  },
  search: {
    paddingVertical: Constants.edgePadding,
    backgroundColor: Theme.colors.surface,
  },
  cardsContainer: {
    gap: Constants.edgePadding,
    flex: 1,
    paddingBottom: Constants.edgePadding,
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
