import {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import {Button, Text, Portal, Dialog} from 'react-native-paper';
import {EventArg, NavigationAction} from '@react-navigation/native';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';

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
  //Remaining number of questions, used to select the question
  const [remaining, setRemaining] = useState(5);
  const language = route.params.language;
  const difficulty = route.params.difficulty;
  const [questionBank, setQuestionBank] = useState<
    {
      question: string;
      correct_answer: string;
      explanation: string;
      options: string[];
    }[]
  >([]);

  const getQuestions = async (remaining: number) => {
    const qns = await database()
      .ref('/games/' + gameId + '/questions')
      .once('value');
    qns.forEach(async element => {
      const qn = await firestore().collection('Quizzes').doc(language).get();
      setQuestionBank(old => [...old, qn[difficulty][element]]);
    });
  };

  //Updates the current question
  const [question, setQuestion] = useState<{
    question: string;
    correct_answer: string;
    explanation: string;
    options: string[];
  } | null>();

  //Check if player is a host for the game
  const host: boolean = route.params.host;

  //Game ID of the lobby
  const gameId: string = route.params.gameId;

  //To keep track of the users score
  const score = route.params.score;
  const totalQuestions = route.params.totalQuestions;

  //Selected answer
  const [answer, setAnswer] = useState('');
  //Keeps track of whether the user as submitted the answer
  const [submit, setSubmit] = useState(false);
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

  const headerQuestion = parseQuestion(question.question, 'header');
  const boxQuestion = parseQuestion(question.question, 'box');

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

  const handleSubmit = () => {
    setSubmit(true);
  };

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar backgroundColor={Theme.colors.elevation.level1} />
      <QuizHeader
        questionsRemaining={remaining}
        totalQuestions={totalQuestions}
        multiplayer={{onEndTime: () => setSubmit(true), timer: true}}
        onPress={() => setDialogVisible(true)}
      />
      <View style={styles.questionContainer}>
        <Text variant={'headlineSmall'}>{headerQuestion}</Text>
        {boxQuestion && (
          <View style={styles.innerContainer}>
            <Text variant={'headlineSmall'}>{boxQuestion}</Text>
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
        selected={answer === ''}
        submit={submit}
        handleSubmit={handleSubmit}
        multiplayer={true}
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
