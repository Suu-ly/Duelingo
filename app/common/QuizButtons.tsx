import {StyleSheet, View} from 'react-native';
import DuoButton from './DuoButton';
import Theme from './constants/theme.json';
import Constants from './constants/Constants';
import Tts from 'react-native-tts';

interface QuizButtonProps {
  question: Record<string, any>;
  backgroundColor: string;
  reveal: boolean;
  selected: string;
  onSelect: (callback: string) => void;
}

const QuizButtons = (props: QuizButtonProps) => {
  const {question, backgroundColor, reveal, selected, onSelect} = props;

  const containsEnglish = (text: string): boolean => {
    // Regular expression to match English characters
    const englishRegex = /^[a-zA-Z ]/;
    return englishRegex.test(text);
  };

  const optionContainsEnglish = containsEnglish(question.options[0]);

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
    onSelect(option);
    readText(option);
  };

  const long = () => {
    for (let i = 0; i < question.options.length; i++) {
      if (question.options[i].length > 20) {
        return true;
      }
    }
    return false;
  };

  return (
    <View style={styles.quizContainer}>
      {question.options.map((option: string, index: number) => {
        return (
          <DuoButton
            key={index}
            filled={false}
            inactive={reveal}
            backgroundColor={backgroundColor}
            onPress={() => selectHandler(option)}
            height={60}
            stretch={true}
            textVariant={long() ? 'titleMedium' : 'headlineSmall'}
            textColor={Theme.colors.onSurface}
            borderColor={
              reveal &&
              selected === option &&
              selected !== question.correct_answer
                ? Theme.colors.error
                : (reveal && question.correct_answer === option) ||
                  selected === option
                ? Theme.colors.primaryContainer
                : Theme.colors.outline
            }>
            {option}
          </DuoButton>
        );
      })}
    </View>
  );
};

export default QuizButtons;

const styles = StyleSheet.create({
  quizContainer: {
    gap: Constants.mediumGap,
    alignSelf: 'stretch',
  },
});
