import {StyleSheet, View} from 'react-native';
import {Text, Portal, Dialog, Button} from 'react-native-paper';

interface heartDialogProps {
  visible: boolean;
  bodyText: string;
  onDismiss: () => void;
}

const HeartDialog = (props: heartDialogProps) => {
  const {visible, bodyText, onDismiss} = props;
  return (
    <View>
      <Portal>
        <Dialog
          visible={visible}
          dismissable={false}
          dismissableBackButton={false}>
          <Dialog.Icon icon={'alert-circle-outline'} />
          <Dialog.Title style={styles.title}>
            You have ran out of lives.
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{bodyText}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="text" onPress={onDismiss}>
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
});

export default HeartDialog;
