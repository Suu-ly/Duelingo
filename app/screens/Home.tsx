import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, SectionList} from 'react-native';

import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Theme from '../common/constants/theme.json';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import TopicColors from '../common/constants/TopicColors';
import Dropdown from '../common/DropdownButton';
import Questions from '../data/ModuleQuestion.json';
import TopicButton from '../common/TopicButton';

interface HomeProps {
  route: any;
  navigation: any;
}

const Home = (props: HomeProps) => {
  const {route, navigation} = props;
  const language = [
    {
      id: 1,
      value: Questions.Langauge[0].languageName,
      icon: 'https://hatscripts.github.io/circle-flags/flags/cn.svg',
    },
    {
      id: 2,
      value: Questions.Langauge[1].languageName,
      icon: 'https://hatscripts.github.io/circle-flags/flags/my.svg',
    },
  ];

  const [selectedItem, setSelectedItem] = useState<{
    id: number;
    value: string;
    icon: string;
  }>(language[0]);
  const onSelect = (item: any) => {
    setSelectedItem(item);
  };

  const numberOfCompletedChineseModule = 15;
  const numberOfCompletedMalayModule = 9;
  const calculateOverallIndex = (
    sections: {data: string | any[]}[],
    sectionIndex: number,
    itemIndex: number,
  ) => {
    let overallIndex = 0;
    for (let i = 0; i < sectionIndex; i++) {
      overallIndex += sections[i].data.length;
    }
    overallIndex += itemIndex;
    return overallIndex;
  };

  const createResult = (languageIndex: number) =>
    Questions.Langauge[languageIndex].modules.map((module, index) => ({
      id: index,
      title: module.moduleName,
      data: module.topics.map(topic => topic.topicName),
      backgroundColor:
        Object.values(TopicColors)[
          languageIndex === 0
            ? index
            : Object.keys(TopicColors).length - 1 - index
        ],
    }));

  const mandarinResult = createResult(0);
  const malayResult = createResult(1);

  return (
    <View style={styles.mainContainer}>
      {/* <CustomStatusBar /> */}

      <View style={styles.toprowContainer}>
        <Dropdown data={language} item={selectedItem} onSelect={onSelect} />
        <TouchableOpacity style={styles.button}>
          <Icon name="heart" size={24} color={Theme.colors.error} />
          <Text style={{color: Theme.colors.error}}>5</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <SectionList
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={true}
          sections={selectedItem.id === 1 ? mandarinResult : malayResult}
          keyExtractor={(item: any, index: any) => item + index}
          renderItem={({item, index, section}) => {
            const overallIndex = calculateOverallIndex(
              selectedItem.id === 1 ? mandarinResult : malayResult,
              section.id,
              index,
            );
            const isCompleted =
              overallIndex <
              (selectedItem.id === 1
                ? numberOfCompletedChineseModule
                : numberOfCompletedMalayModule);
            const isLastItem =
              section.data.indexOf(item) === section.data.length - 1;
            const icon = isLastItem ? 'treasure-chest' : 'check-bold';
            return (
              <TopicButton
                disabled={!isCompleted}
                backgroundColor={section.backgroundColor}
                borderColor={Theme.colors.onSurface}
                icon={icon}
                textColor={Theme.colors.onSurface}
                onPress={() => {
                  console.log(
                    'Questions.Language[' +
                      (selectedItem.id - 1) +
                      '].modules[' +
                      section.id +
                      '].topics[' +
                      section.data.indexOf(item) +
                      ']',
                  );
                }}>
                {item}
              </TopicButton>
            );
          }}
          renderSectionHeader={({section: {title}}) => (
            <Text style={styles.header} variant={'titleLarge'}>
              {selectedItem.value} {title}
            </Text>
          )}
          ItemSeparatorComponent={() => (
            <View style={{height: Constants.defaultGap}} />
          )}
          SectionSeparatorComponent={() => (
            <View style={{paddingVertical: Constants.mediumGap}} />
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
