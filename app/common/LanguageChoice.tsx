import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import Theme from '../common/constants/theme.json';

interface LanguageChoiceProps {
  item: {id: Number; value: string; icon: string} | undefined;
}

const LanguageChoice = (props: LanguageChoiceProps) => {
  const {item} = props;

  return (
    <Text style={styles.languageChoiceText} variant={'titleLarge'}>
      {item ? item.value + ': Easy' : null}
    </Text>
  );
};

const styles = StyleSheet.create({
  languageChoiceText: {
    color: Theme.colors.onSurface,
  },
  svg: {
    marginHorizontal: 8,
  },
});

export default LanguageChoice;
