import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Theme from '../common/constants/theme.json';
import CustomStatusBar from '../common/CustomStatusBar';
import QuizButtons from '../common/QuizButtons';
import Constants from '../common/constants/Constants';
import Questions from '../data/Translation Questions.json';
import DuoButton from '../common/DuoButton';

interface QuizProps {
  route: any;
  navigation: any;
}

const Quiz = (props: QuizProps) => {
  const {route, navigation} = props;
  const language: keyof typeof Questions = route.params.language;
  const difficulty: keyof typeof Questions.chinese = route.params.difficulty;
  const questionNo: number = route.params.questionNo;
  const question = Questions[language][difficulty][questionNo];

  const [answer, setAnswer] = useState('');
  const [submit, setSubmit] = useState(false);

  const handleSubmit = () => {
    if (submit) {
      navigation.push('Quiz', {
        language: language,
        difficulty: difficulty,
        questionNo: questionNo + 1,
      });
    } else {
      setSubmit(!submit);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar />
      <View style={styles.questionContainer}>
        <View style={styles.innerContainer}>
          <Text variant={'headlineSmall'}>{question.question}</Text>
          <Button
            icon="map-marker-outline"
            mode="contained"
            onPress={() => navigation.navigate('Home')}>
            Go to Home
          </Button>
        </View>
        <QuizButtons
          question={question}
          backgroundColor={styles.mainContainer.backgroundColor}
          reveal={submit}
          selected={answer}
          onSelect={ans => setAnswer(ans)}
        />
      </View>
      <View
        style={[
          styles.bottomContainer,
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
              <Text
                variant="bodyLarge"
                style={
                  answer === question.correct_answer
                    ? {color: Theme.colors.onSecondaryContainer}
                    : {color: Theme.colors.onErrorContainer}
                }>
                {question.explanation}
              </Text>
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
            submit ? Theme.colors.onPrimary : Theme.colors.onSecondaryContainer
          }
          onPress={() => handleSubmit()}>
          {submit ? 'Next' : 'Submit'}
        </DuoButton>
      </View>
    </View>
  );
};

export default Quiz;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
    justifyContent: 'center',
  },
  questionContainer: {
    flex: 1,
    paddingHorizontal: Constants.edgePadding,
    gap: Constants.defaultGap,
  },
  innerContainer: {
    alignItems: 'center',
    gap: Constants.defaultGap,
    marginTop: 132,
    paddingVertical: Constants.edgePadding,
    borderRadius: Constants.radiusExtraLarge,
    backgroundColor: Theme.colors.elevation.level2,
  },
  bottomContainer: {
    justifyContent: 'flex-end',
    paddingHorizontal: Constants.edgePadding,
    paddingTop: Constants.edgePadding,
    paddingBottom: 2 * Constants.edgePadding,
    gap: Constants.defaultGap,
  },
  submitContainer: {
    gap: Constants.mediumGap,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: Constants.mediumGap,
    alignItems: 'center',
  },
  explanation: {
    gap: Constants.smallGap,
  },
});
