import {Animated, Easing, StyleSheet} from 'react-native';
import Theme from './constants/theme.json';
import Constants from './constants/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text} from 'react-native-paper';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {checkTimestamp, getLives, increaseLives} from '../utils/firestore';
import auth from '@react-native-firebase/auth';

interface HeartProps {
  animate?: boolean;
}

const HeartContainer = (props: HeartProps) => {
  const {animate = true} = props;
  const animationValue = useRef(new Animated.Value(100)).current;
  const [lives, setLives] = useState<number | undefined>();
  const userId = auth().currentUser!.uid;
  let interval: NodeJS.Timeout;

  useEffect(() => {
    if (animate) {
      Animated.timing(animationValue, {
        toValue: 100,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
      const delay = setTimeout(() => {
        animationValue.setValue(0);
      }, 1000);
      return () => clearTimeout(delay);
    }
  }, [lives]);

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = getLives(userId, setLives);

      if (lives! >= 5) {
        clearInterval(interval);
        console.log('Reset heart container lives is not required');
      } else {
        interval = setInterval(async () => {
          const timestamps = await checkTimestamp(userId);
          if (timestamps.isPassedTimestamp) {
            clearInterval(interval);
            setLives(lives! + 1);
            await increaseLives(userId);
          }
        }, 5000);
      }

      return () => {
        clearInterval(interval);
        // Unsubscribe from the real-time listener when the component unmounts
        unsubscribe();
      };
    }, [lives]),
  );

  const color = animationValue.interpolate({
    inputRange: [0, 10, 60, 100],
    outputRange: [
      'rgba(187, 24, 32, 0)',
      Theme.colors.error,
      Theme.colors.error,
      'rgba(187, 24, 32, 0)',
    ],
    extrapolate: 'clamp',
  });
  return (
    <Animated.View style={[styles.container, {borderColor: color}]}>
      <Icon name="heart" color={Theme.colors.error} size={24} />
      <Text variant="titleMedium" style={{color: Theme.colors.error}}>
        {lives}
      </Text>
    </Animated.View>
  );
};

export default HeartContainer;

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
