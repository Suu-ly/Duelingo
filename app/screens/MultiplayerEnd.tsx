import {View, StyleSheet, Animated, Easing} from 'react-native';
import {Text} from 'react-native-paper';
import {CountUp} from 'use-count-up';
import {useEffect, useRef} from 'react';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

import {calculateMultiplayerExp, updateExp} from '../utils/database';
import Theme from '../common/constants/theme.json';
import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import MultiplayerPlayers from '../common/MultiplayerPlayers';

interface MultiplayerEndProps {
  points: Record<string, unknown>[];
  userId: string;
  data: FirebaseFirestoreTypes.DocumentData[];
  onRematchPress: () => void;
  onPress: () => void;
  rematchDisabled: boolean;
  difficulty: string;
}

const MultiplayerEnd = (props: MultiplayerEndProps) => {
  const {
    points,
    userId,
    data,
    onRematchPress,
    onPress,
    rematchDisabled,
    difficulty,
  } = props;

  const isTie = points[0].value === points[1].value;
  const isFirst = points[0].uid === userId;
  const animationValue = useRef(new Animated.Value(0)).current;

  const scale = animationValue.interpolate({
    inputRange: [20, 50, 80],
    outputRange: [1, 1.2, 1],
    extrapolate: 'clamp',
  });

  const getExp = (uid: string) => {
    for (let index = 0; index < data.length; index++) {
      if (data[index].uid === uid) {
        return data[index].exp;
      }
    }
    return 0;
  };

  const userPoints = points[isFirst ? 0 : 1].value as number;

  const expGained = calculateMultiplayerExp(
    difficulty.toLowerCase(),
    userPoints,
  );

  useEffect(() => {
    updateExp(expGained);
  }, [expGained]);

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar />
      <View style={styles.innerContainer}>
        <Text
          variant="displaySmall"
          style={isFirst && {color: Theme.colors.tertiary}}>
          {isTie
            ? "It's a tie!"
            : isFirst
            ? 'You win!'
            : 'Better luck next time!'}
        </Text>
        <MultiplayerPlayers
          userId={userId}
          data={data}
          points={points}
          endPage={true}
          isFirst={isFirst}
          isTie={isTie}
        />
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
                  end={expGained}
                  decimalPlaces={0}
                  duration={3.5}
                  onComplete={() => {
                    Animated.loop(
                      Animated.timing(animationValue, {
                        toValue: 100,
                        duration: 1000,
                        easing: Easing.bezier(0, 0.9, 1, 0.1),
                        useNativeDriver: false,
                      }),
                    ).start();
                  }}
                />
              </Text>
            </Animated.View>
          </View>
          <Text variant="titleMedium">
            Total exp: {getExp(userId) + expGained}
          </Text>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.buttonContainer}>
          <DuoButton
            backgroundColor={Theme.colors.surface}
            borderColor={Theme.colors.outline}
            stretch={true}
            filled={false}
            disabled={rematchDisabled}
            onPress={onRematchPress}
            textColor={Theme.colors.onSurface}>
            Rematch
          </DuoButton>
        </View>

        <View style={styles.buttonContainer}>
          <DuoButton
            backgroundColor={Theme.colors.primary}
            backgroundDark={Theme.colors.primaryDark}
            stretch={true}
            onPress={onPress}
            textColor={Theme.colors.onPrimary}>
            Back to Home
          </DuoButton>
        </View>
      </View>
    </View>
  );
};

export default MultiplayerEnd;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
  },
  innerContainer: {
    alignItems: 'center',
    gap: Constants.defaultGap,
    paddingHorizontal: Constants.edgePadding,
    paddingTop: Constants.defaultGap * 2,
    flex: 1,
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
