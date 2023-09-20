import {Animated, Easing, StyleSheet, View} from 'react-native';
import Theme from './constants/theme.json';
import Constants from './constants/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text} from 'react-native-paper';
import {useEffect, useRef} from 'react';

interface HeartProps {
  lives: number;
}

const HeartContainer = (props: HeartProps) => {
  const {lives} = props;

  const animationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animationValue, {
      toValue: 100,
      duration: 400,
      easing: Easing.bezier(0.2, 0, 0, 1),
      useNativeDriver: false,
    }).start();

    const delay = setTimeout(() => {
      animationValue.setValue(0);
    }, 400);

    return () => clearTimeout(delay);
  }, [lives]);

  const color = animationValue.interpolate({
    inputRange: [0, 50, 100],
    outputRange: ['white', 'red', 'white'],
    extrapolate: 'clamp',
  });
  return (
    <View style={[styles.container, {borderColor: color}]}>
      <Icon name="heart" color={Theme.colors.error} size={24} />
      <Text variant="titleMedium" style={{color: Theme.colors.error}}>
        {lives}
      </Text>
    </View>
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
