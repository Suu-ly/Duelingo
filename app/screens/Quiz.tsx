import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import {Button, Text, Portal, Dialog} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {EventArg, NavigationAction} from '@react-navigation/native';

import Theme from '../common/constants/theme.json';
import CustomStatusBar from '../common/CustomStatusBar';
import QuizButtons from '../common/QuizButtons';
import Constants from '../common/constants/Constants';
import Questions from '../data/Translation Questions.json';
import DuoButton from '../common/DuoButton';
import QuizHeader from '../common/quizHeader';

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
  const language: keyof typeof Questions = route.params.language;
  const difficulty: keyof typeof Questions.chinese = route.params.difficulty;
  const questionNo: number = route.params.questionNo;
  const question = Questions[language][difficulty][questionNo];
  const remaining = route.params.remaining;

  const [answer, setAnswer] = useState('');
  const [submit, setSubmit] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

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

  //Need to standardise the formatting of the questions for this to work properly.
  //Right now it extracts the text contained within "" and puts it into a box
  //And replaces the text with "the following"
  const headerQuestion = parseQuestion(question.question, 'header');
  const boxQuestion = parseQuestion(question.question, 'box');

  React.useEffect(
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
    if (submit) {
      if (remaining === 0) {
        navigation.navigate('Home');
      } else {
        navigation.push('Quiz', {
          language: language,
          difficulty: difficulty,
          questionNo: questionNo + 1,
          remaining: remaining - 1,
        });
      }
    } else {
      LayoutAnimation.configureNext({
        duration: 300,
        update: {type: 'spring', springDamping: 100},
      });
      setSubmit(true);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar backgroundColor={Theme.colors.elevation.level1} />
      <QuizHeader
        questionsRemaining={remaining}
        multiplayer={false}
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
      <View style={styles.bottomContainer}>
        <View
          style={[
            styles.innerBottomContainer,
            submit && answer === question.correct_answer
              ? {backgroundColor: Theme.colors.secondaryContainer}
              : submit
              ? {backgroundColor: Theme.colors.errorContainer}
              : {backgroundColor: 'transparent'},
          ]}>
          {submit && (
            <View style={styles.submitContainer}>
              <View style={styles.rowContainer}>
                <Icon
                  name={
                    answer === question.correct_answer
                      ? 'check-circle-outline'
                      : 'alert-circle-outline'
                  }
                  size={Constants.iconMedium}
                  color={
                    answer === question.correct_answer
                      ? Theme.colors.onSecondaryContainer
                      : Theme.colors.onErrorContainer
                  }
                />
                <Text
                  variant="titleLarge"
                  style={
                    answer === question.correct_answer
                      ? {color: Theme.colors.onSecondaryContainer}
                      : {color: Theme.colors.onErrorContainer}
                  }>
                  {answer === question.correct_answer
                    ? 'Well Done!'
                    : 'Incorrect'}
                </Text>
              </View>
              <View style={styles.explanation}>
                <Text
                  variant="labelLarge"
                  style={
                    answer === question.correct_answer
                      ? {color: Theme.colors.onSecondaryContainer}
                      : {color: Theme.colors.onErrorContainer}
                  }>
                  Explanation:
                </Text>
                <ScrollView
                  style={styles.explanationScroll}
                  showsHorizontalScrollIndicator={true}>
                  <Text
                    variant="bodyLarge"
                    style={
                      answer === question.correct_answer
                        ? {color: Theme.colors.onSecondaryContainer}
                        : {color: Theme.colors.onErrorContainer}
                    }>
                    {question.explanation}
                  </Text>
                </ScrollView>
              </View>
            </View>
          )}
          <DuoButton
            disabled={answer === ''}
            backgroundColor={
              submit && answer === question.correct_answer
                ? Theme.colors.primary
                : submit
                ? Theme.colors.error
                : Theme.colors.secondaryContainer
            }
            backgroundDark={
              submit && answer === question.correct_answer
                ? Theme.colors.primaryDark
                : submit
                ? Theme.colors.errorDark
                : Theme.colors.secondaryContainerDark
            }
            stretch={true}
            textColor={
              submit
                ? Theme.colors.onPrimary
                : Theme.colors.onSecondaryContainer
            }
            onPress={() => handleSubmit()}>
            {submit ? 'Next' : 'Submit'}
          </DuoButton>
        </View>
      </View>
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
            <Button mode="text" onPress={() => navigation.navigate('Home')}>
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
    gap: 36,
  },
  innerContainer: {
    gap: Constants.defaultGap,
    paddingVertical: Constants.edgePadding * 2,
    paddingHorizontal: Constants.edgePadding * 2,
    borderRadius: Constants.radiusLarge,
    backgroundColor: Theme.colors.elevation.level2,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  innerBottomContainer: {
    flexShrink: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: Constants.edgePadding,
    paddingTop: Constants.edgePadding,
    paddingBottom: 2 * Constants.edgePadding,
    gap: Constants.defaultGap,
  },
  submitContainer: {
    gap: Constants.mediumGap,
    flexShrink: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: Constants.mediumGap,
    alignItems: 'center',
  },
  explanation: {
    gap: Constants.smallGap,
    flexShrink: 1,
  },
  explanationScroll: {
    flexShrink: 1,
    minHeight: 24 * 1.6,
  },
  title: {
    textAlign: 'center',
  },
});
