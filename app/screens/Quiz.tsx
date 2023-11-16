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

import Theme from '../common/constants/theme.json';
import CustomStatusBar from '../common/CustomStatusBar';
import QuizButtons from '../common/QuizButtons';
import TeachingButtons from '../common/TeachingButton';
import DuoButton from '../common/DuoButton';
import Constants from '../common/constants/Constants';
import QuizHeader from '../common/QuizHeader';
import QuizFooter from '../common/QuizFooter';
import useTimeElapsed from '../utils/useTimeElapsed';
import {getLives, decreaseLives} from '../utils/firestore';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import HeartDialog from '../common/HeartDialog';

interface QuizProps {
  route: any;
  navigation: any;
}

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const Quiz = (props: QuizProps) => {
  const {route, navigation} = props;
  const language = route.params.language;
  const module = route.params.module;
  const topic = route.params.topic;
  const isLastCompletedTopic = route.params.isLastCompletedTopic;

  const [isLoading, setIsLoading] = useState(true);
  const [questionNo, setQuestionNo] = useState(1);
  const [questions, setQuestions] = useState<Record<string, any>[]>([]);
  const [questionTotal, setQuestionTotal] = useState(-1);
  const [scoreableQns, setScoreableQns] = useState(0);
  const [lives, setLives] = useState<number | undefined>(undefined);
  const userId = auth().currentUser!.uid;

  //To keep track of the time spent in the quiz
  const {timePassed, stopTimer} = useTimeElapsed(0);

  //To keep track of number of correct questions
  const [score, setScore] = useState(0);

  //Selected answer
  const [answer, setAnswer] = useState('');
  //Keeps track of whether the user as submitted the answer
  const [submit, setSubmit] = useState(false);
  //Decides whether to show the progress won't be saved dialog
  const [dialogVisible, setDialogVisible] = useState(false);
  //Decides whether to show the heart dialog
  const [heartDialogVisible, setHeartDialogVisible] = useState(false);

  const loadQuestions = async () => {
    var tempScoreQns = 0;
    var numQns = 0;
    var qns: Record<string, any>[] = [];
    const collecton = await firestore()
      .collection('Quiz')
      .doc(language)
      .collection('Modules')
      .doc(module)
      .collection('Topics')
      .doc(topic)
      .collection('Questions')
      .get();
    collecton.forEach(documentSnapshot => {
      numQns = numQns + 1;
      qns.push(documentSnapshot.data());
      if (documentSnapshot.data().gameFormat === 1) {
        tempScoreQns = tempScoreQns + 1;
      }
    });
    setQuestions(qns);
    setScoreableQns(tempScoreQns);
    setQuestionTotal(numQns);
    setIsLoading(false);
  };

  useEffect(
    () =>
      navigation.addListener(
        'beforeRemove',
        (e: EventArg<'beforeRemove', true, {action: NavigationAction}>) => {
          if (e.data.action.type !== 'GO_BACK') {
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

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = getLives(userId, setLives);

      return () => {
        // Unsubscribe from the real-time listener when the component unmounts
        unsubscribe;
      };
    }, [lives]),
  );

  useFocusEffect(
    useCallback(() => {
      if (questions.length === 0) loadQuestions();
    }, []),
  );

  const handleSubmit = () => {
    //Animates the diff
    LayoutAnimation.configureNext({
      duration: 300,
      create: {type: 'easeOut', property: 'opacity'},
      update: {type: 'spring', springDamping: 100},
      delete: {type: 'easeOut', property: 'opacity'},
    });
    //Navigates to end screen after remaining questions reach 0, else go to next question
    if (submit) {
      //Quiz end
      if (questionNo === questionTotal) {
        stopTimer();
        navigation.navigate('QuizEnd', {
          timeElapsed: timePassed,
          totalScoreableQuestions: scoreableQns,
          score:
            answer === questions[questionNo - 1].correct_answer
              ? score + 1
              : score,
          isLastCompletedTopic: isLastCompletedTopic,
          language: language,
        });
      } else {
        //Next question
        if (
          questions[questionNo - 1].gameFormat === 1 &&
          answer === questions[questionNo - 1].correct_answer
        ) {
          setScore(score + 1);
        }
        setSubmit(false);
        setQuestionNo(questionNo + 1);
        setAnswer('');
      }
    } else {
      //if the current question has a gameFormat of 0, questionNo = questionNo + 1
      if (questions[questionNo - 1].gameFormat === 0) {
        setQuestionNo(questionNo + 1);
      } else {
        //Go to submitted state
        setSubmit(true);
        if (answer !== questions[questionNo - 1].correct_answer) {
          if (lives === 1) setHeartDialogVisible(true);
          setLives(lives! - 1);
          decreaseLives(userId, lives!);
        }
      }
    }
  };

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar backgroundColor={Theme.colors.elevation.level1} />
      {isLoading ? (
        <View style={styles.loadingScreen}>
          <ActivityIndicator />
          <Text
            variant="bodyMedium"
            style={{color: Theme.colors.onSurfaceVariant}}>
            Loading questions...
          </Text>
        </View>
      ) : (
        <>
          <QuizHeader
            questionsRemaining={questionTotal - questionNo}
            totalQuestions={questionTotal}
            singleplayer={true}
            onPress={() => setDialogVisible(true)}
          />
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={{flexGrow: 1}}
            showsVerticalScrollIndicator={false}>
            <View style={styles.questionContainer}>
              {questions[questionNo - 1].gameFormat === 1 ? (
                <>
                  <Text variant={'headlineSmall'}>
                    {questions[questionNo - 1].question}
                  </Text>
                  <QuizButtons
                    question={questions[questionNo - 1]}
                    backgroundColor={styles.mainContainer.backgroundColor}
                    reveal={submit}
                    selected={answer}
                    onSelect={ans => setAnswer(ans)}
                  />
                </>
              ) : (
                <TeachingButtons
                  question={questions[questionNo - 1]}
                  backgroundColor={styles.mainContainer.backgroundColor}
                />
              )}
            </View>
          </ScrollView>

          {questions[questionNo - 1].gameFormat === 1 ? (
            <QuizFooter
              correct={answer === questions[questionNo - 1].correct_answer}
              explanation={questions[questionNo - 1].explanation}
              selected={answer !== ''}
              submit={submit}
              handleSubmit={handleSubmit}
            />
          ) : (
            <View style={styles.bottomContainer}>
              <DuoButton
                filled={true}
                inactive={false}
                backgroundColor={Theme.colors.primary}
                backgroundDark={Theme.colors.primaryDark}
                onPress={handleSubmit}
                stretch={true}
                textColor={Theme.colors.onPrimary}>
                Next
              </DuoButton>
            </View>
          )}
        </>
      )}

      <HeartDialog
        visible={heartDialogVisible}
        buttonText="Back to Home"
        onDismiss={() => setHeartDialogVisible(false)}
        onPress={() => navigation.navigate('HomeScreen')}
      />
      <Portal>
        <Dialog
          visible={dialogVisible}
          dismissable={false}
          dismissableBackButton={false}>
          <Dialog.Icon icon={'alert-circle-outline'} />
          <Dialog.Title style={styles.title}>
            Your progress will be lost.
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Your progress will not be saved if you choose to leave now. Are
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
      </Portal>
    </View>
  );
};

export default Quiz;

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

  bottomContainer: {
    justifyContent: 'flex-end',
    paddingHorizontal: Constants.edgePadding,
    paddingTop: Constants.edgePadding,
    paddingBottom: 2 * Constants.edgePadding,
  },
  title: {
    textAlign: 'center',
  },
  loadingScreen: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Constants.defaultGap,
    flex: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
  },
});
