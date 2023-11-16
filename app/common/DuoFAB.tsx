import {Keyboard, StyleSheet, View} from 'react-native';
import {useEffect, useState} from 'react';
import AwesomeButton from 'react-native-really-awesome-button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import Theme from './constants/theme.json';
import Constants from './constants/Constants';

interface ButtonProps {
  backgroundColor?: string;
  backgroundDark?: string;
  icon: string;
  onPress: () => void;
}

const DuoFAB = (props: ButtonProps) => {
  const {backgroundColor, backgroundDark, icon, onPress} = props;

  const [keyboardStatus, setKeyboardStatus] = useState(false);

  const handlePressIn = () => {
    ReactNativeHapticFeedback.trigger('effectHeavyClick', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  };

  const handlePressOut = () => {
    ReactNativeHapticFeedback.trigger('effectTick', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    !keyboardStatus && (
      <View style={styles.fab}>
        <AwesomeButton
          height={56}
          width={56}
          borderRadius={Constants.radiusLarge}
          stretch={false}
          dangerouslySetPressableProps={{
            onPress: onPress,
          }}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          springRelease={false}
          backgroundShadow="transparent"
          raiseLevel={4}
          backgroundColor={Theme.colors.primary}
          backgroundDarker={Theme.colors.primaryDark}
          borderWidth={0}>
          <Icon
            name={icon}
            size={Constants.iconMedium}
            color={Theme.colors.onPrimary}
          />
        </AwesomeButton>
      </View>
    )
  );
};

export default DuoFAB;

const styles = StyleSheet.create({
  fab: {
    elevation: 3,
    position: 'absolute',
    bottom: Constants.edgePadding,
    right: Constants.edgePadding,
    borderRadius: Constants.radiusLarge,
    backgroundColor: 'transparent',
  },
});
