import {View, StyleSheet, Animated, Easing} from 'react-native';
import {Text} from 'react-native-paper';
import {CountUp} from 'use-count-up';
import {useRef} from 'react';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

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
}

const MultiplayerEnd = (props: MultiplayerEndProps) => {
  const {points, userId, data, onRematchPress, onPress, rematchDisabled} =
    props;

  const isFirst = points[0].uid === userId;

  const animationValue = useRef(new Animated.Value(0)).current;

  const scale = animationValue.interpolate({
    inputRange: [15, 50, 85],
    outputRange: [1, 1.2, 1],
    extrapolate: 'clamp',
  });

  const getExp = (uid: string) => {
    for (let index = 0; index < data.length; index++) {
      if (data[index].uid === userId) {
        return data[index].exp;
      }
    }
    return 0;
  };

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar />
      <View style={styles.innerContainer}>
        <Text
          variant="displaySmall"
          style={isFirst && {color: Theme.colors.tertiary}}>
          {isFirst ? 'You win!' : 'Better luck next time!'}
        </Text>
        <MultiplayerPlayers
          userId={userId}
          data={data}
          points={points}
          endPage={true}
          isFirst={isFirst}
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
                  end={52}
                  decimalPlaces={0}
                  duration={3.5}
                  onComplete={() => {
                    Animated.loop(
                      Animated.timing(animationValue, {
                        toValue: 100,
                        duration: 1000,
                        easing: Easing.bezier(0, 0.75, 1, 0.15),
                        useNativeDriver: false,
                      }),
                    ).start();
                  }}
                />
              </Text>
            </Animated.View>
          </View>
          <Text variant="titleMedium">Total exp: {getExp(userId) + 45}</Text>
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
