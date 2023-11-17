import {Animated, Easing, StyleSheet, View} from 'react-native';
import {useEffect, useRef} from 'react';
import {Text} from 'react-native-paper';
import {CountUp} from 'use-count-up';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

import Theme from './constants/theme.json';
import Constants from './constants/Constants';
import Avatar from './Avatar';

interface TimerProps {
  points: Record<string, unknown>[];
  oldPoints: Record<string, unknown>[];
  data: FirebaseFirestoreTypes.DocumentData[];
  userId: string;
  secondsLeft: number;
}

const MultiplayerQuizStandings = (props: TimerProps) => {
  const {points, oldPoints, data, userId, secondsLeft} = props;

  const isTie = points[0].value === points[1].value;
  const firstTurn = oldPoints.length === 0;
  const isFirst = points[0].uid === userId;
  const oldIsFirst = !firstTurn && oldPoints[0].uid === userId;

  const animationValue = useRef(
    new Animated.Value(
      isTie || firstTurn || isFirst === oldIsFirst
        ? 0
        : isFirst && !oldIsFirst
        ? 104
        : -104,
    ),
  ).current;
  const animationValue2 = useRef(
    new Animated.Value(
      isTie || firstTurn || isFirst === oldIsFirst
        ? 0
        : isFirst && !oldIsFirst
        ? -104
        : 104,
    ),
  ).current;

  const animate = () => {
    Animated.parallel([
      Animated.timing(animationValue, {
        delay: 500,
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
        easing: Easing.bezier(0.8, 0, 0.2, 1.0),
      }),
      Animated.timing(animationValue2, {
        delay: 500,
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
        easing: Easing.bezier(0.8, 0, 0.2, 1.0),
      }),
    ]).start();
  };

  const getOldValue = (uid: string) => {
    for (let index = 0; index < oldPoints.length; index++) {
      if (oldPoints[index].uid === uid) return oldPoints[index].value as number;
    }
    return 0;
  };

  const getDataIndex = (
    uid: string,
    data: FirebaseFirestoreTypes.DocumentData[],
  ) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].uid === uid) return i;
    }
    return 0;
  };

  useEffect(() => {
    animate();
  }, [isFirst]);

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text variant="headlineSmall">Current Standings</Text>
        <Text
          variant="bodyLarge"
          style={{color: Theme.colors.onSurfaceVariant}}>
          {isTie
            ? "It's a tie!"
            : isFirst
            ? "You're in the lead!"
            : 'You can still catch up!'}
        </Text>
      </View>
      {points.map((value, index) => {
        return (
          typeof value.uid === 'string' &&
          typeof value.value === 'number' && (
            <Animated.View
              key={value.uid}
              style={[
                styles.card,
                {
                  transform: [
                    {
                      translateY:
                        value.uid === userId ? animationValue : animationValue2,
                    },
                  ],
                },
                !isTie && value.uid === userId && isFirst
                  ? {
                      backgroundColor: Theme.colors.elevation.level0,
                      borderWidth: 2,
                      borderColor: Theme.colors.primaryContainer,
                    }
                  : !isTie && value.uid === userId
                  ? {
                      backgroundColor: Theme.colors.elevation.level0,
                      borderWidth: 2,
                      borderColor: Theme.colors.tertiary,
                    }
                  : isTie
                  ? {backgroundColor: Theme.colors.elevation.level0}
                  : {backgroundColor: Theme.colors.elevation.level2},
              ]}>
              <Avatar
                style={styles.avatar}
                index={data[getDataIndex(value.uid, data)].avatar}
              />
              <View style={styles.details}>
                <Text
                  variant="labelMedium"
                  style={{color: Theme.colors.onSurfaceVariant}}
                  numberOfLines={1}>
                  {data[getDataIndex(value.uid, data)].displayName}
                </Text>
                <Text variant="bodyMedium">
                  <CountUp
                    isCounting
                    start={getOldValue(value.uid)}
                    end={value.value as number}
                    decimalPlaces={0}
                    duration={2}
                  />{' '}
                  Points
                </Text>
              </View>
            </Animated.View>
          )
        );
      })}
      {secondsLeft !== 0 && (
        <Text
          variant="bodyLarge"
          style={{color: Theme.colors.onSurfaceVariant}}>
          {'Next round will begin in ' + secondsLeft + 's...'}
        </Text>
      )}
    </View>
  );
};

export default MultiplayerQuizStandings;

const styles = StyleSheet.create({
  container: {
    paddingTop: 90,
    paddingHorizontal: Constants.edgePadding,
    alignItems: 'center',
    gap: Constants.defaultGap,
    flex: 1,
  },
  heading: {
    gap: Constants.mediumGap,
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    gap: Constants.largeGap,
    width: '100%',
    borderRadius: Constants.radiusLarge,
    alignItems: 'center',
    padding: Constants.edgePadding,
  },
  details: {
    gap: Constants.smallGap,
    flex: 1,
  },
  avatar: {
    height: 48,
    width: 48,
    borderRadius: 256,
    overflow: 'hidden',
  },
});
