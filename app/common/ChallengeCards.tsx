import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

import Theme from './constants/theme.json';
import Constants from './constants/Constants';
import DuoButton from './DuoButton';
import Avatar from './Avatar';

interface ChallengeCardProps {
  data: FirebaseFirestoreTypes.DocumentData[];
  onPress: (uid: string) => void | (() => void);
  challenge?: boolean;
  friendList?: boolean;
  friendSearch?: boolean;
  disabled?: boolean;
  navigation: any;
}

const ChallengeCard = (props: ChallengeCardProps) => {
  const {
    data,
    onPress,
    challenge,
    friendList,
    friendSearch,
    disabled,
    navigation,
  } = props;
  // const navigation = useNavigation<NavigationProp<ParamListBase>>();

  return data.map((item: Record<string, any>, index: number) => {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        key={index}
        onPress={() => {
          navigation.push('Landing');
        }}>
        <View style={styles.info}>
          <View style={styles.imageContainer}>
            <Avatar index={item.avatar} style={styles.image} />
          </View>
          <View style={styles.text}>
            <Text
              variant="labelMedium"
              style={{color: Theme.colors.onSurfaceVariant}}>
              {challenge ? item.displayName : item.username}
            </Text>
            <Text variant="bodyLarge">
              {challenge ? item.exp + ' exp' : item.displayName}
            </Text>
          </View>
        </View>
        <DuoButton
          filled={false}
          disabled={disabled}
          backgroundDark={Theme.colors.secondary}
          backgroundColor={Theme.colors.elevation.level0}
          onPress={() => {
            onPress(item.uid);
          }}
          borderColor={Theme.colors.secondary}
          textColor={Theme.colors.secondary}>
          {challenge
            ? 'Challenge'
            : friendList
            ? 'Remove'
            : friendSearch
            ? 'Add'
            : 'Added'}
        </DuoButton>
      </TouchableOpacity>
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
