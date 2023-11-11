import {StyleSheet, View} from 'react-native';
import {Text, Portal, Modal} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Constants from './constants/Constants';
import Theme from './constants/theme.json';
import DuoButton from './DuoButton';

interface heartDialogProps {
  visible: boolean;
  dismissable?: boolean;
  dismissableBackButton?: boolean;
  bodyText: string;
  buttonText: string;
  onDismiss: () => void;
}

const HeartDialog = (props: heartDialogProps) => {
  const {
    visible,
    dismissable = false,
    dismissableBackButton = false,
    bodyText,
    buttonText,
    onDismiss,
  } = props;
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        dismissable={dismissable}
        dismissableBackButton={dismissableBackButton}
        style={styles.bottomContainer}>
        <View style={styles.innerBottomContainer}>
          <View style={styles.visibleContainer}>
            <View style={styles.rowContainer}>
              <Icon
                name="heart-broken-outline"
                size={Constants.iconMedium}
                color={Theme.colors.onErrorContainer}
              />
            </View>
            <Text variant="headlineSmall" style={styles.titleText}>
              You have run out of lives.
            </Text>
            <Text
              variant="bodyLarge"
              style={{color: Theme.colors.onErrorContainer}}>
              {bodyText}
            </Text>
          </View>
          <DuoButton
            backgroundColor={Theme.colors.error}
            backgroundDark={Theme.colors.errorDark}
            stretch={true}
            textColor={Theme.colors.onPrimary}
            onPress={onDismiss}>
            {buttonText}
          </DuoButton>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
  },
  innerBottomContainer: {
    justifyContent: 'flex-end',
    paddingHorizontal: Constants.edgePadding,
    paddingTop: Constants.edgePadding,
    paddingBottom: 2 * Constants.edgePadding,
    gap: Constants.defaultGap,
    backgroundColor: Theme.colors.errorContainer,
  },
  visibleContainer: {
    gap: Constants.mediumGap,
    flexShrink: 1,
  },
  rowContainer: {
    alignItems: 'center',
  },
  titleText: {
    textAlign: 'center',
    color: Theme.colors.onErrorContainer,
  },
  bodyText: {
    gap: Constants.smallGap,
    flexShrink: 1,
  },
});

export default HeartDialog;
