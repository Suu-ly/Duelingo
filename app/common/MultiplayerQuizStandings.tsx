import {StyleSheet, View} from 'react-native';
import Theme from './constants/theme.json';
import Constants from './constants/Constants';
import {Text, Avatar} from 'react-native-paper';
import {CountUp} from 'use-count-up';

interface TimerProps {
  data: Record<string, unknown>[];
  oldData: Record<string, unknown>[];
  userUID: string;
  secondsLeft: number;
}

const MultiplayerQuizStandings = (props: TimerProps) => {
  const {data, oldData, userUID, secondsLeft} = props;

  const isFirst = data[0].id === userUID;

  const getOldValue = (id: string) => {
    for (var index = 0; index < oldData.length; index++) {
      if (oldData[index].id === id) return oldData[index].value as number;
    }
    return 0;
  };

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text variant="headlineSmall">Current Standings</Text>
        <Text
          variant="bodyLarge"
          style={{color: Theme.colors.onSurfaceVariant}}>
          {isFirst ? "You're in the lead!" : 'You can still catch up!'}
        </Text>
      </View>
      {data.map(value => {
        return (
          typeof value.id === 'string' &&
          typeof value.value === 'number' && (
            <View
              key={value.id}
              style={[
                styles.card,
                value.id === userUID && isFirst
                  ? {
                      backgroundColor: Theme.colors.elevation.level0,
                      borderWidth: 2,
                      borderColor: Theme.colors.primaryContainer,
                    }
                  : value.id === userUID
                  ? {
                      backgroundColor: Theme.colors.elevation.level0,
                      borderWidth: 2,
                      borderColor: Theme.colors.tertiary,
                    }
                  : {backgroundColor: Theme.colors.elevation.level2},
              ]}>
              <Avatar.Text
                size={48}
                label={value.id.slice(0, 2).toUpperCase()}
              />
              <View style={styles.details}>
                <Text
                  variant="labelMedium"
                  style={{color: Theme.colors.onSurfaceVariant}}>
                  {value.id}
                </Text>
                <Text variant="bodyMedium">
                  <CountUp
                    isCounting
                    start={getOldValue(value.id)}
                    end={value.value as number}
                    decimalPlaces={0}
                    duration={2}
                  />{' '}
                  Points
                </Text>
              </View>
            </View>
          )
        );
      })}
      <Text variant="bodyLarge" style={{color: Theme.colors.onSurfaceVariant}}>
        {secondsLeft !== 0
          ? 'Next round will begin in ' + secondsLeft + 's...'
          : ' '}
      </Text>
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
  },
});
