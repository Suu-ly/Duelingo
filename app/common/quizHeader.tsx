import {StyleSheet, View} from 'react-native';
import Theme from './constants/theme.json';
import Constants from './constants/Constants';
import {IconButton, ProgressBar} from 'react-native-paper';

interface QuizHeaderProps {
  backgroundColor?: string;
  totalQuestions?: number;
  questionsRemaining: number;
  timer?: boolean;
  multiplayer: boolean;
  onPress: () => void;
  onEndTime?: () => void;
  lives?: number;
}

const QuizHeader = (props: QuizHeaderProps) => {
  const {
    backgroundColor = Theme.colors.elevation.level1,
    totalQuestions = 5,
    questionsRemaining,
    timer,
    multiplayer,
    onPress,
    onEndTime,
    lives,
  } = props;
  return (
    <View style={[styles.barContainer, {backgroundColor: backgroundColor}]}>
      <IconButton
        icon={'arrow-left'}
        iconColor={Theme.colors.onSurfaceVariant}
        style={{marginRight: 22}}
        onPress={onPress}
      />
      {!multiplayer && (
        <View style={styles.progressBar}>
          <ProgressBar
            progress={
              (totalQuestions - questionsRemaining - 1 + 0.2) /
              (totalQuestions - 1)
            }
          />
        </View>
      )}
      {/* {!multiplayer && <HeartContainer lives={lives}/>} */}
      {/* {multiplayer &&  */}
      {/* <CountdownTimer onEnd={onEndTime}/> */}
      <View style={styles.filler} />
      {/* } */}
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
    gap: 12,
  },
  progressBar: {
    flex: 1,
  },
  filler: {
    width: 58,
    height: 48,
  },
});
