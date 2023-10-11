import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import Theme from '../common/constants/theme.json';
import Constants from '../common/constants/Constants';

interface TopicButtonProps {
  label: string;
  //   item: {id: Number; value: string; icon: string} | undefined;
  //   data: Array<{id: Number; value: string; icon: string}>;
  //   onSelect: (item: any) => void;
}

const TopicButton = (props: TopicButtonProps) => {
  const {label} = props;
  //   const [showOption, setShowOption] = useState(false);
  //   const onSelectedItem = (value: any) => {
  //     setShowOption(false);
  //     onSelect(value);
  //   };

  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <View style={styles.buttonParent}>
          <View style={styles.cardContainer}>
            <View style={styles.cardIcon}></View>
            <View style={styles.cardContent}>
              <Text style={styles.cardContentText} variant={'titleMedium'}>
                {label}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItem: 'center',
    marginVertical: 16,
    borderColor: Theme.colors.outlineVariant,
    borderWidth: 1,
    borderRadius: Constants.radiusMedium,
  },
  cardContainer: {
    height: 80,
    borderRadius: Constants.radiusMedium,
    backgroundColor: Theme.colors.surface,
    flex: 1,
    flexDirection: 'row',
    bottom: 10,
  },
  cardIcon: {
    aspectRatio: 1,
    backgroundColor: Theme.colors.primaryContainerDark,
    borderTopLeftRadius: Constants.radiusMedium,
    borderBottomLeftRadius: Constants.radiusMedium,
  },
  cardContent: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: Constants.largeGap,
    minHeight: 40,
  },
  cardContentText: {
    color: Theme.colors.onSurface,
  },
  buttonParent: {
    height: 80,
    borderRadius: Constants.radiusMedium,
    backgroundColor: Theme.colors.primaryContainerDark,
  },
});

export default TopicButton;
