import {StyleSheet, View} from 'react-native';
import Theme from './constants/theme.json';
import Constants from './constants/Constants';
import {Text, Avatar} from 'react-native-paper';

interface TimerProps {
  points?: Record<string, unknown>[];
  exp?: Record<string, unknown>[];
  userUID: string;
  endPage: boolean;
  isFirst?: boolean;
}

//TODO pull avatar, name from database

const MultiplayerPlayers = (props: TimerProps) => {
  const {points, exp, userUID, endPage, isFirst} = props;

  const getIndex = (id: string, data: Record<string, unknown>[]) => {
    for (var index = 0; index < data.length; index++) {
      if (data[index].id === id) return index;
    }
    return 0;
  };

  const data = points ? points : exp ? exp : [];
  const userIndex = getIndex(userUID, data);
  const userName = data[userIndex].id as string;
  const userData = data[userIndex].value as number;
  const oppName = data[Math.abs(userIndex - 1)].id as string;
  const oppData = data[Math.abs(userIndex - 1)].value as number;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.card,
          !endPage
            ? {backgroundColor: Theme.colors.elevation.level0}
            : isFirst
            ? {
                backgroundColor: Theme.colors.elevation.level0,
                borderWidth: 2,
                borderColor: Theme.colors.primaryContainer,
              }
            : {backgroundColor: Theme.colors.elevation.level2},
        ]}>
        <Avatar.Text size={96} label={userName.slice(0, 2).toUpperCase()} />
        <Text variant="titleMedium" numberOfLines={1}>
          {userName}
        </Text>
        <Text
          variant="bodyMedium"
          style={{color: Theme.colors.onSurfaceVariant}}>
          {userData} {points ? 'points' : 'exp'}
        </Text>
      </View>
      <Text variant="labelLarge">vs</Text>
      <View
        style={[
          styles.card,
          !endPage
            ? {backgroundColor: Theme.colors.elevation.level0}
            : !isFirst
            ? {
                backgroundColor: Theme.colors.elevation.level0,
                borderWidth: 2,
                borderColor: Theme.colors.primaryContainer,
              }
            : {backgroundColor: Theme.colors.elevation.level2},
        ]}>
        <Avatar.Text size={96} label={oppName.slice(0, 2).toUpperCase()} />
        <Text variant="titleMedium" numberOfLines={1}>
          {oppName}
        </Text>
        <Text
          variant="bodyMedium"
          style={{color: Theme.colors.onSurfaceVariant}}>
          {oppData} {points ? 'points' : 'exp'}
        </Text>
      </View>
    </View>
  );
};

export default MultiplayerPlayers;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Constants.edgePadding,
    alignItems: 'center',
  },
  card: {
    paddingHorizontal: Constants.defaultGap,
    paddingVertical: Constants.edgePadding,
    gap: Constants.largeGap,
    borderRadius: Constants.radiusLarge,
    alignItems: 'center',
    maxWidth: 164,
  },
});
