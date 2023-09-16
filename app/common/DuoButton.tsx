import AwesomeButton from 'react-native-really-awesome-button';
import {Text} from 'react-native-paper';
import {VariantProp} from 'react-native-paper/lib/typescript/components/Typography/types';
import theme from './constants/theme.json';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Constants from './constants/Constants';

interface ButtonProps {
  backgroundColor: string;
  backgroundDark?: string;
  disabled?: boolean;
  filled?: boolean;
  borderColor?: string;
  icon?: string;
  stretch?: boolean;
  children?: React.ReactNode;
  textVariant?: VariantProp<never>;
  textColor?: string;
  onPress: () => void;
}

const DuoButton = (props: ButtonProps) => {
  const {
    backgroundColor,
    backgroundDark,
    disabled = false,
    filled = true,
    borderColor,
    icon,
    stretch = false,
    children,
    textVariant = 'labelLarge',
    textColor = theme.colors.onPrimary,
    onPress,
  } = props;
  return (
    <AwesomeButton
      height={Constants.buttonSize}
      width={children ? null : Constants.buttonSize}
      disabled={disabled}
      borderRadius={Constants.radiusSmall}
      paddingHorizontal={Constants.mediumGap}
      stretch={stretch}
      onPress={onPress}
      springRelease={false}
      backgroundShadow="transparent"
      raiseLevel={disabled ? 0 : filled ? 4 : 2}
      backgroundColor={
        disabled && filled
          ? theme.colors.surfaceDisabledInvert
          : backgroundColor
      }
      backgroundDarker={filled ? backgroundDark : borderColor}
      borderWidth={filled ? 0 : 2}
      borderColor={
        disabled ? theme.colors.onSurfaceDisabledInvert : borderColor
      } //for some reason the border draws as black with an overlay so we have to invert the colour
    >
      <>
        {icon && (
          <Icon
            name={icon}
            size={Constants.iconMedium}
            color={disabled ? theme.colors.onSurfaceDisabled : textColor}
          />
        )}
        {children && (
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
        )}
      </>
    </AwesomeButton>
  );
};

export default DuoButton;
