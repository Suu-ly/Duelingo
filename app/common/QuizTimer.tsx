import {Animated, Easing, StyleSheet} from 'react-native';
import Theme from './constants/theme.json';
import Constants from './constants/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text} from 'react-native-paper';
import {useEffect, useRef, useState} from 'react';

interface TimerProps {
  seconds?: number;
  onEndTime: () => void;
}

const QuizTimer = (props: TimerProps) => {
  const {seconds = 15, onEndTime} = props;
  const [secondsLeft, setSecondsLeft] = useState(seconds);

  const animationValue = useRef(new Animated.Value(0)).current;

  const pulse = Animated.loop(
    Animated.timing(animationValue, {
      toValue: 100,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  );

  useEffect(() => {
    if (secondsLeft <= 0) return onEndTime();

    const timeout = setTimeout(() => {
      setSecondsLeft(secondsLeft - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [secondsLeft]);

  useEffect(() => {
    if (secondsLeft <= 5) {
      pulse.start();
    }
  }, [secondsLeft]);

  const color = animationValue.interpolate({
    inputRange: [15, 50, 85],
    outputRange: [
      'rgba(187, 24, 32, 0)',
      Theme.colors.error,
      'rgba(187, 24, 32, 0)',
    ],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.container, {borderColor: color}]}>
      <Icon name="timer-outline" color={Theme.colors.onSurface} size={24} />
      <Text variant="titleMedium" style={{color: Theme.colors.onSurface}}>
        {secondsLeft.toString().padStart(2, '0')}s
      </Text>
    </Animated.View>
  );
};

export default QuizTimer;

const styles = StyleSheet.create({
  container: {
    padding: Constants.mediumGap,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Constants.mediumGap,
    borderRadius: Constants.radiusMedium,
    borderWidth: 2,
    backgroundColor: Theme.colors.elevation.level0,
  },
});
