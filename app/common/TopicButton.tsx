import AwesomeButton from 'react-native-really-awesome-button';
import {Text} from 'react-native-paper';
import {VariantProp} from 'react-native-paper/lib/typescript/components/Typography/types';
import theme from './constants/theme.json';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Constants from './constants/Constants';
import {StyleSheet, View} from 'react-native';

interface ButtonProps {
  backgroundColor: string;
  backgroundDark?: string;
  disabled?: boolean;
  borderColor: string;
  icon: string;
  stretch?: boolean;
  height?: number;
  children?: React.ReactNode;
  textVariant?: VariantProp<never>;
  textColor: string;
  onPress: () => void;
}

const TopicButton = (props: ButtonProps) => {
  const {
    backgroundColor,
    backgroundDark = theme.colors.onSurface,
    disabled = false,
    borderColor,
    icon,
    stretch = true,
    height = 80,
    children,
    textVariant = 'titleMedium',
    textColor,
    onPress,
  } = props;
  return (
    <AwesomeButton
      height={height}
      width={children ? null : Constants.buttonSize}
      disabled={disabled}
      borderRadius={Constants.radiusSmall}
      paddingHorizontal={0}
      stretch={stretch}
      dangerouslySetPressableProps={{
        onPress: disabled ? null : onPress,
      }}
      springRelease={false}
      backgroundShadow="transparent"
      raiseLevel={disabled ? 0 : 4}
      backgroundColor={
        disabled
          ? theme.colors.surfaceDisabledInvert
          : theme.colors.elevation.level0
      }
      backgroundDarker={backgroundDark}
      borderWidth={2}
      borderColor={
        disabled ? theme.colors.onSurfaceDisabledInvert : borderColor
      } //for some reason the border draws as black with an overlay so we have to invert the colour
    >
      <View style={styles.container}>
        {icon && (
          <View
            style={[styles.iconContainer, {backgroundColor: backgroundColor}]}>
            <Icon
              name={icon}
              size={Constants.iconMedium}
              color={
                disabled
                  ? theme.colors.surfaceDisabledInvert
                  : theme.colors.surface
              }
            />
          </View>
        )}
        {children && (
          <View style={styles.textContainer}>
            <Text
              variant={textVariant}
              style={[
                disabled
                  ? {color: theme.colors.onSurfaceDisabled}
                  : {color: textColor},
                {marginHorizontal: Constants.mediumGap},
              ]}>
              {children}
            </Text>
          </View>
        )}
      </View>
    </AwesomeButton>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItem: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    width: 80,
    aspectRatio: 1,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default TopicButton;
