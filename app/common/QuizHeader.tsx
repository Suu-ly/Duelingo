import {StyleSheet, View} from 'react-native';
import Theme from './constants/theme.json';
import Constants from './constants/Constants';
import {IconButton, ProgressBar, Text} from 'react-native-paper';
import HeartContainer from './HeartContainer';
import QuizTimer from './QuizTimer';

interface QuizHeaderProps {
  backgroundColor?: string;
  totalQuestions?: number;
  questionsRemaining: number;
  onPress: () => void;
  singleplayer?: boolean;
  multiplayer?: {onEndTime: () => void; timer: boolean};
}

const QuizHeader = (props: QuizHeaderProps) => {
  const {
    backgroundColor = Theme.colors.elevation.level1,
    totalQuestions = 5,
    questionsRemaining,
    singleplayer,
    multiplayer,
    onPress,
  } = props;
  return (
    <View style={[styles.barContainer, {backgroundColor: backgroundColor}]}>
      <IconButton
        icon={'arrow-left'}
        iconColor={Theme.colors.onSurfaceVariant}
        style={styles.backButton}
        onPress={onPress}
      />
      {singleplayer && (
        <View style={styles.progressBar}>
          <ProgressBar
            progress={
              totalQuestions - questionsRemaining === 1
                ? 0.02
                : (totalQuestions - questionsRemaining - 1) /
                  (totalQuestions - 1)
            }
          />
        </View>
      )}
      {singleplayer && <HeartContainer />}
      {multiplayer && (
        <>
          {multiplayer.timer ? (
            <QuizTimer onEndTime={multiplayer.onEndTime} />
          ) : (
            <Text variant="titleMedium">
              Round {totalQuestions - questionsRemaining + 1} of{' '}
              {totalQuestions}
            </Text>
          )}
          <View style={styles.filler} />
        </>
      )}
    </View>
  );
};

export default QuizHeader;

const styles = StyleSheet.create({
  barContainer: {
    paddingVertical: Constants.mediumGap,
    paddingLeft: Constants.smallGap,
    paddingRight: Constants.edgePadding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Constants.largeGap,
  },
  progressBar: {
    flex: 1,
  },
  backButton: {
    marginRight: Constants.largeGap,
  },
  filler: {
    width: 48,
    height: Constants.buttonSize,
  },
});
