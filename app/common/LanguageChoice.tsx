import React from 'react';
import {Text} from 'react-native-paper';

interface LanguageChoiceProps {
  item: {id: Number; value: string; icon: string} | undefined;
}

const LanguageChoice = (props: LanguageChoiceProps) => {
  const {item} = props;

  return <Text>{item ? item.value : null}</Text>;
};

export default LanguageChoice;
