import AwesomeButton from 'react-native-really-awesome-button';
import {Text} from 'react-native-paper';
import {VariantProp} from 'react-native-paper/lib/typescript/components/Typography/types';
import theme from './constants/theme.json';
import {View} from 'react-native';

interface ButtonProps {
  backgroundColor: string;
  disabled?: boolean;
  filled?: boolean;
  borderColor?: string;
  icon?: React.ReactNode;
  stretch?: boolean;
  children: React.ReactNode;
  textVariant?: VariantProp<never>;
  textColor?: string;
  onPress: () => void;
}

const DuoButton = (props: ButtonProps) => {
  const {
    backgroundColor,
    disabled = false,
    filled = true,
    borderColor,
    icon,
    stretch = false,
    children,
    textVariant = 'labelLarge',
    textColor = '#FFFFFF',
    onPress,
  } = props;
  return (
    <AwesomeButton
      height={48}
      disabled={disabled}
      borderRadius={8}
      paddingHorizontal={8}
      stretch={stretch}
      onPress={onPress}
      debouncedPressTime={0}
      springRelease={false}
      backgroundShadow="transparent"
      raiseLevel={disabled ? 0 : 4}
      backgroundColor={
        disabled && filled ? 'rgba(29, 27, 32, 0.12)' : backgroundColor
      }
      backgroundDarker={filled ? backgroundColor : borderColor}
      borderWidth={filled ? 0 : 2}
      borderColor={disabled ? 'rgba(24, 28, 28, 0.38)' : borderColor}>
      {icon}
      <View style={{marginRight: 8}} />
      <Text
        variant={textVariant}
        style={
          disabled ? {color: 'rgba(24, 28, 28, 0.38)'} : {color: textColor}
        }>
        {children}
      </Text>
      <View style={{marginRight: 8}} />
    </AwesomeButton>
  );
};

export default DuoButton;
