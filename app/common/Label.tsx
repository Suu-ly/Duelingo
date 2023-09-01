import React from 'react';
import {StyleProp, Text, TextStyle, useColorScheme} from 'react-native';

interface LabelProps {
  title?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  color?: string;
}

const Label = (props: LabelProps) => {
  const {title, style, numberOfLines, ellipsizeMode, color = 'black'} = props;
  return (
    <Text
      style={[style, {color: color}]}
      ellipsizeMode={ellipsizeMode}
      numberOfLines={numberOfLines}>
      {title}
    </Text>
  );
};

export default Label;
