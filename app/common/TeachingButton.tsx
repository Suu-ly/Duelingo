import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import Tts from 'react-native-tts';

import DuoButton from './DuoButton';
import Theme from './constants/theme.json';
import Constants from './constants/Constants';

interface TeachingButtonProps {
  question: Record<string, any>;
  backgroundColor: string;
}

const TeachingButtons = (props: TeachingButtonProps) => {
  const {question, backgroundColor} = props;

  const containsEnglish = (text: string): boolean => {
    // Regular expression to match English characters
    const englishRegex = /^[a-zA-Z ]/;
    return englishRegex.test(text);
  };

  const optionContainsEnglish = containsEnglish(question.word);

  const init_tts = async () => {
    Tts.setDefaultPitch(1);
    Tts.setDefaultLanguage(optionContainsEnglish ? 'en-US' : 'zh-CN');
    Tts.setDefaultRate(optionContainsEnglish ? 0.3 : 0.5);
  };

  init_tts();

  const readText = async (text: string) => {
    Tts.stop();
    Tts.speak(text);
  };

  const selectHandler = (option: string) => {
    readText(option);
  };

  return (
    <View style={styles.teachingContainer}>
      <View style={styles.mainWordContainer}>
        <View style={styles.wordContainer}>
          <Text variant={'labelLarge'}>{question.pinyin}</Text>
          <Text variant={'displaySmall'}>{question.word}</Text>
        </View>
        <DuoButton
          filled={false}
          inactive={false}
          backgroundColor={backgroundColor}
          onPress={() => selectHandler(question.word)}
          stretch={true}
          icon="volume-high"
          textVariant="labelLarge"
          textColor={Theme.colors.onTertiary}
          borderColor={Theme.colors.tertiary}>
          Listen
        </DuoButton>
      </View>

      <View style={styles.sentenceContainer}>
        <Text variant="labelLarge" style={styles.titleText}>
          Translation:
        </Text>
        <Text variant="bodyLarge" style={styles.bodyText}>
          {question.explanation}
        </Text>
      </View>
      <View style={styles.sentenceContainer}>
        <Text variant="labelLarge" style={styles.titleText}>
          Example:
        </Text>

        <View style={styles.buttonContainer}>
          <View style={styles.sentenceTwoContainer}>
            <Text variant="bodyLarge" style={styles.bodyText}>
              {question.pinyinExample}
            </Text>
            <Text variant="bodyLarge" style={styles.bodyText}>
              {question.example}
            </Text>
          </View>
          <DuoButton
            filled={false}
            inactive={false}
            backgroundColor={backgroundColor}
            onPress={() => selectHandler(question.example)}
            stretch={false}
            icon="volume-high"
            children={false}
            textVariant="labelLarge"
            textColor={Theme.colors.onTertiary}
            borderColor={Theme.colors.tertiary}
          />
        </View>
      </View>
      <View style={styles.sentenceContainer}>
        <Text variant="labelLarge" style={styles.titleText}>
          Example Translation:
        </Text>
        <Text variant="bodyLarge" style={styles.bodyText}>
          {question.exampleTranslated}
        </Text>
      </View>
    </View>
  );
};

export default TeachingButtons;

const styles = StyleSheet.create({
  teachingContainer: {
    gap: Constants.defaultGap,
    alignSelf: 'stretch',
  },
  mainWordContainer: {
    gap: Constants.largeGap,
    alignSelf: 'stretch',
  },
  wordContainer: {
    gap: Constants.smallGap,
    paddingVertical: Constants.edgePadding,
    paddingHorizontal: Constants.edgePadding,
    borderRadius: Constants.radiusLarge,
    backgroundColor: Theme.colors.elevation.level2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Constants.smallGap,
  },

  sentenceContainer: {
    gap: Constants.smallGap,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  sentenceTwoContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: Constants.smallGap,
  },
  titleText: {
    color: Theme.colors.primary,
  },
  bodyText: {
    color: Theme.colors.onSurface,
  },
});
