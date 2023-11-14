import {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, Portal, Modal, ActivityIndicator} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';

import Constants from './constants/Constants';
import Theme from './constants/theme.json';
import DuoButton from './DuoButton';
import useCountdown from '../utils/useCountdown';
import {checkTimestamp} from '../utils/firestore';

interface heartDialogProps {
  visible: boolean;
  dismissable?: boolean;
  dismissableBackButton?: boolean;
  buttonText: string;
  onDismiss: () => void;
  onPress: () => void;
}

const HeartDialog = (props: heartDialogProps) => {
  const {
    visible,
    dismissable = false,
    dismissableBackButton = false,
    buttonText,
    onDismiss,
    onPress,
  } = props;

  const [timeToReplenish, setTimeToReplenish] = useState<number | null>(null);
  const userId = auth().currentUser!.uid;

  useCountdown(timeToReplenish, setTimeToReplenish, () => {
    onDismiss();
    setTimeToReplenish(null);
  });

  const getSeconds = async () => {
    let timeStamp = await checkTimestamp(userId);
    console.log('DIALOG TIMESTAMP', timeStamp);
    setTimeToReplenish(timeStamp.timeLeft);
  };

  useEffect(() => {
    if (visible) getSeconds();
  }, [visible]);

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
            <Icon
              name="heart-broken-outline"
              size={Constants.iconMedium}
              color={Theme.colors.onErrorContainer}
            />
            <Text variant="headlineSmall" style={styles.titleText}>
              You have run out of lives.
            </Text>
            {timeToReplenish !== null ? (
              <Text
                variant="bodyLarge"
                style={{color: Theme.colors.onErrorContainer}}>
                {'Your next heart will replenish in ' +
                  Math.floor(timeToReplenish / 60) +
                  ':' +
                  (timeToReplenish % 60).toString().padStart(2, '0') +
                  '.'}
              </Text>
            ) : (
              <ActivityIndicator color={Theme.colors.onErrorContainer} />
            )}
          </View>
          <DuoButton
            backgroundColor={Theme.colors.error}
            backgroundDark={Theme.colors.errorDark}
            stretch={true}
            textColor={Theme.colors.onPrimary}
            onPress={onPress}>
            {buttonText}
          </DuoButton>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    justifyContent: 'flex-end',
  },
  innerBottomContainer: {
    paddingHorizontal: Constants.edgePadding,
    paddingTop: Constants.defaultGap,
    paddingBottom: 2 * Constants.edgePadding,
    gap: Constants.defaultGap,
    backgroundColor: Theme.colors.errorContainer,
  },
  visibleContainer: {
    gap: Constants.edgePadding,
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
