import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Text} from 'react-native-paper';
import Theme from '../common/constants/theme.json';

import CustomStatusBar from '../common/CustomStatusBar';
import QuizButtons from '../common/QuizButtons';
import Constants from '../common/constants/Constants';
import Questions from '../data/Translation Questions.json';
import DuoButton from '../common/DuoButton';

interface FilterProps {
  route: any;
  navigation: any;
}

const Filter = (props: FilterProps) => {
  const {route, navigation} = props;

  const [answer, setAnswer] = useState('');
  const [submit, setSubmit] = useState(false);

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar />
      <View style={styles.questionContainer}>
        <View style={styles.innerContainer}>
          <Text variant={'headlineLarge'}>{answer}</Text>
          <Button
            icon="map-marker-outline"
            mode="contained"
            onPress={() => navigation.navigate('Home')}>
            Go to Home
          </Button>
        </View>
        <QuizButtons
          question={Questions.chinese.easy[1]}
          backgroundColor={styles.mainContainer.backgroundColor}
          reveal={submit}
          onSelect={ans => setAnswer(ans)}
        />
      </View>
      <View
        style={[
          styles.bottomContainer,
          submit
            ? {backgroundColor: Theme.colors.secondaryContainer}
            : {backgroundColor: 'transparent'},
        ]}>
        <DuoButton
          backgroundColor={
            submit ? Theme.colors.primary : Theme.colors.secondaryContainer
          }
          backgroundDark={
            submit
              ? Theme.colors.primaryDark
              : Theme.colors.secondaryContainerDark
          }
          stretch={true}
          textColor={
            submit ? Theme.colors.onPrimary : Theme.colors.onSecondaryContainer
          }
          onPress={() => setSubmit(old => !old)}>
          {submit ? 'Next' : 'Submit'}
        </DuoButton>
      </View>
    </View>
  );
};

export default Filter;

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
    paddingHorizontal: Constants.edgePadding,
    justifyContent: 'flex-end',
    paddingTop: Constants.edgePadding,
    paddingBottom: 2 * Constants.edgePadding,
  },
});
