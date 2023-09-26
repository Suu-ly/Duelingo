import {View, StyleSheet, Animated, Easing} from 'react-native';
import {Text} from 'react-native-paper';
import Theme from '../common/constants/theme.json';
import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import {CountUp} from 'use-count-up';
import {useRef} from 'react';

interface QuizEndProps {
  route: any;
  navigation: any;
}

const QuizEnd = (props: QuizEndProps) => {
  const {route, navigation} = props;

  const timeTaken = route.params.timeElapsed;
  const multiplayer = route.params.multiplayer;
  const score = route.params.score;
  const totalQuestions = route.params.totalQuestions;

  const animationValue = useRef(new Animated.Value(0)).current;

  const scale = animationValue.interpolate({
    inputRange: [0, 40, 100],
    outputRange: [1, 1.3, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar />
      <View style={styles.innerContainer}>
        <Text variant="displaySmall" style={{color: Theme.colors.tertiary}}>
          Lesson Complete!
        </Text>
        <View style={styles.statsContainer}>
          <Text variant="titleMedium" style={{color: Theme.colors.primary}}>
            Exp Gained
          </Text>
          <View style={styles.numberContainer}>
            <Animated.View style={{transform: [{scale: scale}]}}>
              <Text
                variant="headlineSmall"
                style={{color: Theme.colors.tertiary}}>
                +
                <CountUp
                  isCounting
                  end={52}
                  decimalPlaces={0}
                  duration={3.5}
                  onComplete={() => {
                    Animated.timing(animationValue, {
                      toValue: 100,
                      duration: 2000,
                      easing: Easing.bezier(0.4, 0, 0.2, 1),
                      useNativeDriver: true,
                    }).start();
                  }}
                />
              </Text>
            </Animated.View>
          </View>
        </View>
        <View style={styles.statsContainer}>
          <Text variant="titleMedium" style={{color: Theme.colors.primary}}>
            Score
          </Text>
          <View style={styles.numberContainer}>
            <Text
              variant="headlineSmall"
              style={{color: Theme.colors.onSurface}}>
              {((score / totalQuestions) * 100).toFixed(0)}%
            </Text>
          </View>
        </View>
        <View style={styles.statsContainer}>
          <Text variant="titleMedium" style={{color: Theme.colors.primary}}>
            Time Taken
          </Text>
          <View style={styles.numberContainer}>
            <Text
              variant="headlineSmall"
              style={{color: Theme.colors.onSurface}}>
              {Math.floor(timeTaken / 60)}:
              {(timeTaken % 60).toString().padStart(2, '0')}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        {multiplayer && (
          <View style={styles.buttonContainer}>
            <DuoButton
              backgroundColor={Theme.colors.surface}
              borderColor={Theme.colors.outline}
              stretch={true}
              filled={false}
              onPress={() => navigation.navigate('Home')}
              textColor={Theme.colors.onSurface}>
              Rematch
            </DuoButton>
          </View>
        )}
        <View style={styles.buttonContainer}>
          <DuoButton
            backgroundColor={Theme.colors.primary}
            backgroundDark={Theme.colors.primaryDark}
            stretch={true}
            onPress={() => navigation.navigate('Home')}
            textColor={Theme.colors.onPrimary}>
            Back to Home
          </DuoButton>
        </View>
      </View>
    </View>
  );
};

export default QuizEnd;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
  },
  innerContainer: {
    paddingHorizontal: Constants.edgePadding,
    paddingTop: 154,
    gap: Constants.defaultGap,
    alignItems: 'center',
  },
  statsContainer: {
    gap: Constants.largeGap,
    alignItems: 'center',
    width: '100%',
  },
  numberContainer: {
    padding: Constants.edgePadding,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.elevation.level0,
    borderRadius: Constants.radiusLarge,
    alignSelf: 'stretch',
  },
  bottomContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: Constants.edgePadding,
    paddingBottom: Constants.edgePadding * 2,
    gap: Constants.edgePadding,
  },
  buttonContainer: {
    flex: 1,
  },
});