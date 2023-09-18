import React, {FC, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, Chip} from 'react-native-paper';
import Svg, {SvgUri, Circle} from 'react-native-svg';

interface DropdownProps {
  title: string;
  item: {id: Number; value: string; icon: string} | undefined;
  data: Array<{id: Number; value: string; icon: string}>;
  onSelect: (item: any) => void;
}

const Dropdown = (props: DropdownProps) => {
  const {title, item, data, onSelect} = props;
  const [showOption, setShowOption] = useState(false);
  const onSelectedItem = (value: any) => {
    setShowOption(false);
    onSelect(value);
  };

  return (
    <View>
      <Chip
        mode="outlined"
        style={{borderRadius: 40}}
        onPress={() => setShowOption(!showOption)}
        avatar={
          <SvgUri
            style={styles.svg}
            width="24"
            height="24"
            uri={item ? item.icon : null}
          />
        }>
        {!!item ? item.value : title}
      </Chip>
      {showOption &&
        data.map((value, index) => {
          return (
            <TouchableOpacity
              key={String(index)}
              onPress={() => onSelectedItem(value)}
              style={styles.button}>
              <SvgUri
                style={styles.svg}
                width="24"
                height="24"
                uri={value.icon}
              />
              <Text>{value.value}</Text>
            </TouchableOpacity>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  svg: {
    marginHorizontal: 8,
  },
});

export default Dropdown;
