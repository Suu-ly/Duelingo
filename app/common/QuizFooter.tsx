import {ScrollView, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text} from 'react-native-paper';
import DuoButton from './DuoButton';
import Constants from './constants/Constants';
import Theme from '../common/constants/theme.json';

interface QuizFooterProps {
  correct: boolean;
  explanation: string;
  selected: boolean;
  submit: boolean;
  handleSubmit: () => void;
  multiplayer?: boolean;
}

const QuizFooter = (props: QuizFooterProps) => {
  const {
    correct,
    explanation,
    selected,
    submit,
    handleSubmit,
    multiplayer = false,
  } = props;
  return (
    <View style={styles.bottomContainer}>
      <View
        style={[
          styles.innerBottomContainer,
          submit && correct
            ? {backgroundColor: Theme.colors.secondaryContainer}
            : submit
            ? {backgroundColor: Theme.colors.errorContainer}
            : {backgroundColor: 'transparent'},
        ]}>
        {submit && (
          <View style={styles.submitContainer}>
            <View style={styles.rowContainer}>
              <Icon
                name={correct ? 'check-circle-outline' : 'alert-circle-outline'}
                size={Constants.iconMedium}
                color={
                  correct
                    ? Theme.colors.onSecondaryContainer
                    : Theme.colors.onErrorContainer
                }
              />
              <Text
                variant="titleLarge"
                style={
                  correct
                    ? {color: Theme.colors.onSecondaryContainer}
                    : {color: Theme.colors.onErrorContainer}
                }>
                {correct ? 'Well Done!' : 'Incorrect'}
              </Text>
            </View>
            <View style={styles.explanation}>
              <Text
                variant="labelLarge"
                style={
                  correct
                    ? {color: Theme.colors.onSecondaryContainer}
                    : {color: Theme.colors.onErrorContainer}
                }>
                Explanation:
              </Text>
              <Text
                variant="bodyLarge"
                style={
                  correct
                    ? {color: Theme.colors.onSecondaryContainer}
                    : {color: Theme.colors.onErrorContainer}
                }>
                {explanation}
              </Text>
            </View>
          </View>
        )}
        {(!multiplayer || (multiplayer && !submit)) && (
          <DuoButton
            disabled={!selected}
            backgroundColor={
              submit && correct
                ? Theme.colors.primary
                : submit
                ? Theme.colors.error
                : Theme.colors.secondaryContainer
            }
            backgroundDark={
              submit && correct
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
            onPress={handleSubmit}>
            {submit ? 'Next' : 'Submit'}
          </DuoButton>
        )}
      </View>
    </View>
  );
};

export default QuizFooter;

const styles = StyleSheet.create({
  bottomContainer: {
    justifyContent: 'flex-end',
  },
  innerBottomContainer: {
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
