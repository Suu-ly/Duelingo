import {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SectionList,
  Animated,
  BackHandler,
  ImageSourcePropType,
} from 'react-native';

import {Button, Portal, Snackbar, Text} from 'react-native-paper';
import Theme from '../common/constants/theme.json';

import Constants from '../common/constants/Constants';
import TopicButton from '../common/TopicButton';
import {getSectionListData} from '../utils/firestore';
import {
  EventArg,
  NavigationAction,
  useFocusEffect,
} from '@react-navigation/native';

interface HomeProps {
  route: any;
  navigation: any;
  translate: Animated.Value;
  selectedLanguage: {id: number; value: string; icon: ImageSourcePropType};
}

const Home = (props: HomeProps) => {
  const {route, navigation, translate, selectedLanguage} = props;

  const [secondBackPress, setSecondBackPress] = useState<boolean>(false);

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

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (secondBackPress) {
          BackHandler.exitApp();
        } else {
          setSecondBackPress(true);
        }
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [secondBackPress]),
  );

  useEffect(
    () =>
      navigation.addListener('blur', (e: EventArg<'blur', true>) => {
        setSecondBackPress(false);
      }),
    [navigation],
  );

  return (
    <Animated.View
      style={[styles.mainContainer, {transform: [{translateY: translate}]}]}>
      <View style={styles.container}>
        {mandarinResult !== null && malayResult !== null && (
          <SectionList
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={true}
            sections={selectedLanguage.id === 1 ? mandarinResult : malayResult} //if selectedLanguage is chinese, use chinese result array, else use malay resullt array
            keyExtractor={(item: any, index: any) => item + index}
            renderItem={({item, index, section}) => {
              const overallIndex = calculateOverallIndex(
                selectedLanguage.id === 1 ? mandarinResult : malayResult,
                section.id,
                index,
              );
              //Find out whether the current topic being rendered is completed
              const isCompleted =
                overallIndex <
                (selectedLanguage.id === 1
                  ? numberOfCompletedChineseModule
                  : numberOfCompletedMalayModule);
              //Find out whether the item rendered is the last item of the section
              const isLastItem =
                section.data.indexOf(item) === section.data.length - 1;
              const icon = isLastItem ? 'treasure-chest' : 'check-bold';
              return (
                <View style={styles.buttonContainer}>
                  <TopicButton
                    disabled={!isCompleted}
                    backgroundColor={section.backgroundColor}
                    borderColor={Theme.colors.onSurface}
                    icon={icon}
                    textColor={Theme.colors.onSurface}
                    onPress={() => {
                      console.log(
                        'Questions.Language[' +
                          (selectedLanguage.id - 1) +
                          '].modules[' +
                          section.id +
                          '].topics[' +
                          section.data.indexOf(item) +
                          ']',
                      );
                    }}>
                    {item}
                  </TopicButton>
                </View>
              );
            }}
            renderSectionHeader={({section: {title}}) => (
              <Text style={styles.header} variant={'titleLarge'}>
                {selectedLanguage.value} {title}
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
      <Portal>
        <Snackbar
          visible={secondBackPress}
          duration={3000}
          onDismiss={() => setSecondBackPress(false)}>
          Go back one more time to exit the app.
        </Snackbar>
      </Portal>
    </Animated.View>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
  },
  buttonContainer: {
    paddingHorizontal: Constants.edgePadding,
  },
  button: {
    borderRadius: Constants.radiusMedium,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Constants.mediumGap,
  },
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  header: {
    backgroundColor: Theme.colors.elevation.level1,
    padding: Constants.edgePadding,
  },
  title: {
    fontSize: 24,
  },
});
