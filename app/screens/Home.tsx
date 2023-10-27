import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, SectionList} from 'react-native';

import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Theme from '../common/constants/theme.json';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import Dropdown from '../common/DropdownButton';
import Questions from '../data/ModuleQuestion.json';
import TopicButton from '../common/TopicButton';
import {getSectionListData} from '../utils/firestore';

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

  //Get the selected item of the language array
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
  //calculate the index of the topic in the entire language
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

  type resultType = {
    id: number;
    title: any;
    data: string[];
    backgroundColor: string;
  };
  const [mandarinResult, setMandarinResult] = useState<resultType[] | null>(
    null,
  );
  const [malayResult, setMalayResult] = useState<resultType[] | null>(null);

  useEffect(() => {
    const getChineseResult = async () => {
      const mandarinResult = await getSectionListData('Chinese');
      setMandarinResult(mandarinResult!);
    };

    const getMalayResult = async () => {
      const malayResult = await getSectionListData('Malay');
      setMalayResult(malayResult!);
    };

    getChineseResult();
    getMalayResult();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar />

      <View style={styles.toprowContainer}>
        <Dropdown data={language} item={selectedItem} onSelect={onSelect} />
        <TouchableOpacity style={styles.button}>
          <Icon name="heart" size={24} color={Theme.colors.error} />
          <Text style={{color: Theme.colors.error}}>5</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        {mandarinResult !== null && malayResult !== null && (
          <SectionList
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={true}
            sections={selectedItem.id === 1 ? mandarinResult : malayResult} //if selectedItem is chinese, use chinese result array, else use malay resullt array
            keyExtractor={(item: any, index: any) => item + index}
            renderItem={({item, index, section}) => {
              const overallIndex = calculateOverallIndex(
                selectedItem.id === 1 ? mandarinResult : malayResult,
                section.id,
                index,
              );
              //Find out whether the current topic being rendered is completed
              const isCompleted =
                overallIndex <
                (selectedItem.id === 1
                  ? numberOfCompletedChineseModule
                  : numberOfCompletedMalayModule);
              //Find out whether the item rendered is the last item of the section
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
        )}
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
    paddingVertical: Constants.mediumGap,
  },
  title: {
    fontSize: 24,
  },
});
