import {StyleSheet, View} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Dialog,
  Portal,
  Text,
} from 'react-native-paper';

import Constants from '../common/constants/Constants';
import DuoButton from './DuoButton';
import Theme from './constants/theme.json';

interface RequestDialogProps {
  requestActive: boolean;
  requestText: string;
  requestActiveAccept: () => void;
  requestActiveDecline: () => void;
  cancelled: boolean;
  cancelledOnPress: () => void;
  isLoading: boolean;
  isRematch?: boolean;
}

const RequestDialogs = (props: RequestDialogProps) => {
  const {
    requestActive,
    requestText,
    requestActiveAccept,
    requestActiveDecline,
    cancelled,
    cancelledOnPress,
    isLoading,
    isRematch,
  } = props;

  return (
    <Portal>
      <Dialog
        visible={requestActive}
        dismissable={false}
        dismissableBackButton={false}>
        <Dialog.Icon icon={'karate'} />
        <Dialog.Title style={styles.title}>
          {isRematch ? 'Rematch!' : 'Incoming challenge!'}
        </Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{requestText}</Text>
        </Dialog.Content>
        <View style={styles.actions}>
          <View style={styles.buttonContainer}>
            <DuoButton
              backgroundColor={Theme.colors.primary}
              backgroundDark={Theme.colors.primaryDark}
              stretch={true}
              onPress={requestActiveAccept}
              textColor={Theme.colors.onPrimary}>
              {!isLoading ? (
                'Accept'
              ) : (
                <ActivityIndicator color={Theme.colors.onPrimary} />
              )}
            </DuoButton>
          </View>
          <Button
            mode="text"
            onPress={requestActiveDecline}
            style={styles.decline}>
            Decline
          </Button>
        </View>
      </Dialog>
      <Dialog
        visible={cancelled}
        dismissable={false}
        dismissableBackButton={false}>
        <Dialog.Title>Challenge cancelled.</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            The other player has cancelled the challenge request
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="text" onPress={cancelledOnPress}>
            Ok
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default RequestDialogs;

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'column',
    gap: Constants.mediumGap,
    padding: Constants.defaultGap,
    paddingTop: 0,
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  decline: {
    flexDirection: 'row',
  },
});
