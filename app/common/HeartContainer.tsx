import {Animated, Easing, StyleSheet, View} from 'react-native';
import Theme from './constants/theme.json';
import Constants from './constants/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text, TouchableRipple} from 'react-native-paper';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {checkTimestamp, getLives, increaseLives} from '../utils/firestore';
import auth from '@react-native-firebase/auth';
import HeartInfoDialog from './HeartInfoDialog';

interface HeartProps {
  animate?: boolean;
}

const HeartContainer = (props: HeartProps) => {
  const {animate = true} = props;
  const animationValue = useRef(new Animated.Value(100)).current;
  const [lives, setLives] = useState<number | undefined>();
  const [visible, setVisible] = useState(false);
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
    <Animated.View style={[styles.mainContainer, {borderColor: color}]}>
      <TouchableRipple disabled={lives === 5} onPress={() => setVisible(true)}>
        <View style={styles.container}>
          <Icon name="heart" color={Theme.colors.error} size={24} />
          <Text variant="titleMedium" style={{color: Theme.colors.error}}>
            {lives}
          </Text>
        </View>
      </TouchableRipple>
      <HeartInfoDialog visible={visible} onDismiss={() => setVisible(false)} />
    </Animated.View>
  );
};

export default HeartContainer;

const styles = StyleSheet.create({
  mainContainer: {
    borderRadius: Constants.radiusMedium,
    overflow: 'hidden',
    backgroundColor: Theme.colors.elevation.level0,
    borderWidth: 2,
  },
  container: {
    padding: Constants.mediumGap,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Constants.mediumGap,
  },
});
