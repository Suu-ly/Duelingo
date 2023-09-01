import React from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Label from './Label';
import TextStyles from './constants/TextStyles';
import Colors from './constants/Colors';

interface ButtonProps {
  title: string;
  backgroundColor?: string;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  textColor: string;
  disabled?: boolean;
  outlined?: boolean;
  textButton?: boolean;
  onPress: () => void;
  icon?: boolean;
  iconName?: string;
  borderColor?: string;
}

const CustomButton = (props: ButtonProps) => {
  const {
    title,
    backgroundColor,
    textStyle,
    textColor,
    disabled = false,
    outlined = false,
    textButton = false,
    onPress,
    icon = false,
    iconName,
    borderColor,
    style,
  } = props;
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        {
          height: 40,
          borderRadius: 100,
          borderWidth: disabled && !textButton ? 1 : 0,
          paddingRight: 24,
          paddingLeft: icon ? 16 : 24,
          borderColor: borderColor ? borderColor : Colors.neutral4,
          backgroundColor:
            disabled && !textButton
              ? Colors.neutral2
              : textButton
              ? 'transparent'
              : backgroundColor,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
      onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {icon && iconName && (
          <Icon
            name={iconName}
            size={18}
            color={disabled ? Colors.neutral6 : textColor}
          />
        )}
        <View style={icon ? {paddingLeft: 8} : null}>
          <Label
            color={disabled ? Colors.neutral6 : textColor}
            style={textStyle ? textStyle : TextStyles.labelLarge}
            title={title}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default CustomButton;
