import {useCallback, useState} from 'react';
import {
  View,
  StyleSheet,
  SectionList,
  Animated,
  BackHandler,
  ImageSourcePropType,
} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-paper';
import Theme from '../common/constants/theme.json';

import Constants from '../common/constants/Constants';
import TopicButton from '../common/TopicButton';
import {
  getLives,
  getSectionListData,
  numberOfCompletedModules,
} from '../utils/firestore';
import auth from '@react-native-firebase/auth';
import {useFocusEffect} from '@react-navigation/native';
import HeartDialog from '../common/HeartDialog';

interface HomeProps {
  route: any;
  navigation: any;
  translate: Animated.Value;
  opacity: Animated.Value;
  selectedLanguage: {id: number; value: string; icon: ImageSourcePropType};
}

const Home = (props: HomeProps) => {
  const {route, navigation, translate, opacity, selectedLanguage} = props;

  //set the chinese dataset for the section list
  const [mandarinResult, setMandarinResult] = useState<
    | {
        id: number;
        title: any;
        data: string[];
        backgroundColor: string;
      }[]
    | null
  >(null);
  //set the malay dataset for the section list
  const [malayResult, setMalayResult] = useState<
    | {
        id: number;
        title: any;
        data: string[];
        backgroundColor: string;
      }[]
    | null
  >(null);
  //set the number of Completed Chinese Modules from the firestore
  const [numberOfCompletedChineseModules, setNumberOfCompletedChineseModules] =
    useState(0);
  //set the number of Completed Chinese Modules from the firestore
  const [numberOfCompletedMalayModules, setNumberOfCompletedMalayModules] =
    useState(0);
  //set the number of lives from the firestore
  const [lives, setLives] = useState<number | undefined>(undefined);
  //Decides whether to show the run out of hearts dialog
  const [dialogVisible, setDialogVisible] = useState(false);

  const userId = auth().currentUser!.uid;

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

  //retrieve the chinese and malay data for the sectionlist and the number of chinese and malay modules from firestore
  const getData = async () => {
    console.log('Running');
    let data = await getSectionListData(selectedLanguage.value);
    if (data) {
      if (selectedLanguage.value === 'Chinese') {
        setMandarinResult(data);
      } else {
        setMalayResult(data);
      }
    }
  };

  const getProgress = async () => {
    let progress = await numberOfCompletedModules(
      userId,
      selectedLanguage.value.toLowerCase(),
    );
    if (progress) {
      if (selectedLanguage.value === 'Chinese') {
        setNumberOfCompletedChineseModules(progress);
      } else {
        setNumberOfCompletedMalayModules(progress);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (selectedLanguage.value === 'Chinese') {
        if (mandarinResult === null) getData();
      } else if (malayResult === null) getData();
    }, [selectedLanguage]),
  );

  useFocusEffect(
    useCallback(() => {
      getProgress();
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => {
        subscription.remove();
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      const getHeartLives = () => {
        const userId = auth().currentUser!.uid;
        const unsubscribe = getLives(userId, setLives);
        return unsubscribe;
      };

      const unsubscribe = getHeartLives();

      return () => {
        // Unsubscribe from the real-time listener when the component unmounts
        unsubscribe;
      };
    }, [lives]),
  );

  return (
    <Animated.View
      style={[
        styles.mainContainer,
        {transform: [{translateY: translate}], opacity: opacity},
      ]}>
      <View style={styles.container}>
        {(selectedLanguage.id === 1 && mandarinResult !== null) ||
        (selectedLanguage.id === 2 && malayResult !== null) ? (
          <SectionList
            style={{backgroundColor: Theme.colors.elevation.level1}}
            contentContainerStyle={{backgroundColor: Theme.colors.surface}}
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={true}
            sections={
              selectedLanguage.id === 1 ? mandarinResult! : malayResult!
            } //if selectedLanguage is chinese, use chinese result array, else use malay resullt array
            keyExtractor={(item: any, index: any) => item + index}
            renderItem={({item, index, section}) => {
              const overallIndex = calculateOverallIndex(
                selectedLanguage.id === 1 ? mandarinResult! : malayResult!,
                section.id,
                index,
              );
              //Find out whether the current topic being rendered should be active E.g. If completed modules is 0, 1 module should be active
              const isActive =
                overallIndex <
                (selectedLanguage.id === 1
                  ? numberOfCompletedChineseModules + 1
                  : numberOfCompletedMalayModules + 1);
              //Find out whether the current topic is the last completed topic
              const isLastCompletedTopic =
                overallIndex ===
                (selectedLanguage.id === 1
                  ? numberOfCompletedChineseModules
                  : numberOfCompletedMalayModules);
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
                      if (lives === 0) {
                        setDialogVisible(true);
                      } else {
                        navigation.navigate('Quiz', {
                          language:
                            selectedLanguage.id == 1 ? 'Chinese' : 'Malay',
                          module: 'Module' + (section.id + 1),
                          topic: 'Topic' + (section.data.indexOf(item) + 1),
                          isLastCompletedTopic: isLastCompletedTopic,
                        });
                      }
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
        ) : (
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator />
          </View>
        )}
      </View>
      <HeartDialog
        visible={dialogVisible}
        dismissable={true}
        dismissableBackButton={true}
        buttonText="Ok"
        onDismiss={() => setDialogVisible(false)}
        onPress={() => setDialogVisible(false)}
      />
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
  header: {
    backgroundColor: Theme.colors.elevation.level1,
    padding: Constants.edgePadding,
  },
  title: {
    fontSize: 24,
  },
});
