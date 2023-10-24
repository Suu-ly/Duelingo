import {StyleSheet} from 'react-native';
import {Button, Dialog, Portal, Text} from 'react-native-paper';

import Constants from '../common/constants/Constants';

interface ChallengeDialogProps {
  challengeActive: boolean;
  challengeActiveOnPress: () => void;
  timedOut: boolean;
  timedOutOnPress: () => void;
  challengeClash?: boolean;
  challengeClashOnPress?: () => void;
  declined: boolean;
  declinedOnPress: () => void;
  isRematch: boolean;
}

const ChallengeDialogs = (props: ChallengeDialogProps) => {
  const {
    challengeActive,
    challengeActiveOnPress,
    timedOut,
    timedOutOnPress,
    challengeClash,
    challengeClashOnPress,
    declined,
    declinedOnPress,
    isRematch,
  } = props;

  return (
    <Portal>
      <Dialog
        visible={challengeActive}
        dismissable={false}
        dismissableBackButton={false}>
        <Dialog.Icon icon={'karate'} />
        <Dialog.Title style={styles.title}>
          {isRematch ? 'Rematch requested!' : 'Challenge requested!'}
        </Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">Waiting for player to respond...</Text>
        </Dialog.Content>
        <Dialog.Actions style={styles.actions}>
          <Button mode="text" onPress={challengeActiveOnPress}>
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog>
      <Dialog
        visible={timedOut}
        dismissable={false}
        dismissableBackButton={false}>
        <Dialog.Title>Challenge timed out.</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            The player has taken too long to respond to the challenge and the
            request has been automatically declined.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="text" onPress={timedOutOnPress}>
            Ok
          </Button>
        </Dialog.Actions>
      </Dialog>
      {challengeClash && (
        <Dialog
          visible={challengeClash}
          dismissable={false}
          dismissableBackButton={false}>
          <Dialog.Title>Challenge already exists.</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Another player has already challenged this player to a duel,
              please wait before issuing another challenge.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="text" onPress={challengeClashOnPress}>
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
      )}

      <Dialog
        visible={declined}
        dismissable={false}
        dismissableBackButton={false}>
        <Dialog.Title>Challenge declined.</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            The other player has declined the challenge request.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="text" onPress={declinedOnPress}>
            Ok
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default ChallengeDialogs;

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'column',
    gap: Constants.mediumGap,
  },
});
