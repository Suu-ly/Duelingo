import {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import {
  Button,
  Text,
  Portal,
  Dialog,
  ActivityIndicator,
} from 'react-native-paper';
import {EventArg, NavigationAction} from '@react-navigation/native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {getQuiz} from '../utils/database';
import useCountdown from '../utils/useCountdown';

import Theme from '../common/constants/theme.json';
import CustomStatusBar from '../common/CustomStatusBar';
import QuizButtons from '../common/QuizButtons';
import Constants from '../common/constants/Constants';
import QuizHeader from '../common/QuizHeader';
import QuizFooter from '../common/QuizFooter';

interface MultiplayerProps {
  route: any;
  navigation: any;
}

const Multiplayer = (props: MultiplayerProps) => {
  const {route, navigation} = props;
  //Your own userId
  const userId = auth().currentUser?.uid;
  //Remaining number of questions, used to select the question
  const [remaining, setRemaining] = useState(5);
  const language = route.params.language;
  const difficulty = route.params.difficulty;

  //Array containing all questions
  const [questionBank, setQuestionBank] = useState<
    {
      question: string;
      correct_answer: string;
      explanation: string;
      options: string[];
    }[]
  >([]);

  //Updates the current question
  const [question, setQuestion] = useState<{
    question: string;
    correct_answer: string;
    explanation: string;
    options: string[];
  }>(questionBank[5 - remaining]);

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
  var interval: NodeJS.Timeout | undefined = undefined;
  //Keeps track of whether the game has started
  const [start, setStart] = useState(false);
  //Keeps track of time taken to answer for points
  const [currentTime, setCurrentTime] = useState(-1);
  //Keeps track of seconds left before next screen
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timeStamp, setTimeStamp] = useState(0);
  //Keeps track of points for both players
  const [myPoints, setMyPoints] = useState(0);
  const [theirPoints, setTheirPoints] = useState(0);
  //Decides whether to show the progress won't be saved dialog
  const [dialogVisible, setDialogVisible] = useState(false);

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
    if (timeTaken < 75) return 1000;
    else if (75 <= timeTaken && timeTaken < 15000)
      return Math.floor(-8.19232 * Math.sqrt(timeTaken - 75) + 1000);
    else return 0;
  };

  //Gets the quiz questions from database
  const getQuestions = async () => {
    const chosenQns = await database()
      .ref('/games/' + gameId + '/questions')
      .once('value');
    const qns = (await getQuiz(language)).data();
    if (qns && userId) {
      chosenQns.val().forEach((item: number) => {
        setQuestionBank(old => [...old, qns[difficulty][item]]);
      });
      database()
        .ref('/games/' + gameId + '/isReady')
        .update({[userId]: true});
    } else {
      console.log("Can't retrieve questions");
    }
  };

  const getPoints = async () => {
    var points = await database()
      .ref('/games/' + gameId + '/points')
      .once('value');
    if (Object.keys(points.val())[0] === userId) {
      setMyPoints(Object.values(points.val())[0] as number);
      setTheirPoints(Object.values(points.val())[1] as number);
    } else {
      setMyPoints(Object.values(points.val())[1] as number);
      setTheirPoints(Object.values(points.val())[0] as number);
    }
    if (userId) {
      database()
        .ref('/games/' + gameId + '/isWaiting')
        .update({[userId]: false});
    }
  };

  const handleSubmit = () => {
    setSubmit(true);
    if (answer === question?.correct_answer) {
      database()
        .ref('/games/' + gameId + '/points/' + userId)
        .transaction(currentPts => {
          return calculateScore(Date.now() - currentTime) + currentPts;
        });
    }
    if (userId) {
      database()
        .ref('/games/' + gameId + '/isWaiting')
        .update({[userId]: true});
    }
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
    if (host) {
      database()
        .ref('/games/' + gameId)
        .update({startTimestamp: 0});
      setTimeUploaded(false);
    }
  };

  const startCountdown = () => {
    console.log('Countdown running: ', host);
    interval = setInterval(() => {
      var timeLeft = Math.ceil((5000 - (Date.now() - timeStamp)) / 1000);
      timeLeft = timeLeft <= 0 ? 0 : timeLeft;
      setSecondsLeft(timeLeft);
      if (timeLeft === 0) {
        setSecondsLeft(0);
        clearInterval(interval);
        nextRound();
      }
    }, 100);
  };

  //Listens to the database for any updates
  if (questionBank.length === 0) getQuestions();
  database()
    .ref('/games/' + gameId + '/isWaiting')
    .on('value', snapshot => {
      if (
        isPlaying &&
        Object.values(snapshot.val())[0] === true &&
        Object.values(snapshot.val())[1] === true
      ) {
        setIsPlaying(false);
      }
      //Waiting in between rounds
      else if (
        !isPlaying &&
        start &&
        Object.values(snapshot.val())[0] === false &&
        Object.values(snapshot.val())[1] === false &&
        host &&
        timeUploaded === false
      ) {
        setTimeUploaded(true);
        console.log('Players no longer waiitng');
      }
    });

  database()
    .ref('/games/' + gameId + '/isReady')
    .on('value', snapshot => {
      if (
        !start &&
        Object.keys(snapshot.val()).length === 2 &&
        Object.values(snapshot.val())[0] === true &&
        Object.values(snapshot.val())[1] === true &&
        host &&
        timeUploaded === false
      ) {
        setTimeUploaded(true);
        console.log('Players ready');
      }
    });

  database()
    .ref('/games/' + gameId + '/startTimestamp')
    .on('value', snapshot => {
      if (snapshot.val() > 0 && secondsLeft <= 0) {
        if (!host) setTimeStamp(snapshot.val());
      }
    });

  //Controls what is shown
  useEffect(() => {
    if (isPlaying) {
      //Start measuring time taken to answer
      setCurrentTime(Date.now());
    } else if (start) {
      //End of quiz
      if (remaining === 1) {
        // navigation.navigate('Home');
      }
      //Waiting screen
      setRemaining(remaining - 1);
      getPoints();
    }
  }, [isPlaying]);

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

  useEffect(() => {
    if (timeStamp !== 0 && !isPlaying) startCountdown();
  }, [timeStamp]);

  useEffect(() => {
    if (timeUploaded) {
      console.log('Host uploading time');
      database()
        .ref('/games/' + gameId)
        .update({startTimestamp: Date.now()});
      setTimeStamp(Date.now());
    }
  }, [timeUploaded]);

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar backgroundColor={Theme.colors.elevation.level1} />
      <QuizHeader
        questionsRemaining={remaining}
        multiplayer={{
          onEndTime: handleSubmit,
          timer: submit ? false : true,
        }}
        onPress={() => setDialogVisible(true)}
      />
      {!start ? (
        <View style={styles.entryScreen}>
          <Text variant="headlineSmall">
            {language.charAt(0).toUpperCase() + language.slice(1)}:{' '}
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Text>
          <Text
            variant="titleMedium"
            style={{color: Theme.colors.onSurfaceVariant}}>
            {secondsLeft === 0
              ? 'Waiting for both players to be ready...'
              : 'Get ready! Duel will begin in ' + secondsLeft + 's...'}
          </Text>
        </View>
      ) : isPlaying && remaining > 0 && !submit ? (
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
        <>
          <Text variant="headlineSmall">Intermission Screen</Text>
          <Text
            variant="titleMedium"
            style={{color: Theme.colors.onSurfaceVariant}}>
            {secondsLeft !== 0 &&
              'Next round will begin in ' + secondsLeft + 's...'}
          </Text>
          <QuizFooter
            correct={answer === question.correct_answer}
            explanation={question.explanation}
            selected={answer !== ''}
            submit={submit}
            handleSubmit={handleSubmit}
            multiplayer={true}
          />
        </>
      )}

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
              The match is still in progress and will be recorded as a loss if
              you leave now. Are you sure you want to leave?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="text" onPress={() => setDialogVisible(false)}>
              Cancel
            </Button>
            <Button mode="text" onPress={() => navigation.navigate('Home')}>
              Leave
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    justifyContent: 'center',
    gap: Constants.defaultGap,
    padding: Constants.edgePadding,
  },
  loadingScreen: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Constants.defaultGap,
    padding: Constants.edgePadding,
  },
  questionContainer: {
    padding: Constants.edgePadding,
    gap: Constants.defaultGap,
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
});