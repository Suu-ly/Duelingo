import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';

import Theme from './constants/theme.json';
import Constants from './constants/Constants';
import DuoButton from './DuoButton';
import Avatar from './Avatar';

interface ChallengeCardProps {
  data: string[];
  handleChallenge: (uid: string) => void;
}

const ChallengeCard = (props: ChallengeCardProps) => {
  const {data, handleChallenge} = props;
  return data.map((item, index) => {
    return (
      <View style={styles.card} key={index}>
        <View style={styles.info}>
          <View style={styles.imageContainer}>
            <Avatar index={2} style={styles.image} />
          </View>
          <View style={styles.text}>
            <Text
              variant="labelMedium"
              style={{color: Theme.colors.onSurfaceVariant}}>
              Lance
            </Text>
            <Text variant="bodyLarge">452 exp</Text>
          </View>
        </View>
        <DuoButton
          filled={false}
          backgroundDark={Theme.colors.secondary}
          backgroundColor={Theme.colors.elevation.level0}
          onPress={() => {
            handleChallenge(item);
          }}
          borderColor={Theme.colors.secondary}
          textColor={Theme.colors.secondary}>
          Challenge
        </DuoButton>
      </View>
    );
  });
};

export default ChallengeCard;

const styles = StyleSheet.create({
  card: {
    padding: Constants.edgePadding,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.elevation.level0,
    borderRadius: Constants.radiusLarge,
  },
  imageContainer: {
    width: 48,
    height: 48,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Constants.largeGap,
  },
  text: {
    gap: Constants.smallGap,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 256,
  },
});
