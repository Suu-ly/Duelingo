import {StyleSheet, View} from 'react-native';
import Theme from './constants/theme.json';
import Constants from './constants/Constants';
import {Text} from 'react-native-paper';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

import Avatar from './Avatar';

interface MultiplayerPlayersProps {
  points?: Record<string, unknown>[];
  data: FirebaseFirestoreTypes.DocumentData[];
  userId: string;
  endPage: boolean;
  isFirst?: boolean;
}

const MultiplayerPlayers = (props: MultiplayerPlayersProps) => {
  const {points, data, userId, endPage, isFirst} = props;

  const getIndex = (
    id: string,
    data: Record<string, unknown>[] | FirebaseFirestoreTypes.DocumentData[],
  ) => {
    for (let index = 0; index < data.length; index++) {
      if (data[index].uid === id) return index;
    }
    return 0;
  };

  const userIndex = getIndex(userId, data);
  const userName = data[userIndex].displayName as string;
  const userAvatar = data[userIndex].avatar as number;
  const oppAvatar = data[Math.abs(userIndex - 1)].avatar as number;
  const oppName = data[Math.abs(userIndex - 1)].displayName as string;

  const userData =
    endPage && points
      ? (points[getIndex(userId, points)].value as number)
      : (data[userIndex].exp as number);
  const oppData =
    endPage && points
      ? (points[Math.abs(getIndex(userId, points) - 1)].value as number)
      : (data[Math.abs(userIndex - 1)].exp as number);

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
        <Avatar style={styles.avatar} index={userAvatar} />
        <Text variant="titleMedium" numberOfLines={1}>
          {userName}
        </Text>
        <Text
          variant="bodyMedium"
          style={{color: Theme.colors.onSurfaceVariant}}>
          {userData} {endPage ? 'points' : 'exp'}
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
        <Avatar style={styles.avatar} index={oppAvatar} />
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
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 256,
    overflow: 'hidden',
  },
});
