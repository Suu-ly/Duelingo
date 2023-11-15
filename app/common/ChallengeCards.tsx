import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text, TouchableRipple} from 'react-native-paper';

import Theme from './constants/theme.json';
import Constants from './constants/Constants';
import DuoButton from './DuoButton';
import Avatar from './Avatar';

interface ChallengeCardProps {
  onPress: () => void;
  cardOnPress: () => void;
  avatarIndex: number;
  topText: string;
  bottomText: string;
  buttonText: string;
  buttonTextColor: string;
  buttonBorderColor: string;
  buttonWidth?: number;
  disabled?: boolean;
}

const ChallengeCard = (props: ChallengeCardProps) => {
  const {
    onPress,
    cardOnPress,
    avatarIndex,
    topText,
    bottomText,
    buttonText,
    buttonTextColor,
    buttonBorderColor,
    buttonWidth,
    disabled,
  } = props;

  return (
    <View style={styles.card}>
      <TouchableRipple style={styles.ripple} onPress={cardOnPress}>
        <View style={styles.cardContent}>
          <Avatar index={avatarIndex} style={styles.image} />
          <View style={styles.text}>
            <Text
              variant="labelMedium"
              style={{color: Theme.colors.onSurfaceVariant}}
              numberOfLines={1}>
              {topText}
            </Text>
            <Text
              variant="bodyLarge"
              numberOfLines={1}
              style={{flex: 1, flexDirection: 'row'}}>
              {bottomText}
            </Text>
          </View>
          <DuoButton
            filled={false}
            disabled={disabled}
            width={buttonWidth}
            backgroundDark={buttonBorderColor}
            backgroundColor={Theme.colors.elevation.level0}
            onPress={onPress}
            borderColor={buttonBorderColor}
            textColor={buttonTextColor}>
            {buttonText}
          </DuoButton>
        </View>
      </TouchableRipple>
    </View>
  );
};

export default ChallengeCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.elevation.level0,
    borderRadius: Constants.radiusLarge,
    overflow: 'hidden',
  },
  ripple: {
    padding: Constants.edgePadding,
  },
  cardContent: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Constants.largeGap,
  },
  text: {
    gap: Constants.smallGap,
    flex: 1,
  },
  image: {
    borderRadius: 256,
    width: 48,
    height: 48,
  },
});
