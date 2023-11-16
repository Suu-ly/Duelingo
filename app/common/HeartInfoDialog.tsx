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

interface heartInfoDialogProps {
  visible: boolean;
  onDismiss: () => void;
}

const HeartInfoDialog = (props: heartInfoDialogProps) => {
  const {visible, onDismiss} = props;

  const [timeToReplenish, setTimeToReplenish] = useState<number | null>(null);
  const userId = auth().currentUser!.uid;

  useCountdown(timeToReplenish, setTimeToReplenish, () => {
    onDismiss();
    setTimeToReplenish(null);
  });

  const getSeconds = async () => {
    let timeStamp = await checkTimestamp(userId);
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
        dismissable={true}
        dismissableBackButton={true}
        style={styles.bottomContainer}>
        <View style={styles.innerBottomContainer}>
          <View style={styles.visibleContainer}>
            <Icon
              name="heart-plus-outline"
              size={Constants.iconMedium}
              color={Theme.colors.onTertiaryContainer}
            />
            <Text variant="headlineSmall" style={styles.titleText}>
              Heart status
            </Text>
            {timeToReplenish !== null ? (
              <Text
                variant="bodyLarge"
                style={{color: Theme.colors.onTertiaryContainer}}>
                {'Your next heart will replenish in ' +
                  Math.floor(timeToReplenish / 60) +
                  ':' +
                  (timeToReplenish % 60).toString().padStart(2, '0') +
                  '.'}
              </Text>
            ) : (
              <ActivityIndicator color={Theme.colors.onTertiaryContainer} />
            )}
          </View>
          <DuoButton
            backgroundColor={Theme.colors.tertiary}
            backgroundDark={Theme.colors.tertiaryDark}
            stretch={true}
            textColor={Theme.colors.onTertiary}
            onPress={onDismiss}>
            Ok
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
    backgroundColor: Theme.colors.tertiaryContainer,
  },
  visibleContainer: {
    gap: Constants.edgePadding,
    alignItems: 'center',
  },
  titleText: {
    textAlign: 'center',
    color: Theme.colors.onTertiaryContainer,
  },
  bodyText: {
    gap: Constants.smallGap,
    flexShrink: 1,
  },
});

export default HeartInfoDialog;
