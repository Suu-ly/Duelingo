import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, SectionList} from 'react-native';

import {Button, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Theme from '../common/constants/theme.json';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import Dropdown from '../common/DropdownButton';
import LanguageChoice from '../common/LanguageChoice';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {colors} from 'react-native-elements';
import Questions from '../data/Translation Questions.json';

interface HomeProps {
  route: any;
  navigation: any;
}

const Home = (props: HomeProps) => {
  const {route, navigation} = props;
  const [selectedItem, setSelectedItem] = useState<{
    id: number;
    value: string;
    icon: string;
  }>();
  const onSelect = (item: any) => {
    setSelectedItem(item);
  };
  const language = [
    {
      id: 1,
      value: 'Mandarin',
      icon: 'https://hatscripts.github.io/circle-flags/flags/cn.svg',
    },
    {
      id: 2,
      value: 'Malay',
      icon: 'https://hatscripts.github.io/circle-flags/flags/my.svg',
    },
  ];

  const difficulty = [
    {
      title: 'Easy',
      data: ['q1', 'q2', 'q3'],
    },
    {
      title: 'Medium',
      data: ['q1', 'q2', 'q3', 'q4', 'q5'],
    },
    {
      title: 'Difficult',
      data: ['q1', 'q2', 'q3', 'q4', 'q5'],
    },
  ];

  return (
    <View style={styles.mainContainer}>
      {/* <CustomStatusBar /> */}

      <View style={styles.toprowContainer}>
        <Dropdown
          title={'language'}
          data={language}
          item={selectedItem}
          onSelect={onSelect}
        />
        <TouchableOpacity style={styles.button}>
          <Icon name="heart" size={24} color={Theme.colors.error} />
          <Text style={{color: Theme.colors.error}}>5</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <SectionList
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={true}
          sections={difficulty}
          renderItem={({item}) => (
            <View style={styles.item}>
              <Text style={styles.title}>{item}</Text>
            </View>
          )}
          renderSectionHeader={({section: {title}}) => (
            <Text style={styles.header} variant={'titleLarge'}>
              <LanguageChoice item={selectedItem} />: {title}
            </Text>
          )}
        />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  toprowContainer: {
    backgroundColor: Theme.colors.elevation.level0,
    flexDirection: 'row',
    gap: Constants.mediumGap,
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: Constants.edgePadding,
    paddingVertical: Constants.mediumGap,
  },
  button: {
    borderRadius: Constants.radiusMedium,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Constants.mediumGap,
  },
  container: {
    flex: 1,
    marginHorizontal: 16,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  header: {
    backgroundColor: Theme.colors.elevation.level0,
    color: Theme.colors.onSurface,
    paddingHorizontal: Constants.edgePadding,
    paddingVertical: Constants.mediumGap,
  },
  title: {
    fontSize: 24,
  },
});
