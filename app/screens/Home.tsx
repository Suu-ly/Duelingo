import {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SectionList,
  Animated,
  BackHandler,
  ImageSourcePropType,
  LogBox,
} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-paper';
import Theme from '../common/constants/theme.json';

import Constants from '../common/constants/Constants';
import TopicButton from '../common/TopicButton';
import {getSectionListData, numberOfCompletedModules} from '../utils/firestore';
import auth from '@react-native-firebase/auth';
import {useFocusEffect} from '@react-navigation/native';

LogBox.ignoreLogs(['new NativeEventEmitter()']);

interface HomeProps {
  route: any;
  navigation: any;
  translate: Animated.Value;
  opacity: Animated.Value;
  selectedLanguage: {id: number; value: string; icon: ImageSourcePropType};
}

const Home = (props: HomeProps) => {
  const {route, navigation, translate, opacity, selectedLanguage} = props;

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

  const [isLoading, setIsLoading] = useState(true);
  const [mandarinResult, setMandarinResult] = useState<
    | {
        id: number;
        title: any;
        data: string[];
        backgroundColor: string;
      }[]
    | null
  >(null);
  const [malayResult, setMalayResult] = useState<
    | {
        id: number;
        title: any;
        data: string[];
        backgroundColor: string;
      }[]
    | null
  >(null);
  const [numberOfCompletedChineseModules, setNumberOfCompletedChineseModules] =
    useState(0);
  const [numberOfCompletedMalayModules, setNumberOfCompletedMalayModules] =
    useState(0);

  useEffect(() => {
    const getResult = async () => {
      const user = auth().currentUser;
      if (user) {
        const userID = user.uid;

        const [
          mandarinResult,
          malayResult,
          numberOfCompletedChineseModules,
          numberOfCompletedMalayModules,
        ] = await Promise.all([
          getSectionListData('Chinese'),
          getSectionListData('Malay'),
          numberOfCompletedModules(userID, 'chinese'),
          numberOfCompletedModules(userID, 'malay'),
        ]);
        setMandarinResult(mandarinResult!);
        setMalayResult(malayResult!);
        setNumberOfCompletedChineseModules(numberOfCompletedChineseModules);
        setNumberOfCompletedMalayModules(numberOfCompletedMalayModules);
        setIsLoading(false);
      } else {
        console.log('User not signed in');
      }
    };
    getResult();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, []),
  );

  return (
    <Animated.View
      style={[
        styles.mainContainer,
        {transform: [{translateY: translate}], opacity: opacity},
      ]}>
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator />
          </View>
        ) : (
          mandarinResult !== null &&
          malayResult !== null && (
            <SectionList
              showsVerticalScrollIndicator={false}
              stickySectionHeadersEnabled={true}
              sections={
                selectedLanguage.id === 1 ? mandarinResult : malayResult
              } //if selectedLanguage is chinese, use chinese result array, else use malay resullt array
              keyExtractor={(item: any, index: any) => item + index}
              renderItem={({item, index, section}) => {
                const overallIndex = calculateOverallIndex(
                  selectedLanguage.id === 1 ? mandarinResult : malayResult,
                  section.id,
                  index,
                );
                //Find out whether the current topic being rendered should be active E.g. If completed modules is 0, 1 module should be active
                const isActive =
                  overallIndex <
                  (selectedLanguage.id === 1
                    ? numberOfCompletedChineseModules + 1
                    : numberOfCompletedMalayModules + 1);
                //Find out whether the current topic being rendered is completed
                const isCompleted =
                  overallIndex <
                  (selectedLanguage.id === 1
                    ? numberOfCompletedChineseModules
                    : numberOfCompletedMalayModules);
                //Find out whether the item rendered is the last item of the section
                const isLastItem =
                  section.data.indexOf(item) === section.data.length - 1;
                const icon = isLastItem
                  ? 'treasure-chest'
                  : isCompleted
                  ? 'check-bold'
                  : 'star';
                return (
                  <View style={styles.buttonContainer}>
                    <TopicButton
                      disabled={!isActive}
                      backgroundColor={section.backgroundColor}
                      borderColor={Theme.colors.onSurface}
                      icon={icon}
                      textColor={Theme.colors.onSurface}
                      onPress={() => {
                        navigation.navigate('Quiz', {
                          language:
                            selectedLanguage.id == 1 ? 'Chinese' : 'Malay',
                          module: 'Module' + (section.id + 1),
                          topic: 'Topic' + (section.data.indexOf(item) + 1),
                        });
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
          )
        )}
      </View>
    </Animated.View>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
