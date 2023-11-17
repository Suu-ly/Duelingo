import {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
  ScrollView,
} from 'react-native';
import {
  Button,
  Text,
  Portal,
  Dialog,
  ActivityIndicator,
} from 'react-native-paper';
import {
  EventArg,
  NavigationAction,
  useFocusEffect,
} from '@react-navigation/native';
import database, {firebase} from '@react-native-firebase/database';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {getUsersData, getMultiplayerQuestions} from '../utils/database';

import Theme from '../common/constants/theme.json';
import CustomStatusBar from '../common/CustomStatusBar';
import QuizButtons from '../common/QuizButtons';
import Constants from '../common/constants/Constants';
import QuizHeader from '../common/QuizHeader';
import QuizFooter from '../common/QuizFooter';
import MultiplayerQuizStandings from '../common/MultiplayerQuizStandings';
import MultiplayerPlayers from '../common/MultiplayerPlayers';
import MultiplayerEnd from './MultiplayerEnd';
import ChallengeDialogs from '../common/ChallengeDialogs';
import useCountdown from '../utils/useCountdown';
import RequestDialogs from '../common/RequestDialogs';

interface MultiplayerProps {
  route: any;
  navigation: any;
}

const Multiplayer = (props: MultiplayerProps) => {
  const {route, navigation} = props;

  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  //Your own userId
  const userId = auth().currentUser!.uid;
  const [playerData, setPlayerData] = useState<
    FirebaseFirestoreTypes.DocumentData[]
  >([]);
  const [oppName, setOppName] = useState('');
  //Remaining number of questions, used to select the question
  const [remaining, setRemaining] = useState(5);
  const language = route.params.language;
  const difficulty = route.params.difficulty;

  //Array containing all questions
  type questionType = {
    question: string;
    correct_answer: string;
    explanation: string;
    options: string[];
  };

  const [questionBank, setQuestionBank] = useState<questionType[]>([]);

  //Updates the current question
  const [question, setQuestion] = useState<questionType>(
    questionBank[5 - remaining],
  );

  //Check if player is a host for the game
  const host: boolean = route.params.host;

  //Game ID of the lobby
  const gameId: string = route.params.gameId;

  //Selected answer
  const [answer, setAnswer] = useState('');
  //Keeps track of whether the user as submitted the answer
  const [submit, setSubmit] = useState(true);
  //Keeps track of the current game state
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeUploaded, setTimeUploaded] = useState(false);
  //Keeps track of whether the game has started or ended
  const [start, setStart] = useState(false);
  const [end, setEnd] = useState(false);
  //Keeps track of time taken to answer for points
  const [currentTime, setCurrentTime] = useState(-1);
  const [serverTimeOffset, setServerTimeOffset] = useState(0);
  //Keeps track of seconds left before next screen
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timeStamp, setTimeStamp] = useState(0);
  //Keeps track of points for both players
  const [points, setPoints] = useState<Record<string, unknown>[]>([]);
  const [oldPoints, setOldPoints] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  //Decides whether to show the dialogs
  const [dialogVisible, setDialogVisible] = useState(false);
  const [playerLeft, setPlayerLeft] = useState(false);
  const [challengeActive, setChallengeActive] = useState(false);
  const [rematchRequest, setRematchRequest] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [timeout, setTimeout] = useState<number | null>(null);

  //Need to standardise the formatting of the questions for this to work properly.
  //Right now it extracts the text contained within "" and puts it into a box
  //And replaces the text with "the following"
  const parseQuestion = (question: string, type: 'header' | 'box') => {
    if (question.includes('"')) {
      if (type === 'header') {
        return (
          question.split('"')[0] + 'the following' + question.split('"')[2]
        );
      } else return question.split('"')[1];
    } else if (type === 'header') {
      return question;
    } else return null;
  };

  const calculateScore = (timeTaken: number) => {
    if (timeTaken < 1500) return 1000;
    else if (2000 <= timeTaken && timeTaken < 15000)
      return Math.floor(-8 * Math.sqrt(timeTaken - 1400) + 1080);
    else return 100;
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

  const getDisplayName = (
    userId: string,
    data: FirebaseFirestoreTypes.DocumentData[],
  ) => {
    if (data[0].uid === userId) {
      setOppName(data[1].displayName);
    } else setOppName(data[0].displayName);
  };

  //Gets the quiz questions from database
  const getQuestions = async () => {
    const chosenQns = await database()
      .ref('/games/' + gameId + '/questions')
      .once('value');
    const qns = await getMultiplayerQuestions(
      language,
      difficulty,
      chosenQns.val(),
    );
    if (qns) {
      setQuestionBank(qns as questionType[]);
      await database()
        .ref('/games/' + gameId + '/isWaiting')
        .update({[userId]: false});
    }
  };

  //Gets the points from the database
  const getPoints = async () => {
    setIsLoading(true);
    let tempPoints: Record<string, unknown>[] = [];
    await database()
      .ref('/games/' + gameId + '/points')
      .orderByValue()
      .once('value')
      .then(snapshot => {
        snapshot.forEach(element => {
          tempPoints.push({uid: element.key as string, value: element.val()});
          return undefined;
        });
      });
    tempPoints.reverse();
    setPoints(tempPoints);
    setIsLoading(false);
    //Trigger countdown
    await database()
      .ref('/games/' + gameId + '/isWaiting')
      .update({[userId]: false});
  };

  const getPlayerData = async () => {
    let tempData: FirebaseFirestoreTypes.DocumentData[] = [];
    database()
      .ref('/games/' + gameId + '/isWaiting')
      .once('value', async snapshot => {
        if (snapshot.val()) {
          tempData = await getUsersData(Object.keys(snapshot.val()));
          setPlayerData(tempData);
          getDisplayName(userId, tempData);
        }
      });
  };

  const handleSubmit = async () => {
    setSubmit(true);
    if (answer === question?.correct_answer) {
      await database()
        .ref('/games/' + gameId + '/points/' + userId)
        .transaction(currentPts => {
          return calculateScore(Date.now() - currentTime) + currentPts;
        });
    }
    await database()
      .ref('/games/' + gameId + '/isWaiting')
      .update({[userId]: true});
  };

  useCountdown(timeout, setTimeout, () => {
    setTimedOut(true);
    setChallengeActive(false);
    database()
      .ref('/games/' + gameId)
      .update({rematch: 'cancel'});
  });

  //Start a rematch request
  const handleRematch = () => {
    setChallengeActive(true);
    setTimeout(30);
    database()
      .ref('/games/' + gameId)
      .update({rematch: 'request'});
  };

  //Resets everything for the next round
  const nextRound = () => {
    if (remaining > 0) {
      setQuestion(questionBank[5 - remaining]);
    }
    setStart(true);
    setIsPlaying(true);
    setSubmit(false);
    setAnswer('');
    setTimeStamp(0);
    setOldPoints(points);
    if (host) {
      database()
        .ref('/games/' + gameId)
        .update({startTimestamp: 0});
      setTimeUploaded(false);
    }
  };

  //When the round ends
  const onRoundEnd = () => {
    if (remaining === 1) {
      setEnd(true);
    } else {
      setRemaining(remaining - 1);
    }
    getPoints();
  };

  //When a rematch occurs
  const resetGame = async (challenger: boolean) => {
    setIsLoading(true);
    await getPlayerData();
    await database()
      .ref('/games/' + gameId + '/points/')
      .update({[userId]: 0});
    await database()
      .ref('/games/' + gameId + '/isWaiting')
      .update({[userId]: true});
    if (challenger) {
      await database()
        .ref('/games/' + gameId)
        .update({questions: randomQuestion(5, 19)})
        .then(() => {
          database()
            .ref('/games/' + gameId)
            .update({rematch: 'active'});
        });
    }

    setQuestionBank([]);
    setOldPoints([]);
    setPoints([]);
    setEnd(false);
    setStart(false);
    setIsPlaying(false);
    setRemaining(5);
    setIsLoading(false);
    getQuestions();
  };

  //Countdown between rounds
  const startCountdown = () => {
    let timeLeft = Math.ceil(
      (5000 - (Date.now() - timeStamp + serverTimeOffset)) / 1000,
    );
    const interval = setInterval(() => {
      setSecondsLeft(timeLeft);
      if (timeLeft <= 0) {
        timeLeft = 0;
        setSecondsLeft(0);
        clearInterval(interval);
        nextRound();
      }
      timeLeft = timeLeft - 1;
    }, 1000);
  };

  //Controls what is shown
  useEffect(() => {
    if (isPlaying) {
      //Start measuring time taken to answer
      setCurrentTime(Date.now());
    } else if (start) {
      //End of quiz
      onRoundEnd();
    }
  }, [isPlaying]);

  useEffect(
    () =>
      navigation.addListener(
        'beforeRemove',
        (e: EventArg<'beforeRemove', true, {action: NavigationAction}>) => {
          if (e.data.action.type != 'GO_BACK' || end) {
            database()
              .ref('/games/' + gameId)
              .remove();
            database()
              .ref('/users/' + userId)
              .set(true);
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
  useEffect(() => {
    if (timeStamp !== 0 && !isPlaying) startCountdown();
  }, [timeStamp]);

  useEffect(() => {
    if (timeUploaded) {
      database()
        .ref('/games/' + gameId)
        .update({startTimestamp: firebase.database.ServerValue.TIMESTAMP});
    }
  }, [timeUploaded]);

  useEffect(() => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {type: 'easeOut', property: 'opacity'},
      update: {type: 'spring', springDamping: 100},
      delete: {type: 'easeOut', property: 'opacity'},
    });
  }, [isPlaying, submit, points, secondsLeft, end]);

  useFocusEffect(
    useCallback(() => {
      database()
        .ref('/users/' + userId)
        .set(false);
      if (questionBank.length === 0) getQuestions();
      //Get user data
      if (playerData.length === 0) getPlayerData();
      database()
        .ref('/games/' + gameId + '/isWaiting')
        .on('value', snapshot => {
          if (snapshot.val()) {
            if (
              isPlaying &&
              Object.keys(snapshot.val()).length === 2 &&
              Object.values(snapshot.val())[0] === true &&
              Object.values(snapshot.val())[1] === true
            ) {
              setIsPlaying(false);
            }
            //Waiting in between rounds
            else if (
              !isPlaying &&
              start &&
              !end &&
              Object.keys(snapshot.val()).length === 2 &&
              Object.values(snapshot.val())[0] === false &&
              Object.values(snapshot.val())[1] === false &&
              host &&
              timeUploaded === false
            ) {
              setTimeUploaded(true);
            }
            //Before the game starts
            else if (
              !isPlaying &&
              !start &&
              Object.keys(snapshot.val()).length === 2 &&
              Object.values(snapshot.val())[0] === false &&
              Object.values(snapshot.val())[1] === false &&
              host &&
              timeUploaded === false
            ) {
              setTimeUploaded(true);
            }
          } else {
            //One player has left
            setPlayerLeft(true);
            setStart(false);
            if (challengeActive) {
              setChallengeActive(false);
              setDeclined(true);
            }
            if (rematchRequest) {
              setRematchRequest(false);
              setCancelled(true);
            }
            setIsLoading(false);
          }
        });

      // If two people request at the same time it doesn't work
      database()
        .ref('/games/' + gameId + '/rematch')
        .on('value', snapshot => {
          if (end && snapshot.val()) {
            if (snapshot.val() === 'request' && !challengeActive) {
              setRematchRequest(true);
            } else if (snapshot.val() === 'accept' && challengeActive) {
              setChallengeActive(false);
              setTimeout(null);
              resetGame(true);
            } else if (snapshot.val() === 'decline') {
              if (challengeActive) {
                setTimeout(null);
                setChallengeActive(false);
                setDeclined(true);
              }
              setPlayerLeft(true);
            } else if (snapshot.val() === 'cancel' && rematchRequest) {
              setCancelled(true);
              setRematchRequest(false);
            } else if (snapshot.val() === 'active') {
              resetGame(false);
              setRematchRequest(false);
              database()
                .ref('/games/' + gameId + '/rematch')
                .remove();
            }
          }
        });

      //Removes lobby on disconnect
      database()
        .ref('/games/' + gameId)
        .onDisconnect()
        .remove();

      database()
        .ref('/games/' + gameId + '/startTimestamp')
        .on('value', snapshot => {
          if (snapshot.val() > 0 && secondsLeft <= 0) {
            setTimeStamp(snapshot.val());
          }
        });

      database()
        .ref('.info/serverTimeOffset')
        .once('value', snapshot => {
          setServerTimeOffset(snapshot.val());
        });

      //Turns off listeners on unmount
      return () => {
        database()
          .ref('/games/' + gameId + '/isWaiting')
          .off();
        database()
          .ref('/games/' + gameId + '/startTimestamp')
          .off();
        database()
          .ref('/games/' + gameId + '/rematch')
          .off();
        database().ref('.info/serverTimeOffset').off();
      };
    }, [
      isPlaying,
      timeUploaded,
      playerLeft,
      challengeActive,
      declined,
      rematchRequest,
      cancelled,
      isLoading,
      timeStamp,
      questionBank,
      playerData,
    ]),
  );

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar
        backgroundColor={
          remaining === 0 ? Theme.colors.surface : Theme.colors.elevation.level1
        }
      />
      <Portal>
        <Dialog
          visible={dialogVisible}
          dismissable={false}
          dismissableBackButton={false}>
          <Dialog.Icon icon={'alert-circle-outline'} />
          <Dialog.Title style={styles.title}>
            Match still in progress.
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              The match is still in progress and will end if you leave now. Are
              you sure you want to leave?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="text" onPress={() => setDialogVisible(false)}>
              Cancel
            </Button>
            <Button
              mode="text"
              onPress={() => {
                setDialogVisible(false);
                navigation.navigate('HomeScreen');
              }}>
              Leave
            </Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog
          visible={playerLeft && !end}
          dismissable={false}
          dismissableBackButton={false}>
          <Dialog.Icon icon={'alert-circle-outline'} />
          <Dialog.Title style={styles.title}>
            Other player has left the game.
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              The other player has quit the game. You will now return to the
              home screen.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="text"
              onPress={() => {
                setPlayerLeft(false);
                navigation.navigate('HomeScreen');
              }}>
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <RequestDialogs
        requestActive={rematchRequest}
        requestText={oppName + ' wants a rematch! Go again?'}
        requestActiveAccept={() => {
          database()
            .ref('/games/' + gameId)
            .update({rematch: 'accept'});
          setIsLoading(true);
        }}
        requestActiveDecline={() => {
          setRematchRequest(false);
          database()
            .ref('/games/' + gameId)
            .update({rematch: 'decline'});
        }}
        cancelled={cancelled}
        cancelledOnPress={() => {
          setCancelled(false);
        }}
        isLoading={isLoading}
      />
      <ChallengeDialogs
        challengeActive={challengeActive}
        challengeActiveOnPress={() => {
          database()
            .ref('/games/' + gameId)
            .update({rematch: 'cancel'});
          setChallengeActive(false);
          setTimeout(null);
        }}
        declined={declined}
        declinedOnPress={() => setDeclined(false)}
        isRematch={true}
        timedOut={timedOut}
        timedOutOnPress={() => setTimedOut(false)}
      />
      {end && !isLoading ? (
        <MultiplayerEnd
          points={points}
          data={playerData}
          userId={userId}
          difficulty={difficulty}
          onRematchPress={handleRematch}
          onPress={() => navigation.navigate('HomeScreen')}
          rematchDisabled={playerLeft}
        />
      ) : (
        <>
          <QuizHeader
            questionsRemaining={remaining}
            multiplayer={{
              onEndTime: handleSubmit,
              timer: submit ? false : true,
            }}
            onPress={() => setDialogVisible(true)}
          />
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={{flexGrow: 1}}
            showsVerticalScrollIndicator={false}>
            {!start && isLoading && playerData.length === 0 ? (
              <View style={styles.loadingScreen}>
                <ActivityIndicator />
                <Text
                  variant="bodyMedium"
                  style={{color: Theme.colors.onSurfaceVariant}}>
                  Loading game data...
                </Text>
              </View>
            ) : !start && playerData.length > 0 ? (
              <View style={styles.entryScreen}>
                <Text variant="headlineSmall">
                  {language.charAt(0).toUpperCase() + language.slice(1)}:{' '}
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </Text>
                <MultiplayerPlayers
                  data={playerData}
                  userId={userId}
                  endPage={false}
                />
                <Text
                  variant="bodyMedium"
                  style={{color: Theme.colors.onSurfaceVariant}}>
                  {secondsLeft === 0
                    ? 'Waiting for both players to be ready...'
                    : 'Get ready! Duel will begin in ' + secondsLeft + 's...'}
                </Text>
              </View>
            ) : isPlaying && !submit && question ? (
              <>
                <View style={styles.questionContainer}>
                  <Text variant={'headlineSmall'}>
                    {parseQuestion(question.question, 'header')}
                  </Text>
                  {parseQuestion(question.question, 'box') && (
                    <View style={styles.innerContainer}>
                      <Text variant={'headlineSmall'}>
                        {parseQuestion(question.question, 'box')}
                      </Text>
                    </View>
                  )}
                  <QuizButtons
                    question={question}
                    backgroundColor={styles.mainContainer.backgroundColor}
                    reveal={submit}
                    selected={answer}
                    onSelect={ans => setAnswer(ans)}
                  />
                </View>
                <QuizFooter
                  correct={answer === question.correct_answer}
                  explanation={question.explanation}
                  selected={answer !== ''}
                  submit={submit}
                  handleSubmit={handleSubmit}
                  multiplayer={true}
                />
              </>
            ) : isPlaying && submit ? (
              <View style={styles.loadingScreen}>
                <ActivityIndicator />
                <Text
                  variant="bodyMedium"
                  style={{color: Theme.colors.onSurfaceVariant}}>
                  Waiting for opponent to submit an answer...
                </Text>
              </View>
            ) : (
              !isLoading && (
                <>
                  {points.length !== 0 && (
                    <MultiplayerQuizStandings
                      points={points}
                      oldPoints={oldPoints}
                      data={playerData}
                      userId={userId}
                      secondsLeft={secondsLeft}
                    />
                  )}
                  <QuizFooter
                    correct={answer === question.correct_answer}
                    explanation={question.explanation}
                    selected={answer !== ''}
                    submit={submit}
                    handleSubmit={handleSubmit}
                    multiplayer={true}
                  />
                </>
              )
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default Multiplayer;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
  },
  entryScreen: {
    alignItems: 'center',
    gap: Constants.defaultGap,
    paddingHorizontal: Constants.edgePadding,
    paddingTop: Constants.defaultGap * 2,
    flex: 1,
  },
  loadingScreen: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Constants.defaultGap,
    padding: Constants.edgePadding,
    flex: 1,
  },
  questionContainer: {
    padding: Constants.edgePadding,
    gap: Constants.defaultGap,
    flex: 1,
  },
  innerContainer: {
    gap: Constants.defaultGap,
    paddingVertical: Constants.edgePadding * 2,
    paddingHorizontal: Constants.edgePadding * 2,
    borderRadius: Constants.radiusLarge,
    backgroundColor: Theme.colors.elevation.level2,
  },
  title: {
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
  },
});
