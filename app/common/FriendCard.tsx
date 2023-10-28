import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import DuoButton from './DuoButton';
import Theme from './constants/theme.json';
import Constants from './constants/Constants';

interface FriendCardProps {
    friendAvatar: string;
    friendName: string;
    friendExp: string;
    backgroundColor: string;
}

const FriendCard = (props: FriendCardProps) => {
  const {friendAvatar, friendName, friendExp, backgroundColor} = props;

  return (
    <View style={styles.friendContainer}>
        <DuoButton
            key={'Challenge'}
            filled={false}
            inactive={false}
            backgroundColor={backgroundColor}
            onPress={() => null} //to challenge friend
            height={60}
            stretch={true}
            textVariant="headlineSmall"
            textColor={Theme.colors.onSurface}
            borderColor={Theme.colors.onSurface}>
        </DuoButton>
    </View>
  );
};

export default FriendCard;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Theme.colors.surface,
    },

    friendContainer: {
        gap: Constants.mediumGap,
        alignSelf: 'stretch',
    },
});
