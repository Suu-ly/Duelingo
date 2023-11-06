import {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  Animated,
  Easing,
  View,
} from 'react-native';
import {Text, Chip} from 'react-native-paper';
import Constants from './constants/Constants';

interface DropdownProps {
  item: {id: Number; value: string; icon: ImageSourcePropType};
  data: Array<{id: Number; value: string; icon: ImageSourcePropType}>;
  onSelect: (item: any) => void;
}

const Dropdown = (props: DropdownProps) => {
  const {item, data, onSelect} = props;
  const height = useRef(new Animated.Value(38)).current;

  const [showOption, setShowOption] = useState(false);
  const onSelectedItem = (value: any) => {
    setShowOption(false);
    onSelect(value);
  };

  useEffect(() => {
    Animated.timing(height, {
      toValue: showOption ? 136 : 38,
      duration: 300,
      easing: Easing.bezier(0.05, 0.7, 0.1, 1),
      useNativeDriver: false,
    }).start();
  }, [showOption]);

  return (
    <Animated.View
      style={{
        paddingTop: 4,
        height: height,
        overflow: 'hidden',
      }}>
      <Chip
        mode="outlined"
        style={styles.chip}
        onPress={() => setShowOption(!showOption)}
        avatar={<Image source={item.icon} resizeMode="cover" />}>
        {!!item ? item.value : data[0].value}
      </Chip>
      <View style={styles.buttonContainer}>
        {data.map((value, index) => {
          return (
            <TouchableOpacity
              key={String(index)}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
              onPress={() => onSelectedItem(value)}
              style={styles.button}>
              <Image
                style={styles.dropdown}
                resizeMode="cover"
                source={value.icon}
              />
              <Text>{value.value}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    paddingHorizontal: Constants.smallGap,
    alignItems: 'center',
  },
  buttonContainer: {
    paddingTop: 20,
    gap: Constants.defaultGap,
  },
  dropdown: {
    width: 24,
    height: 24,
    borderRadius: 128,
    overflow: 'hidden',
    marginRight: Constants.mediumGap,
  },
  chip: {
    borderRadius: 40,
    backgroundColor: 'transparent',
  },
});

export default Dropdown;
